import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'
import Link from 'next/link'
import { Plane } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Plane className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FlightLog Pro</h1>
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>

        {/* Forgot Password Form */}
        <ForgotPasswordForm />

        {/* Footer Links */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}