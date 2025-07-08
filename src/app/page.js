import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Shield, BarChart3, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FlightLog Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Professional Drone
            <span className="text-blue-600"> Flight Logging</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Ensure Remote ID compliance with automated flight log parsing, comprehensive reporting, 
            and regulatory audit trails for commercial drone operations.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600" />
                <CardTitle>Remote ID Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automated compliance tracking for FAA Remote ID requirements with real-time verification.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-green-600" />
                <CardTitle>Automated Log Import</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Import flight logs from DJI, Autel, and other major drone manufacturers automatically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive flight statistics, compliance rates, and operational insights.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Plane className="h-8 w-8 text-orange-600" />
                <CardTitle>Fleet Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage multiple aircraft, batteries, and pilots with organization-level reporting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to ensure compliance?</h2>
          <p className="mt-4 text-xl">
            Join hundreds of commercial drone operators who trust FlightLog Pro for regulatory compliance.
          </p>
          <div className="mt-8">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary">
                Start Your Free Trial Today
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 FlightLog Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}