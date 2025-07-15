import { supabase } from '@/lib/supabase/client'

export class ComplianceChecker {
  constructor() {
    this.REMOTE_ID_WEIGHT_THRESHOLD = 0.55; // 250g in pounds
    this.REGISTRATION_WARNING_DAYS = 30;
    this.PART107_WARNING_DAYS = 60;
  }

  /**
   * Check if aircraft requires Remote ID based on weight
   * @param {Object} aircraft - Aircraft object
   * @returns {Boolean} - True if Remote ID required
   */
  checkRemoteIDRequirement(aircraft) {
    if (!aircraft.weight_lbs) return false;
    return aircraft.weight_lbs > this.REMOTE_ID_WEIGHT_THRESHOLD;
  }

  /**
   * Check aircraft registration expiry
   * @param {Object} aircraft - Aircraft object
   * @returns {Object} - Status and warning info
   */
  checkRegistrationExpiry(aircraft) {
    if (!aircraft.registration_expiry) {
      return {
        status: 'unknown',
        message: 'Registration expiry date not set',
        daysRemaining: null,
        severity: 'warning'
      };
    }

    const expiryDate = new Date(aircraft.registration_expiry);
    const today = new Date();
    const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      return {
        status: 'expired',
        message: `Registration expired ${Math.abs(daysRemaining)} days ago`,
        daysRemaining,
        severity: 'error'
      };
    }

    if (daysRemaining <= 7) {
      return {
        status: 'critical',
        message: `Registration expires in ${daysRemaining} days`,
        daysRemaining,
        severity: 'error'
      };
    }

    if (daysRemaining <= 14) {
      return {
        status: 'warning',
        message: `Registration expires in ${daysRemaining} days`,
        daysRemaining,
        severity: 'warning'
      };
    }

    if (daysRemaining <= this.REGISTRATION_WARNING_DAYS) {
      return {
        status: 'notice',
        message: `Registration expires in ${daysRemaining} days`,
        daysRemaining,
        severity: 'info'
      };
    }

