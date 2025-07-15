'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Filter, X, Download } from 'lucide-react'

export default function FlightFilters({ onFiltersChange, onExport }) {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    aircraftId: '',
    complianceStatus: '',
    remoteIdVerified: ''
  })
  const [aircraft, setAircraft] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    fetchAircraft()
  }, [])

  useEffect(() => {
    onFiltersChange?.(filters)
  }, [filters, onFiltersChange])

  async function fetchAircraft() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('aircraft')
        .select('id, registration_number, manufacturer, model')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('manufacturer')

      setAircraft(data || [])
    } catch (error) {
      console.error('Error fetching aircraft:', error)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      aircraftId: '',
      complianceStatus: '',
      remoteIdVerified: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  const getDatePreset = (preset) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (preset) {
      case 'today':
        return {
          dateFrom: today.toISOString().split('T')[0],
          dateTo: today.toISOString().split('T')[0]
        }
      case 'week':
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return {
          dateFrom: weekAgo.toISOString().split('T')[0],
          dateTo: today.toISOString().split('T')[0]
        }
      case 'month':
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return {
          dateFrom: monthAgo.toISOString().split('T')[0],
          dateTo: today.toISOString().split('T')[0]
        }
      case 'year':
        const yearAgo = new Date(today)
        yearAgo.setFullYear(yearAgo.getFullYear() - 1)
        return {
          dateFrom: yearAgo.toISOString().split('T')[0],
          dateTo: today.toISOString().split('T')[0]
        }
      default:
        return {}
    }
  }

  const applyDatePreset = (preset) => {
    const dateRange = getDatePreset(preset)
    setFilters(prev => ({
      ...prev,
      ...dateRange
    }))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Flights
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-normal">
                Active
              </span>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Date Presets */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyDatePreset('today')}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyDatePreset('week')}
          >
            Last 7 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyDatePreset('month')}
          >
            Last 30 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyDatePreset('year')}
          >
            Last Year
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Detailed Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-100">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="aircraft">Aircraft</Label>
              <Select 
                value={filters.aircraftId} 
                onValueChange={(value) => handleFilterChange('aircraftId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All aircraft" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All aircraft</SelectItem>
                  {aircraft.map((aircraft) => (
                    <SelectItem key={aircraft.id} value={aircraft.id}>
                      {aircraft.manufacturer} {aircraft.model} ({aircraft.registration_number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="compliance">Compliance Status</Label>
              <Select 
                value={filters.complianceStatus} 
                onValueChange={(value) => handleFilterChange('complianceStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="remoteId">Remote ID</Label>
              <Select 
                value={filters.remoteIdVerified} 
                onValueChange={(value) => handleFilterChange('remoteIdVerified', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All flights" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All flights</SelectItem>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Not Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800 font-medium mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.dateFrom && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  From: {filters.dateFrom}
                </span>
              )}
              {filters.dateTo && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  To: {filters.dateTo}
                </span>
              )}
              {filters.aircraftId && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  Aircraft: {aircraft.find(a => a.id === filters.aircraftId)?.registration_number}
                </span>
              )}
              {filters.complianceStatus && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  Status: {filters.complianceStatus.replace('_', ' ')}
                </span>
              )}
              {filters.remoteIdVerified && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  Remote ID: {filters.remoteIdVerified === 'true' ? 'Verified' : 'Not Verified'}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}