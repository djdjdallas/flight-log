import { supabase } from '@/lib/supabase/client'
import { complianceChecker } from '@/lib/compliance/checker'

export class NotificationManager {
  constructor() {
    this.notificationTypes = {
      COMPLIANCE_VIOLATION: 'compliance',
      REGISTRATION_EXPIRY: 'expiry',
      PART107_EXPIRY: 'expiry',
      WEEKLY_SUMMARY: 'info',
      SYSTEM_UPDATE: 'info'
    };
  }

  /**
   * Create a notification for a user
   * @param {String} userId - User ID
   * @param {String} title - Notification title
   * @param {String} message - Notification message
   * @param {String} type - Notification type
   * @param {String} severity - Severity level
   * @param {Object} data - Additional data
   * @returns {Object} - Created notification
   */
  async createNotification(userId, title, message, type = 'info', severity = 'info', data = {}) {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type,
          severity,
          data
        })
        .select()
        .single();

      if (error) throw error;
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get unread notifications for a user
   * @param {String} userId - User ID
   * @param {Number} limit - Number of notifications to fetch
   * @returns {Array} - Array of notifications
   */
  async getUnreadNotifications(userId, limit = 10) {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .is('read_at', null)
        .is('dismissed_at', null)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return notifications || [];
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  }

  /**
   * Get all notifications for a user
   * @param {String} userId - User ID
   * @param {Number} limit - Number of notifications to fetch
   * @returns {Array} - Array of notifications
   */
  async getAllNotifications(userId, limit = 50) {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return notifications || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   * @param {String} notificationId - Notification ID
   * @returns {Boolean} - Success status
   */
  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param {String} userId - User ID
   * @returns {Boolean} - Success status
   */
  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .is('read_at', null);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Dismiss notification
   * @param {String} notificationId - Notification ID
   * @returns {Boolean} - Success status
   */
  async dismissNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ dismissed_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error dismissing notification:', error);
      return false;
    }
  }

  /**
   * Check and create expiry notifications
   * @param {String} userId - User ID
   * @returns {Array} - Created notifications
   */
  async checkExpiryNotifications(userId) {
    const notifications = [];

    try {
      // Get user profile
      const { data: user } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Get user settings
      const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!user || !settings?.expiry_reminders) return notifications;

      // Check Part 107 expiry
      if (user.pilot_certificate_expiry) {
        const part107Status = complianceChecker.checkPart107Expiry(user);
        
        if (part107Status.severity === 'error' || part107Status.severity === 'warning') {
          // Check if we already sent this notification recently
          const { data: existingNotifications } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', userId)
            .eq('type', 'expiry')
            .ilike('title', '%Part 107%')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

          if (!existingNotifications?.length) {
            const notification = await this.createNotification(
              userId,
              'Part 107 Certificate Expiry',
              part107Status.message,
              this.notificationTypes.PART107_EXPIRY,
              part107Status.severity,
              {
                expiry_date: user.pilot_certificate_expiry,
                days_remaining: part107Status.daysRemaining
              }
            );
            notifications.push(notification);
          }
        }
      }

      // Check aircraft registration expiry
      const { data: aircraft } = await supabase
        .from('aircraft')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      for (const ac of aircraft || []) {
        if (ac.registration_expiry) {
          const regStatus = complianceChecker.checkRegistrationExpiry(ac);
          
          if (regStatus.severity === 'error' || regStatus.severity === 'warning') {
            // Check if we already sent this notification recently
            const { data: existingNotifications } = await supabase
              .from('notifications')
              .select('id')
              .eq('user_id', userId)
              .eq('type', 'expiry')
              .ilike('title', `%${ac.registration_number}%`)
              .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

            if (!existingNotifications?.length) {
              const notification = await this.createNotification(
                userId,
                `Aircraft Registration Expiry - ${ac.registration_number}`,
                regStatus.message,
                this.notificationTypes.REGISTRATION_EXPIRY,
                regStatus.severity,
                {
                  aircraft_id: ac.id,
                  registration_number: ac.registration_number,
                  expiry_date: ac.registration_expiry,
                  days_remaining: regStatus.daysRemaining
                }
              );
              notifications.push(notification);
            }
          }
        }
      }

      return notifications;
    } catch (error) {
      console.error('Error checking expiry notifications:', error);
      return notifications;
    }
  }

  /**
   * Create compliance violation notification
   * @param {String} userId - User ID
   * @param {String} flightId - Flight ID
   * @param {Array} violations - Array of violation objects
   * @returns {Object} - Created notification
   */
  async createComplianceViolationNotification(userId, flightId, violations) {
    try {
      const violationMessages = violations.map(v => v.message).join(', ');
      const severity = violations.some(v => v.severity === 'error') ? 'error' : 'warning';
      
      const notification = await this.createNotification(
        userId,
        'Compliance Violation Detected',
        `Flight has ${violations.length} compliance issue${violations.length > 1 ? 's' : ''}: ${violationMessages}`,
        this.notificationTypes.COMPLIANCE_VIOLATION,
        severity,
        {
          flight_id: flightId,
          violations
        }
      );

      return notification;
    } catch (error) {
      console.error('Error creating compliance violation notification:', error);
      throw error;
    }
  }

  /**
   * Create weekly summary notification
   * @param {String} userId - User ID
   * @returns {Object} - Created notification
   */
  async createWeeklySummaryNotification(userId) {
    try {
      // Get flights from the last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: flights } = await supabase
        .from('flights')
        .select('compliance_status, duration_minutes')
        .eq('pilot_id', userId)
        .gte('start_time', weekAgo.toISOString());

      const totalFlights = flights?.length || 0;
      const totalHours = flights?.reduce((sum, f) => sum + (f.duration_minutes || 0), 0) / 60;
      const compliantFlights = flights?.filter(f => f.compliance_status === 'compliant').length || 0;
      const complianceRate = totalFlights > 0 ? Math.round((compliantFlights / totalFlights) * 100) : 100;

      const message = `This week: ${totalFlights} flights, ${totalHours.toFixed(1)} hours, ${complianceRate}% compliance rate`;

      const notification = await this.createNotification(
        userId,
        'Weekly Flight Summary',
        message,
        this.notificationTypes.WEEKLY_SUMMARY,
        'info',
        {
          total_flights: totalFlights,
          total_hours: totalHours,
          compliance_rate: complianceRate,
          period: 'week'
        }
      );

      return notification;
    } catch (error) {
      console.error('Error creating weekly summary notification:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   * @param {String} userId - User ID
   * @returns {Number} - Count of unread notifications
   */
  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .is('read_at', null)
        .is('dismissed_at', null);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Subscribe to notification updates
   * @param {String} userId - User ID
   * @param {Function} callback - Callback function
   * @returns {Object} - Subscription object
   */
  subscribeToNotifications(userId, callback) {
    return supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();