    return {
      status: 'valid',
      message: 'Registration is valid',
      daysRemaining,
      severity: 'success'
    };
  }

  /**
   * Check Part 107 certificate expiry
   * @param {Object} user - User profile object
   * @returns {Object} - Status and warning info
   */
  checkPart107Expiry(user) {
    if (!user.pilot_certificate_expiry) {
      return {
        status: 'unknown',
        message: 'Part 107 certificate expiry date not set',
        daysRemaining: null,
        severity: 'warning'
      };
    }

    const expiryDate = new Date(user.pilot_certificate_expiry);
    const today = new Date();
    const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      return {
        status: 'expired',
        message: `Part 107 certificate expired ${Math.abs(daysRemaining)} days ago`,
        daysRemaining,
        severity: 'error'
      };
    }

    if (daysRemaining <= 30) {
      return {
        status: 'critical',
        message: `Part 107 certificate expires in ${daysRemaining} days`,
        daysRemaining,
        severity: 'error'
      };
    }

    if (daysRemaining <= this.PART107_WARNING_DAYS) {
      return {
        status: 'warning',
        message: `Part 107 certificate expires in ${daysRemaining} days`,
        daysRemaining,
        severity: 'warning'
      };
    }

    return {
      status: 'valid',
      message: 'Part 107 certificate is valid',
      daysRemaining,
      severity: 'success'
    };
  }

  /**
   * Validate flight compliance
   * @param {Object} flight - Flight object
   * @param {Object} aircraft - Aircraft object
   * @param {Object} user - User profile object
   * @returns {Object} - Compliance result
   */
  async validateFlightCompliance(flight, aircraft, user) {
    const violations = [];
    const warnings = [];
    const checks = [];

    // Check Remote ID requirement
    const remoteIdRequired = this.checkRemoteIDRequirement(aircraft);
    if (remoteIdRequired && !flight.remote_id_verified) {
      violations.push({
        type: 'remote_id',
        message: 'Remote ID required for aircraft over 0.55 lbs but not verified',
        severity: 'error'
      });
    }

    // Check registration expiry
    const registrationStatus = this.checkRegistrationExpiry(aircraft);
    if (registrationStatus.status === 'expired' || registrationStatus.status === 'critical') {
      violations.push({
        type: 'registration',
        message: registrationStatus.message,
        severity: 'error'
      });
    } else if (registrationStatus.status === 'warning') {
      warnings.push({
        type: 'registration',
        message: registrationStatus.message,
        severity: 'warning'
      });
    }

    // Check Part 107 expiry
    const part107Status = this.checkPart107Expiry(user);
    if (part107Status.status === 'expired' || part107Status.status === 'critical') {
      violations.push({
        type: 'part107',
        message: part107Status.message,
        severity: 'error'
      });
    } else if (part107Status.status === 'warning') {
      warnings.push({
        type: 'part107',
        message: part107Status.message,
        severity: 'warning'
      });
    }

    // Check aircraft weight requirements
    if (aircraft.weight_lbs && aircraft.weight_lbs > 55) {
      violations.push({
        type: 'weight',
        message: 'Aircraft exceeds 55 lbs weight limit for Part 107 operations',
        severity: 'error'
      });
    }

    // Check if airspace authorization is required (placeholder)
    if (flight.max_altitude_ft && flight.max_altitude_ft > 400) {
      if (!flight.airspace_authorization_id) {
        violations.push({
          type: 'airspace',
          message: 'Flight above 400 ft requires airspace authorization',
          severity: 'error'
        });
      }
    }

    // Determine overall compliance status
    let complianceStatus = 'compliant';
    if (violations.length > 0) {
      complianceStatus = 'non_compliant';
    } else if (warnings.length > 0) {
      complianceStatus = 'warning';
    }

    return {
      status: complianceStatus,
      violations,
      warnings,
      checks: [
        { type: 'remote_id', required: remoteIdRequired, verified: flight.remote_id_verified },
        { type: 'registration', status: registrationStatus },
        { type: 'part107', status: part107Status }
      ]
    };
  }

  /**
   * Get specific compliance violations for a flight
   * @param {Object} flight - Flight object
   * @returns {Array} - Array of violation objects
   */
  async getComplianceViolations(flight) {
    try {
      // Get aircraft and user data
      const { data: aircraft } = await supabase
        .from('aircraft')
        .select('*')
        .eq('id', flight.aircraft_id)
        .single();

      const { data: user } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', flight.pilot_id)
        .single();

      if (!aircraft || !user) {
        return [{
          type: 'data_missing',
          message: 'Unable to verify compliance: missing aircraft or user data',
          severity: 'error'
        }];
      }

      const complianceResult = await this.validateFlightCompliance(flight, aircraft, user);
      return complianceResult.violations || [];
    } catch (error) {
      console.error('Error checking compliance violations:', error);
      return [{
        type: 'check_failed',
        message: 'Compliance check failed due to system error',
        severity: 'error'
      }];
    }
  }

  /**
   * Calculate overall compliance score for a user
   * @param {String} userId - User ID
   * @returns {Number} - Compliance score as percentage
   */
  async calculateComplianceScore(userId) {
    try {
      const { data: flights } = await supabase
        .from('flights')
        .select('compliance_status')
        .eq('pilot_id', userId);

      if (!flights || flights.length === 0) {
        return 100; // No flights, perfect score
      }

      const compliantFlights = flights.filter(f => f.compliance_status === 'compliant').length;
      return Math.round((compliantFlights / flights.length) * 100);
    } catch (error) {
      console.error('Error calculating compliance score:', error);
      return 0;
    }
  }

  /**
   * Get compliance summary for user
   * @param {String} userId - User ID
   * @returns {Object} - Compliance summary
   */
  async getComplianceSummary(userId) {
    try {
      const { data: flights } = await supabase
        .from('flights')
        .select('id, compliance_status, start_time')
        .eq('pilot_id', userId)
        .order('start_time', { ascending: false });

      const { data: user } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: aircraft } = await supabase
        .from('aircraft')
        .select('*')
        .eq('user_id', userId);

      const totalFlights = flights?.length || 0;
      const compliantFlights = flights?.filter(f => f.compliance_status === 'compliant').length || 0;
      const nonCompliantFlights = flights?.filter(f => f.compliance_status === 'non_compliant').length || 0;
      const pendingFlights = flights?.filter(f => f.compliance_status === 'pending').length || 0;

      const score = totalFlights > 0 ? Math.round((compliantFlights / totalFlights) * 100) : 100;

      // Check upcoming expirations
      const upcomingExpirations = [];
      
      // Check Part 107 expiry
      if (user?.pilot_certificate_expiry) {
        const part107Status = this.checkPart107Expiry(user);
        if (part107Status.status !== 'valid') {
          upcomingExpirations.push({
            type: 'part107',
            item: 'Part 107 Certificate',
            ...part107Status
          });
        }
      }

      // Check aircraft registrations
      aircraft?.forEach(ac => {
        if (ac.registration_expiry) {
          const regStatus = this.checkRegistrationExpiry(ac);
          if (regStatus.status !== 'valid') {
            upcomingExpirations.push({
              type: 'registration',
              item: `${ac.manufacturer} ${ac.model} (${ac.registration_number})`,
              ...regStatus
            });
          }
        }
      });

      return {
        score,
        totalFlights,
        compliantFlights,
        nonCompliantFlights,
        pendingFlights,
        upcomingExpirations,
        lastFlightDate: flights?.[0]?.start_time || null
      };
    } catch (error) {
      console.error('Error getting compliance summary:', error);
      return {
        score: 0,
        totalFlights: 0,
        compliantFlights: 0,
        nonCompliantFlights: 0,
        pendingFlights: 0,
        upcomingExpirations: [],
        lastFlightDate: null
      };
    }
  }
}

// Export singleton instance
export const complianceChecker = new ComplianceChecker();