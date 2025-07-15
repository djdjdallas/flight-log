import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 3
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center'
  },
  label: {
    width: 120,
    fontWeight: 'bold',
    color: '#374151'
  },
  value: {
    flex: 1,
    color: '#1f2937'
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 5,
    fontSize: 9,
    fontWeight: 'bold'
  },
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 5,
    fontSize: 8
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151'
  },
  tableCell: {
    margin: 'auto',
    fontSize: 8,
    color: '#1f2937'
  },
  complianceGood: {
    color: '#059669',
    fontWeight: 'bold'
  },
  complianceBad: {
    color: '#dc2626',
    fontWeight: 'bold'
  },
  compliancePending: {
    color: '#d97706',
    fontWeight: 'bold'
  },
  summary: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3
  },
  summaryLabel: {
    fontWeight: 'bold',
    color: '#374151'
  },
  summaryValue: {
    color: '#1f2937'
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    fontSize: 8,
    color: '#6b7280'
  }
})

const getComplianceColor = (status) => {
  switch (status) {
    case 'compliant':
      return styles.complianceGood
    case 'non_compliant':
      return styles.complianceBad
    default:
      return styles.compliancePending
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatLocation = (location) => {
  if (!location || typeof location !== 'object') return 'N/A'
  if (location.address) return location.address
  if (location.lat && location.lng) {
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
  }
  return 'N/A'
}

const ComplianceReport = ({ data }) => {
  const { reportType, dateRange, pilot, flights, options } = data
  
  // Calculate summary statistics
  const totalFlights = flights.length
  const compliantFlights = flights.filter(f => f.compliance_status === 'compliant').length
  const remoteIdVerified = flights.filter(f => f.remote_id_verified).length
  const totalFlightTime = flights.reduce((acc, f) => acc + (f.duration_minutes || 0), 0)
  const complianceRate = totalFlights > 0 ? Math.round((compliantFlights / totalFlights) * 100) : 0
  const remoteIdRate = totalFlights > 0 ? Math.round((remoteIdVerified / totalFlights) * 100) : 0

  // Group flights by aircraft
  const flightsByAircraft = flights.reduce((acc, flight) => {
    const aircraftKey = flight.aircraft?.registration_number || 'Unknown'
    if (!acc[aircraftKey]) {
      acc[aircraftKey] = []
    }
    acc[aircraftKey].push(flight)
    return acc
  }, {})

  const getReportTitle = () => {
    switch (reportType) {
      case 'audit':
        return 'FAA Regulatory Audit Report'
      case 'part107':
        return 'Part 107 Operations Report'
      case 'remote_id':
        return 'Remote ID Compliance Report'
      case 'maintenance':
        return 'Maintenance Log Report'
      default:
        return 'Flight Compliance Report'
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{getReportTitle()}</Text>
          <Text style={styles.subtitle}>
            Report Period: {formatDate(dateRange.from)} to {formatDate(dateRange.to)}
          </Text>
          <Text style={styles.subtitle}>
            Generated: {formatDateTime(new Date().toISOString())}
          </Text>
        </View>

        {/* Pilot Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilot Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{pilot.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{pilot.email}</Text>
          </View>
          {pilot.certificate && (
            <View style={styles.row}>
              <Text style={styles.label}>Certificate #:</Text>
              <Text style={styles.value}>{pilot.certificate}</Text>
            </View>
          )}
        </View>

        {/* Summary Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Flights:</Text>
              <Text style={styles.summaryValue}>{totalFlights}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Flight Time:</Text>
              <Text style={styles.summaryValue}>{Math.round(totalFlightTime / 60)} hours {totalFlightTime % 60} minutes</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Compliance Rate:</Text>
              <Text style={[styles.summaryValue, complianceRate >= 95 ? styles.complianceGood : styles.complianceBad]}>
                {complianceRate}% ({compliantFlights}/{totalFlights})
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Remote ID Verification:</Text>
              <Text style={[styles.summaryValue, remoteIdRate >= 95 ? styles.complianceGood : styles.complianceBad]}>
                {remoteIdRate}% ({remoteIdVerified}/{totalFlights})
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Aircraft Used:</Text>
              <Text style={styles.summaryValue}>{Object.keys(flightsByAircraft).length}</Text>
            </View>
          </View>
        </View>

        {/* Flight Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Details</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Date</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Aircraft</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Duration</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Location</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Remote ID</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Compliance</Text>
              </View>
            </View>

            {/* Table Rows */}
            {flights.map((flight, index) => (
              <View style={styles.tableRow} key={flight.id}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {formatDate(flight.start_time)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {flight.aircraft?.registration_number || 'N/A'}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {flight.duration_minutes ? `${flight.duration_minutes}m` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {formatLocation(flight.takeoff_location)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, flight.remote_id_verified ? styles.complianceGood : styles.complianceBad]}>
                    {flight.remote_id_verified ? 'Yes' : 'No'}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, getComplianceColor(flight.compliance_status)]}>
                    {flight.compliance_status?.replace('_', ' ') || 'Pending'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Aircraft Summary */}
        {Object.keys(flightsByAircraft).length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aircraft Summary</Text>
            {Object.entries(flightsByAircraft).map(([aircraft, aircraftFlights]) => (
              <View key={aircraft} style={styles.row}>
                <Text style={styles.label}>{aircraft}:</Text>
                <Text style={styles.value}>
                  {aircraftFlights.length} flights, {aircraftFlights.reduce((acc, f) => acc + (f.duration_minutes || 0), 0)} minutes
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Compliance Notes */}
        {reportType === 'audit' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compliance Notes</Text>
            <Text style={styles.value}>
              This report contains all flight operations conducted under Part 107 regulations during the specified period.
              All flights have been reviewed for Remote ID compliance and regulatory adherence.
            </Text>
            {complianceRate < 95 && (
              <Text style={[styles.value, { marginTop: 5, color: '#dc2626' }]}>
                Notice: Compliance rate is below 95%. Please review non-compliant flights and take corrective action.
              </Text>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by FlightLog Pro - Professional Drone Flight Logging</Text>
          <Text>This report was automatically generated and contains data from verified flight logs.</Text>
        </View>
      </Page>
    </Document>
  )
}

export const generateComplianceReport = async (reportData) => {
  const doc = <ComplianceReport data={reportData} />
  const pdfBlob = await pdf(doc).toBlob()
  return pdfBlob
}