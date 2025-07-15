'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Upload, 
  FileText, 
  Shield, 
  Plane, 
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react'

export default function QuickActions() {
  const router = useRouter()
  const [loading, setLoading] = useState('')

  const actions = [
    {
      id: 'upload',
      title: 'Upload Flight Log',
      description: 'Import CSV or JSON flight data',
      icon: Upload,
      color: 'bg-blue-500 hover:bg-blue-600',
      route: '/dashboard/flights?action=upload',
      shortcut: 'U'
    },
    {
      id: 'report',
      title: 'Generate Report',
      description: 'Create compliance report',
      icon: FileText,
      color: 'bg-green-500 hover:bg-green-600',
      route: '/dashboard/reports',
      shortcut: 'R'
    },
    {
      id: 'compliance',
      title: 'Check Compliance',
      description: 'Run full compliance check',
      icon: Shield,
      color: 'bg-purple-500 hover:bg-purple-600',
      route: '/dashboard/compliance',
      shortcut: 'C'
    },
    {
      id: 'aircraft',
      title: 'Add Aircraft',
      description: 'Register new drone',
      icon: Plane,
      color: 'bg-orange-500 hover:bg-orange-600',
      route: '/dashboard/aircraft?action=add',
      shortcut: 'A'
    }
  ]

  const handleAction = async (action) => {
    setLoading(action.id)
    
    // Add small delay for better UX
    setTimeout(() => {
      router.push(action.route)
      setLoading('')
    }, 300)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          <div className="flex items-center space-x-1 text-sm text-slate-500">
            <Zap className="h-4 w-4" />
            <span>Get things done fast</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            const isLoading = loading === action.id
            
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                disabled={isLoading}
                className="group relative p-6 text-left bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-200`}>
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon className="h-6 w-6 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900 group-hover:text-slate-800">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600 group-hover:text-slate-700">
                      {action.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </div>

                  {/* Keyboard shortcut */}
                  <div className="absolute bottom-4 right-4">
                    <div className="w-6 h-6 bg-slate-100 rounded border text-xs flex items-center justify-center text-slate-600 group-hover:bg-slate-200">
                      {action.shortcut}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Pro tip */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Pro Tip</h4>
              <p className="text-sm text-blue-700 mt-1">
                Use keyboard shortcuts (U, R, C, A) to quickly access these actions from anywhere in the dashboard.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}