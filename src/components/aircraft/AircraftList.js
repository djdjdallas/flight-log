'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plane, MoreHorizontal, Edit, Trash2, Plus, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react'
import { complianceChecker } from '@/lib/compliance/checker'

export default function AircraftList() {
  const [aircraft, setAircraft] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAircraft()
  }, [])

  async function fetchAircraft() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('aircraft')
        .select(`
          id,
          registration_number,
          registration_expiry,
          manufacturer,
          model,
          serial_number,
          remote_id_serial,
          remote_id_type,
          weight_lbs,
          status,
          created_at,
          batteries (
            id,
            serial_number,
            status
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAircraft(data || [])
    } catch (error) {
      console.error('Error fetching aircraft:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this aircraft?')) return

    try {
      const { error } = await supabase
        .from('aircraft')
        .delete()
        .eq('id', id)

      if (error) throw error
      setAircraft(prev => prev.filter(a => a.id !== id))
    } catch (error) {
      console.error('Error deleting aircraft:', error)
      alert('Failed to delete aircraft')
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      retired: 'bg-gray-100 text-gray-800'
    }
    return variants[status] || variants.active
  }

  const getComplianceStatus = (aircraft) => {
    // Check registration expiry
    const registrationStatus = complianceChecker.checkRegistrationExpiry(aircraft)
    
    // Check Remote ID requirement
    const remoteIdRequired = complianceChecker.checkRemoteIDRequirement(aircraft)
    const hasRemoteId = aircraft.remote_id_serial

    // Determine overall compliance
    if (registrationStatus.severity === 'error' || (remoteIdRequired && !hasRemoteId)) {
      return {
        status: 'non_compliant',
        severity: 'error',
        icon: AlertTriangle,
        message: 'Compliance issues detected'
      }
    }

    if (registrationStatus.severity === 'warning') {
      return {
        status: 'warning',
        severity: 'warning',
        icon: Clock,
        message: 'Renewal required soon'
      }
    }

    return {
      status: 'compliant',
      severity: 'success',
      icon: CheckCircle,
      message: 'Fully compliant'
    }
  }

  const getComplianceBadge = (aircraft) => {
    const compliance = getComplianceStatus(aircraft)
    const variants = {
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800'
    }
    
    const Icon = compliance.icon
    
    return (
      <Badge className={variants[compliance.severity]}>
        <Icon className="h-3 w-3 mr-1" />
        {compliance.message}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                <div className="bg-gray-200 h-4 w-full rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (aircraft.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <Plane className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Aircraft Added</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first aircraft to the fleet.</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Aircraft
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {aircraft.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {item.manufacturer} {item.model}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {item.registration_number}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusBadge(item.status)}>
                    {item.status}
                  </Badge>
                  <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>
                {getComplianceBadge(item)}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Serial Number</p>
                  <p className="font-medium">{item.serial_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Weight</p>
                  <p className="font-medium">{item.weight_lbs ? `${item.weight_lbs} lbs` : 'N/A'}</p>
                </div>
              </div>
              
              {/* Remote ID Status */}
              <div className="text-sm">
                <p className="text-gray-600">Remote ID Status</p>
                <div className="flex items-center space-x-2">
                  {complianceChecker.checkRemoteIDRequirement(item) ? (
                    item.remote_id_serial ? (
                      <div className="flex items-center space-x-1">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">Required & Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-600">Required but Missing</span>
                      </div>
                    )
                  ) : (
                    <span className="font-medium text-gray-600">Not Required</span>
                  )}
                </div>
                {item.remote_id_serial && (
                  <p className="text-xs text-gray-500 mt-1">
                    Serial: {item.remote_id_serial} ({item.remote_id_type})
                  </p>
                )}
              </div>

              {/* Registration Expiry */}
              {item.registration_expiry && (
                <div className="text-sm">
                  <p className="text-gray-600">Registration Expiry</p>
                  <p className="font-medium">
                    {new Date(item.registration_expiry).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {complianceChecker.checkRegistrationExpiry(item).message}
                  </p>
                </div>
              )}
              
              <div className="text-sm">
                <p className="text-gray-600">Batteries</p>
                <p className="font-medium">
                  {item.batteries?.length || 0} registered
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}