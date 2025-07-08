'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function FlightStats({ flights }) {
  const totalFlights = flights.length
  const totalHours = flights.reduce((sum, flight) => sum + (flight.duration_minutes || 0), 0) / 60
  const avgFlightTime = totalFlights > 0 ? (totalHours / totalFlights) : 0
  const complianceRate = flights.filter(f => f.compliance_status === 'compliant').length / totalFlights * 100

  // Prepare chart data - flights per month
  const monthlyData = flights.reduce((acc, flight) => {
    const month = new Date(flight.start_time).toLocaleString('default', { month: 'short', year: 'numeric' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    flights: count
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalFlights}</div>
          <p className="text-xs text-muted-foreground">
            This month: {flights.filter(f => 
              new Date(f.start_time).getMonth() === new Date().getMonth()
            ).length}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Flight Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            Avg: {avgFlightTime.toFixed(1)} hours per flight
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{complianceRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {flights.filter(f => f.compliance_status === 'compliant').length} of {totalFlights} flights
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Aircraft</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Set(flights.map(f => f.aircraft_id)).size}
          </div>
          <p className="text-xs text-muted-foreground">
            Registered aircraft
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Flight Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="flights" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}