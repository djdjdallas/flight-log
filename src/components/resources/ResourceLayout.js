import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Breadcrumbs, TableOfContents, BottomCTA } from './ContentComponents';

export default function ResourceLayout({
  title,
  subtitle,
  breadcrumbs = [],
  readingTime,
  lastUpdated,
  urgencyBanner,
  tableOfContents = [],
  children,
  showBottomCTA = true
}) {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero/Header Section */}
      <section className="bg-gradient-to-br from-slate-50 to-sky-50 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Resources */}
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Resources</span>
          </Link>

          {/* Breadcrumbs */}
          <Breadcrumbs items={[{ href: '/resources', label: 'Resources' }, ...breadcrumbs]} />

          {/* Urgency Banner */}
          {urgencyBanner}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 max-w-4xl">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mb-6">
              {subtitle}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
            )}
            {lastUpdated && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Updated {lastUpdated}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-12">
            {/* Main Content */}
            <article className="flex-1 max-w-3xl prose prose-slate prose-lg prose-headings:text-slate-900 prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900">
              {children}

              {/* Bottom CTA */}
              {showBottomCTA && <BottomCTA />}
            </article>

            {/* Sidebar TOC (desktop) */}
            {tableOfContents.length > 0 && (
              <TableOfContents sections={tableOfContents} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// Navigation header for resources (if needed standalone)
export function ResourcesHeader() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl text-slate-900">
            Aeronote
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/resources" className="text-slate-600 hover:text-sky-600 transition-colors">
              Resources
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-sky-600 transition-colors">
              Pricing
            </Link>
            <Link href="/auth/login" className="text-slate-600 hover:text-sky-600 transition-colors">
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Start Free Trial
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

// Footer for resources pages
export function ResourcesFooter() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/resources" className="hover:text-white transition-colors">All Guides</Link></li>
              <li><Link href="/resources/what-is-remote-id" className="hover:text-white transition-colors">What is Remote ID?</Link></li>
              <li><Link href="/resources/faa-drone-audit-checklist" className="hover:text-white transition-colors">FAA Audit Checklist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Aeronote. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
