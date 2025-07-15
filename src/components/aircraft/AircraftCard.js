'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plane, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Shield,
  Calendar,
  Weight,
  Hash
} from 'lucide-react'
import { complianceChecker } from '@/lib/compliance/checker'

export default function AircraftCard({ aircraft, onEdit, onDelete }) {
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
        message: 'Issues detected'
      }
    }

    if (registrationStatus.severity === 'warning') {
      return {
        status: 'warning',
        severity: 'warning',
        icon: Clock,
        message: 'Renewal needed'
      }
    }

    return {
      status: 'compliant',
      severity: 'success',
      icon: CheckCircle,
      message: 'Compliant'
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

  const remoteIdRequired = complianceChecker.checkRemoteIDRequirement(aircraft)
  const registrationStatus = complianceChecker.checkRegistrationExpiry(aircraft)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center">
              <Plane className="h-5 w-5 mr-2 text-slate-600" />
              {aircraft.manufacturer} {aircraft.model}
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              {aircraft.registration_number}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
              <Badge className={getStatusBadge(aircraft.status)}>
                {aircraft.status}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(aircraft)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(aircraft.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {getComplianceBadge(aircraft)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-sm">
            <Hash className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-slate-600">Serial</p>
              <p className="font-medium">{aircraft.serial_number || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Weight className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-slate-600">Weight</p>
              <p className="font-medium">{aircraft.weight_lbs ? `${aircraft.weight_lbs} lbs` : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Registration Status */}
        <div className="border-t pt-3">
          <div className="flex items-center space-x-2 text-sm mb-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-slate-700">Registration</span>
          </div>
          {aircraft.registration_expiry ? (
            <div className="pl-6 space-y-1">
              <p className="text-sm">
                Expires: {new Date(aircraft.registration_expiry).toLocaleDateString()}
              </p>
              <p className={`text-xs ${
                registrationStatus.severity === 'error' ? 'text-red-600' :
                registrationStatus.severity === 'warning' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {registrationStatus.message}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 pl-6">No expiry date set</p>
          )}
        </div>

        {/* Remote ID Status */}
        <div className="border-t pt-3">
          <div className="flex items-center space-x-2 text-sm mb-2">
            <Shield className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-slate-700">Remote ID</span>
          </div>
          <div className="pl-6 space-y-1">
            {remoteIdRequired ? (
              aircraft.remote_id_serial ? (
                <div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Required & Active</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Serial: {aircraft.remote_id_serial}
                  </p>
                  <p className="text-xs text-slate-500">
                    Type: {aircraft.remote_id_type || 'Standard'}
                  </p>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Required but Missing</span>
                </div>
              )
            ) : (
              <span className="text-sm text-slate-500">Not required (under 0.55 lbs)</span>
            )}
          </div>
        </div>

        {/* Batteries */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Batteries</span>
            <span className="text-sm text-slate-600">
              {aircraft.batteries?.length || 0} registered
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}