"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  Shield,
  BarChart3,
  FileText,
  Check,
  Menu,
  X,
  ArrowRight,
  Globe,
  Zap,
  Clock,
  Bell,
  Download,
  ChevronRight,
  Star,
} from "lucide-react";

export default function AeroNoteLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-hero/95 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center">
                <Plane className="h-5 w-5 text-white transform -rotate-45" />
              </div>
              <span className="text-xl font-bold text-white">AeroNote</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-white/80 hover:text-white transition-colors text-[15px] font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-white/80 hover:text-white transition-colors text-[15px] font-medium"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors text-[15px] font-medium"
              >
                Resources
              </a>
              <button
                onClick={() => router.push("/auth/login")}
                className="text-white/80 hover:text-white transition-colors text-[15px] font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/auth/signup")}
                className="bg-white text-hero px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-colors text-[15px] font-medium shadow-sm"
              >
                Start Free Trial
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
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
          <div className="md:hidden bg-hero border-t border-white/10">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <a
                href="#features"
                className="block px-3 py-3 text-white/80 hover:text-white font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-3 text-white/80 hover:text-white font-medium"
              >
                Pricing
              </a>
              <a
                href="#"
                className="block px-3 py-3 text-white/80 hover:text-white font-medium"
              >
                Resources
              </a>
              <button
                onClick={() => router.push("/auth/login")}
                className="block w-full text-left px-3 py-3 text-white/80 hover:text-white font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/auth/signup")}
                className="w-full mt-3 bg-white text-hero px-6 py-3 rounded-lg font-medium"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen bg-hero overflow-hidden">
          {/* Background Video */}
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/drone-hero.mp4" type="video/mp4" />
            </video>
            {/* Video overlay for text readability */}
            <div className="absolute inset-0 bg-hero/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-hero-light/30 via-transparent to-hero" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-sky-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-32">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>FAA Remote ID & Part 107 Compliant</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                Drone compliance,{" "}
                <span className="text-sky-400">simplified.</span>
              </h1>

              {/* Subheadline */}
              <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
                Import flight logs, track certifications, and generate
                audit-ready reports in seconds. Built for professional drone
                operators who need to stay compliant.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/auth/signup")}
                  className="bg-white text-hero px-8 py-4 rounded-lg hover:bg-slate-100 transition-all font-medium text-lg inline-flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="bg-transparent text-white px-8 py-4 rounded-lg hover:bg-white/5 transition-all font-medium text-lg border border-white/30 hover:border-white/50">
                  Watch Demo
                </button>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Product Preview - Floating Card */}
            <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-[480px]">
              <div className="bg-white rounded-2xl shadow-float p-6 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Check className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Compliance Score
                      </p>
                      <p className="text-sm text-slate-500">All checks passed</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-emerald-600">98%</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-sky-500" />
                      <span className="text-sm font-medium text-slate-700">
                        Remote ID Verified
                      </span>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-sky-500" />
                      <span className="text-sm font-medium text-slate-700">
                        Part 107 Certificate
                      </span>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                      Valid
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Plane className="h-5 w-5 text-sky-500" />
                      <span className="text-sm font-medium text-slate-700">
                        Aircraft Registration
                      </span>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                      Expires in 45d
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="bg-white py-16 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-medium text-slate-400 mb-10 tracking-widest uppercase">
              Trusted by 5,000+ operators. Featured in drone industry publications.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
              <div className="text-2xl font-semibold text-slate-200 tracking-tight">
                DroneBase
              </div>
              <div className="text-2xl font-semibold text-slate-200 tracking-tight">
                SkyVue
              </div>
              <div className="text-2xl font-semibold text-slate-200 tracking-tight">
                AeroInspect
              </div>
              <div className="text-2xl font-semibold text-slate-200 tracking-tight">
                FlightOps
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 lg:py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                <span>POWERFUL FEATURES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Everything you need to<br />stay compliant
              </h2>
              <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
                From automated log parsing to enterprise-grade compliance reporting
              </p>
            </div>

            {/* Feature 1 - Universal Log Import */}
            <div className="mb-24 lg:mb-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="order-2 lg:order-1">
                  <div className="inline-flex items-center space-x-2 bg-sky-100 text-sky-700 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                    <Download className="h-4 w-4" />
                    <span>Log Import</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                    Universal Log Import
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed mb-8">
                    Import flight logs from DJI, Autel, and other manufacturers.
                    Automatic parsing extracts flight data, GPS tracks, and telemetry instantly.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Drag & drop simplicity</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">All major manufacturers supported</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Instant data extraction</span>
                    </li>
                  </ul>
                </div>
                <div className="order-1 lg:order-2">
                  {/* Image placeholder - replace src with your screenshot */}
                  <div className="relative">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                      <img
                        src="/feature-log-import.png"
                        alt="Log Import Feature"
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Compliance Monitoring */}
            <div className="mb-24 lg:mb-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div>
                  {/* Image placeholder - replace src with your screenshot */}
                  <div className="relative">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                      <img
                        src="/feature-compliance.png"
                        alt="Compliance Monitoring Feature"
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                    <Shield className="h-4 w-4" />
                    <span>Compliance</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                    Compliance Monitoring
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed mb-8">
                    Real-time tracking of Remote ID, Part 107 certification, and aircraft
                    registration. Get alerts before anything expires.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Real-time status dashboard</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Expiration tracking</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">FAA regulation updates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Feature 3 - Audit-Ready Reports */}
            <div className="mb-24 lg:mb-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="order-2 lg:order-1">
                  <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                    <FileText className="h-4 w-4" />
                    <span>Reports</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                    Audit-Ready Reports
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed mb-8">
                    Generate professional PDF reports in seconds. Perfect for FAA audits,
                    client deliverables, and internal documentation.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">One-click PDF generation</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Customizable templates</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">FAA-compliant formatting</span>
                    </li>
                  </ul>
                </div>
                <div className="order-1 lg:order-2">
                  {/* Image placeholder - replace src with your screenshot */}
                  <div className="relative">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                      <img
                        src="/feature-reports.png"
                        alt="Audit Reports Feature"
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 - Smart Notifications */}
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div>
                  {/* Image placeholder - replace src with your screenshot */}
                  <div className="relative">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                      <img
                        src="/feature-notifications.png"
                        alt="Smart Notifications Feature"
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                    Smart Notifications
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed mb-8">
                    Never miss a renewal. Automatic reminders for certificate expirations,
                    registration renewals, and compliance deadlines.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Email & in-app alerts</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Custom reminder schedules</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Team-wide notifications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-20 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-slate-900 mb-3">10M+</div>
                <div className="text-slate-500 text-lg">Flight hours logged</div>
              </div>
              <div className="text-center md:border-x border-slate-200 md:px-8">
                <div className="text-5xl lg:text-6xl font-bold text-slate-900 mb-3">99.9%</div>
                <div className="text-slate-500 text-lg">Compliance rate</div>
              </div>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-slate-900 mb-3">5,000+</div>
                <div className="text-slate-500 text-lg">Active operators</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span>PRICING</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Simple plans for<br />serious work
              </h2>
              <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
                Start free, upgrade when you need more. No hidden fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {/* Pilot Plan */}
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-slate-300 transition-all duration-300">
                <div className="mb-6">
                  <span className="text-sm font-medium text-slate-500">For individuals</span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">Pilot</h3>
                </div>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-slate-900">$29</span>
                  <span className="text-slate-500 ml-1">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">1 pilot account</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">Up to 3 aircraft</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">Compliance reports</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">Email notifications</span>
                  </li>
                </ul>
                <button
                  onClick={() => router.push("/auth/signup")}
                  className="w-full bg-white text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors font-medium border border-slate-200 text-sm"
                >
                  Start Free Trial
                </button>
              </div>

              {/* Team Plan - Featured */}
              <div className="bg-hero p-8 rounded-3xl text-white relative shadow-xl ring-1 ring-slate-900/5">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-sky-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
                <div className="mb-6 pt-2">
                  <span className="text-sm font-medium text-slate-400">For growing operations</span>
                  <h3 className="text-2xl font-bold text-white mt-1">Team</h3>
                </div>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-white">$99</span>
                  <span className="text-slate-400 ml-1">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">Up to 5 pilots</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">Up to 15 aircraft</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">API access</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">Priority support</span>
                  </li>
                </ul>
                <button
                  onClick={() => router.push("/auth/signup")}
                  className="w-full bg-white text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors font-medium text-sm"
                >
                  Start Free Trial
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-slate-300 transition-all duration-300">
                <div className="mb-6">
                  <span className="text-sm font-medium text-slate-500">For large-scale ops</span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">Enterprise</h3>
                </div>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-slate-900">Custom</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">Unlimited pilots</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">Unlimited aircraft</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">Custom integrations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">Dedicated support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">SLA guarantee</span>
                  </li>
                </ul>
                <button className="w-full bg-white text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors font-medium border border-slate-200 text-sm">
                  Contact Sales
                </button>
              </div>
            </div>

            {/* Trust note */}
            <p className="text-center text-sm text-slate-500 mt-10">
              14-day free trial · No credit card required · Cancel anytime
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 lg:py-32 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4 fill-amber-500" />
                <span>TESTIMONIALS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Loved by drone<br />operators everywhere
              </h2>
            </div>
          </div>

          {/* Scrolling Testimonials with Edge Fade */}
          <div className="relative">
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-32 lg:w-64 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-32 lg:w-64 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            {/* Scrollable container */}
            <div className="flex gap-6 overflow-x-auto pb-4 px-8 lg:px-16 scrollbar-hide snap-x snap-mandatory">
              {/* Testimonial 1 */}
              <div className="flex-shrink-0 w-[350px] lg:w-[400px] bg-white p-8 rounded-2xl border border-slate-200 snap-center">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="text-slate-700 leading-relaxed mb-6">
                  "AeroNote has transformed how we manage compliance. What used to take hours now takes minutes. Our pilots can focus on flying, not paperwork."
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-sky-600 font-semibold text-sm">MT</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Michael Torres</div>
                    <div className="text-slate-500 text-xs">Chief Pilot, SkyVue Aerial</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="flex-shrink-0 w-[350px] lg:w-[400px] bg-white p-8 rounded-2xl border border-slate-200 snap-center">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="text-slate-700 leading-relaxed mb-6">
                  "The automatic log parsing is a game-changer. I upload my DJI logs and everything is organized instantly. Best investment for my drone business."
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-semibold text-sm">SK</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Sarah Kim</div>
                    <div className="text-slate-500 text-xs">Owner, Elevated Perspectives</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="flex-shrink-0 w-[350px] lg:w-[400px] bg-white p-8 rounded-2xl border border-slate-200 snap-center">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="text-slate-700 leading-relaxed mb-6">
                  "We used to dread FAA audits. Now we generate compliance reports in seconds. AeroNote paid for itself after the first inspection."
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">JR</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">James Rodriguez</div>
                    <div className="text-slate-500 text-xs">Operations Manager, DroneBase</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 4 */}
              <div className="flex-shrink-0 w-[350px] lg:w-[400px] bg-white p-8 rounded-2xl border border-slate-200 snap-center">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="text-slate-700 leading-relaxed mb-6">
                  "The expiration alerts alone are worth it. Never missed a certification renewal since we started using AeroNote. Highly recommend!"
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 font-semibold text-sm">LP</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Lisa Park</div>
                    <div className="text-slate-500 text-xs">Pilot, AeroInspect Solutions</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 5 */}
              <div className="flex-shrink-0 w-[350px] lg:w-[400px] bg-white p-8 rounded-2xl border border-slate-200 snap-center">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="text-slate-700 leading-relaxed mb-6">
                  "Managing a fleet of 20 drones was chaos before AeroNote. Now I have complete visibility into every aircraft's compliance status."
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-sky-600 font-semibold text-sm">DW</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">David Wilson</div>
                    <div className="text-slate-500 text-xs">Fleet Manager, SkyOps Inc</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-8">
              <Plane className="h-8 w-8 text-sky-600 transform -rotate-45" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Ready to get started
            </h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Download AeroNote for Mac. No credit card required.
            </p>
            <button
              onClick={() => router.push("/auth/signup")}
              className="bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-slate-800 transition-colors font-medium text-lg inline-flex items-center justify-center shadow-lg"
            >
              Download App
              <Download className="ml-2 h-5 w-5" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-50 border-t border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top section with logo and links */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
              {/* Logo column */}
              <div className="col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <Plane className="h-4 w-4 text-white transform -rotate-45" />
                  </div>
                  <span className="text-lg font-bold text-slate-900">AeroNote</span>
                </div>
                <p className="text-sm text-slate-500 max-w-xs">
                  Professional drone compliance management for operators who need to stay FAA compliant.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4 text-sm">Product</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      Changelog
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4 text-sm">Resources</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4 text-sm">Company</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4 text-sm">Legal</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom section */}
            <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-slate-500 mb-4 md:mb-0">
                © 2024 AeroNote · A Product by Level Eleven
              </p>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Built in Portland
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
