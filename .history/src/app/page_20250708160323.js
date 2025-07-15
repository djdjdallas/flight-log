"use client";
import React, { useState } from "react";
import {
  Plane,
  Shield,
  BarChart3,
  FileText,
  Check,
  Menu,
  X,
  ChevronRight,
  Globe,
  Zap,
  Users,
  Award,
  ArrowRight,
  Cloud,
  Cpu,
  Lock,
  Gauge,
} from "lucide-react";

export default function AeroNoteLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                  <Plane className="h-5 w-5 text-white transform -rotate-45" />
                </div>
                <span className="text-xl font-bold text-slate-900">
                  AeroNote
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Pricing
              </a>
              <a
                href="#integrations"
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Integrations
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Docs
              </a>
              <button className="text-slate-600 hover:text-slate-900 font-medium">
                Sign In
              </button>
              <button className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors font-medium">
                Start Free Trial
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Pricing
              </a>
              <a
                href="#integrations"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Integrations
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Docs
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Sign In
              </a>
              <button className="w-full mt-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors font-medium">
                Start Free Trial
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                <span>FAA Remote ID Compliant</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Flight Intelligence for
                <span className="text-sky-500">
                  {" "}
                  Professional Drone Operations
                </span>
              </h1>

              <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto">
                Transform flight logs into compliance reports, operational
                insights, and regulatory documentation in seconds. Trusted by
                over 5,000 commercial operators.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-sky-500 text-white px-8 py-4 rounded-lg hover:bg-sky-600 transition-colors font-medium text-lg inline-flex items-center justify-center">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="bg-white text-slate-900 px-8 py-4 rounded-lg hover:bg-slate-50 transition-colors font-medium text-lg border border-slate-200">
                  View Demo
                </button>
              </div>

              <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>SOC 2 Compliant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-30"></div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-medium text-slate-500 mb-8">
              TRUSTED BY LEADING DRONE SERVICE PROVIDERS
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="text-center font-bold text-xl text-slate-400">
                DroneBase
              </div>
              <div className="text-center font-bold text-xl text-slate-400">
                SkyVue
              </div>
              <div className="text-center font-bold text-xl text-slate-400">
                AeroInspect
              </div>
              <div className="text-center font-bold text-xl text-slate-400">
                FlightOps
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Everything you need for compliant drone operations
              </h2>
              <p className="mt-4 text-xl text-slate-600">
                From automated log parsing to enterprise-grade reporting
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                  <Cpu className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Intelligent Compliance Engine
                </h3>
                <p className="text-slate-600">
                  Automated Remote ID verification, real-time airspace
                  authorization tracking, and instant audit-ready reports.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Universal Log Parser
                </h3>
                <p className="text-slate-600">
                  Support for 15+ drone manufacturers with automatic flight
                  detection and cloud sync across all devices.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Advanced Analytics
                </h3>
                <p className="text-slate-600">
                  Fleet performance metrics, pilot efficiency tracking, and
                  predictive maintenance alerts in real-time.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Enterprise Integration
                </h3>
                <p className="text-slate-600">
                  API access for custom workflows, team management, permissions,
                  and white-label options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-slate-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">10M+</div>
                <div className="text-slate-400">Flight hours logged</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                <div className="text-slate-400">Compliance rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">5,000+</div>
                <div className="text-slate-400">Active operators</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-xl text-slate-600">
                Choose the plan that fits your operation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Pilot Plan */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Pilot
                </h3>
                <p className="text-slate-600 mb-6">
                  Perfect for individual operators
                </p>
                <div className="text-4xl font-bold text-slate-900 mb-6">
                  $29
                  <span className="text-lg font-normal text-slate-500">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">1 pilot account</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Up to 3 aircraft</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">
                      Basic compliance reports
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Mobile app access</span>
                  </li>
                </ul>
                <button className="w-full bg-white text-slate-900 px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium border border-slate-200">
                  Start Free Trial
                </button>
              </div>

              {/* Team Plan */}
              <div className="bg-slate-900 p-8 rounded-2xl text-white relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-sky-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">Team</h3>
                <p className="text-slate-400 mb-6">
                  For growing drone operations
                </p>
                <div className="text-4xl font-bold mb-6">
                  $99
                  <span className="text-lg font-normal text-slate-400">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">
                      Up to 5 pilot accounts
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Up to 10 aircraft</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">API access</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Priority support</span>
                  </li>
                </ul>
                <button className="w-full bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors font-medium">
                  Start Free Trial
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Enterprise
                </h3>
                <p className="text-slate-600 mb-6">
                  For large-scale operations
                </p>
                <div className="text-4xl font-bold text-slate-900 mb-6">
                  Custom
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">
                      Unlimited pilots & aircraft
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">White label options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Custom integrations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Dedicated support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">SLA guarantee</span>
                  </li>
                </ul>
                <button className="w-full bg-white text-slate-900 px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium border border-slate-200">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-sky-500 to-sky-600 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to streamline your drone operations?
            </h2>
            <p className="text-xl text-sky-100 mb-8">
              Join thousands of professional operators who save 10+ hours per
              week with AeroNote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-sky-600 px-8 py-4 rounded-lg hover:bg-sky-50 transition-colors font-medium text-lg inline-flex items-center justify-center">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="bg-sky-600 text-white px-8 py-4 rounded-lg hover:bg-sky-700 transition-colors font-medium text-lg border border-sky-400">
                Schedule a Demo
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Changelog
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>

                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Security
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Compliance
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                  <Plane className="h-5 w-5 text-white transform -rotate-45" />
                </div>
                <span className="text-xl font-bold">AeroNote</span>
              </div>
              <p className="text-slate-400 text-sm">
                © 2024 AeroNote. All rights reserved. | SOC 2 Type II Certified
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
