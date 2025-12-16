'use client'
import { useState, useCallback } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import FlightList from '@/components/flights/FlightList'
import FlightFilters from '@/components/flights/FlightFilters'
import AddFlightButton from '@/components/flights/AddFlightButton'

export default function FlightsPage() {
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  const handleFlightAdded = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Flight Logs</h1>
            <p className="text-gray-600 mt-2">View and manage your flight history and compliance data</p>
          </div>
          <AddFlightButton onFlightAdded={handleFlightAdded} />
        </div>

        {/* Filters */}
        <FlightFilters onFiltersChange={handleFiltersChange} />

        {/* Flight List */}
        <FlightList filters={filters} onFlightAdded={handleFlightAdded} key={refreshKey} />
      </div>
    </DashboardLayout>
  )
}