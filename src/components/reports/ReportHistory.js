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
import { 
  FileText, 
  Download, 
  Calendar, 
  MoreHorizontal, 
  Trash2,
  Eye,
  History,
  AlertTriangle
} from 'lucide-react'

export default function ReportHistory() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReports()
  }, [])

  async function fetchReports() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('No user found')
        return
      }

      console.log('Fetching reports for user:', user.id)

      const { data, error } = await supabase
        .from('compliance_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false })

      console.log('Reports query result:', { data, error })

      if (error) throw error
      setReports(data || [])
      console.log('Reports set:', data || [])
    } catch (err) {
      console.error('Error fetching reports:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this report?')) return

    try {
      const { error } = await supabase
        .from('compliance_reports')
        .delete()
        .eq('id', id)

      if (error) throw error
      setReports(prev => prev.filter(r => r.id !== id))
    } catch (error) {
      console.error('Error deleting report:', error)
      alert('Failed to delete report')
    }
  }

  const handleRegenerate = async (report) => {
    // TODO: Implement report regeneration
    console.log('Regenerating report:', report.id)
    alert('Report regeneration will be implemented in the next update')
  }

  const getReportTypeBadge = (type) => {
    const variants = {
      audit: { color: 'bg-blue-100 text-blue-800', label: 'Audit Report' },
      part107: { color: 'bg-green-100 text-green-800', label: 'Part 107' },
      remote_id: { color: 'bg-purple-100 text-purple-800', label: 'Remote ID' },
      maintenance: { color: 'bg-orange-100 text-orange-800', label: 'Maintenance' }
    }
    
    const variant = variants[type] || { color: 'bg-gray-100 text-gray-800', label: type }
    
    return (
      <Badge className={variant.color}>
        {variant.label}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    const end = new Date(endDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    return `${start} - ${end}`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Report History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-16 w-full rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Report History
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchReports}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2" />
          Report History
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Generated</h3>
            <p className="text-gray-600">
              Generate your first compliance report to start tracking your flight operations.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {getReportTypeBadge(report.report_type)}
                      <Badge variant="outline" className="text-xs">
                        {report.flight_ids?.length || 0} flights
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900">
                      {formatDateRange(report.date_range_start, report.date_range_end)}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Generated {formatDate(report.generated_at)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Downloaded {report.download_count || 0} times
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleRegenerate(report)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Regenerate & Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Report Summary */}
                <div className="bg-gray-50 rounded-md p-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Date Range:</span>
                      <p className="font-medium">
                        {Math.ceil((new Date(report.date_range_end) - new Date(report.date_range_start)) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Flights:</span>
                      <p className="font-medium">{report.flight_ids?.length || 0}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <Badge className={report.status === 'generated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {reports.length >= 10 && (
              <div className="text-center pt-4">
                <Button variant="outline" onClick={fetchReports}>
                  Load More Reports
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}