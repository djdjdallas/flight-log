'use client';

import {
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  FileDown,
  ArrowRight,
  Clock,
  AlertCircle,
  Check,
  X,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// Callout Box Component - for tips, warnings, info
export function CalloutBox({ type = 'info', title, children }) {
  const styles = {
    info: {
      bg: 'bg-sky-50',
      border: 'border-sky-500',
      icon: Info,
      iconColor: 'text-sky-600'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-500',
      icon: AlertTriangle,
      iconColor: 'text-amber-600'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      icon: AlertCircle,
      iconColor: 'text-red-600'
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-500',
      icon: CheckCircle,
      iconColor: 'text-emerald-600'
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} border-l-4 ${style.border} p-6 rounded-r-lg my-8`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-6 w-6 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div>
          {title && <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>}
          <div className="text-slate-600">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Featured Snippet Block - optimized for Google featured snippets
export function FeaturedSnippet({ question, children }) {
  return (
    <div className="bg-white border-2 border-sky-200 rounded-xl p-6 my-8 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">{question}</h3>
      <div className="prose prose-slate max-w-none">
        {children}
      </div>
    </div>
  );
}

// Urgency Banner - for time-sensitive content
export function UrgencyBanner({ deadline, message }) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-red-600 text-white py-3 px-4 rounded-lg mb-8">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Clock className="h-5 w-5" />
        <span className="font-semibold">
          {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
        </span>
        <span className="hidden sm:inline">|</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

// Download Card - for downloadable resources
export function DownloadCard({ title, description, fileType, pages, lastUpdated, downloadUrl = '#', buttonText = 'Download Free' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 my-8 hover:shadow-lg transition-shadow">
      <div className="bg-sky-100 p-4 rounded-lg flex-shrink-0">
        <FileDown className="h-8 w-8 text-sky-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
        <p className="text-sm text-slate-500 mt-1">
          {fileType} {pages && `• ${pages} pages`} {lastUpdated && `• Last updated ${lastUpdated}`}
        </p>
      </div>
      <Link
        href={downloadUrl}
        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto text-center"
      >
        {buttonText}
      </Link>
    </div>
  );
}

// Comparison Table
export function ComparisonTable({ headers, rows, highlightColumn }) {
  return (
    <div className="overflow-x-auto my-8">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50">
            {headers.map((header, i) => (
              <th
                key={i}
                className={`${i === 0 ? 'text-left' : 'text-center'} p-4 font-semibold text-slate-900 border-b border-slate-200 ${i === highlightColumn ? 'bg-sky-50' : ''}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-100">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`p-4 ${cellIndex === 0 ? 'text-slate-600' : 'text-center'} ${cellIndex === highlightColumn ? 'bg-sky-50/50' : ''}`}
                >
                  {cell === true ? (
                    <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                  ) : cell === false ? (
                    <X className="h-5 w-5 text-slate-300 mx-auto" />
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// FAQ Section - structured for schema markup
export function FAQSection({ faqs }) {
  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
      <div className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-xl p-6"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-3" itemProp="name">
              {faq.question}
            </h3>
            <div
              className="text-slate-600 prose prose-slate max-w-none"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Inline CTA Block
export function InlineCTA({ title, description, buttonText = 'Start Free Trial', buttonUrl = '/auth/signup' }) {
  return (
    <div className="bg-slate-900 text-white rounded-xl p-8 my-12">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-300 mb-6">{description}</p>
      <Link
        href={buttonUrl}
        className="inline-flex items-center bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </div>
  );
}

// Bottom CTA Block
export function BottomCTA() {
  return (
    <div className="border-t border-slate-200 pt-12 mt-12">
      <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl p-8 md:p-12 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Stop worrying about compliance</h2>
        <p className="text-sky-100 mb-8 max-w-2xl mx-auto">
          Join 5,000+ drone operators who trust Aeronote for FAA compliance, audit preparation, and fleet management.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="bg-white text-sky-600 font-semibold px-8 py-3 rounded-lg hover:bg-sky-50 transition-colors"
          >
            Start Free Trial
          </Link>
          <Link
            href="/features"
            className="border border-white/30 text-white font-medium px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            See Features
          </Link>
        </div>
      </div>
    </div>
  );
}

// Table of Contents (for sidebar)
export function TableOfContents({ sections }) {
  return (
    <nav className="hidden lg:block sticky top-24 w-64 flex-shrink-0">
      <div className="bg-slate-50 rounded-xl p-6">
        <h4 className="font-semibold text-slate-900 mb-4">On this page</h4>
        <ul className="space-y-2 text-sm">
          {sections.map((section, index) => (
            <li key={index}>
              <a
                href={`#${section.id}`}
                className="text-slate-600 hover:text-sky-600 transition-colors block py-1"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// Breadcrumbs
export function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-slate-400" />
          {item.href ? (
            <Link href={item.href} className="hover:text-sky-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Step-by-Step Guide
export function StepGuide({ steps }) {
  return (
    <div className="space-y-8 my-8">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
            {index + 1}
          </div>
          <div className="flex-1 pt-1">
            <h4 className="font-semibold text-slate-900 text-lg mb-2">{step.title}</h4>
            <div className="text-slate-600">{step.content}</div>
            {step.image && (
              <div className="mt-4 bg-slate-100 rounded-lg p-4 text-center text-slate-500">
                {/* Image placeholder */}
                [Screenshot: {step.image}]
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Week-by-Week Breakdown
export function WeeklyBreakdown({ weeks }) {
  return (
    <div className="space-y-6 my-8">
      {weeks.map((week, index) => (
        <div key={index} className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium">
              {week.label}
            </span>
            <h4 className="font-semibold text-slate-900">{week.title}</h4>
          </div>
          <ul className="space-y-2">
            {week.tasks.map((task, taskIndex) => (
              <li key={taskIndex} className="flex items-start gap-2 text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Related Resources
export function RelatedResources({ resources }) {
  return (
    <div className="bg-slate-50 rounded-xl p-6 my-12">
      <h3 className="font-semibold text-slate-900 mb-4">Related Resources</h3>
      <div className="space-y-3">
        {resources.map((resource, index) => (
          <Link
            key={index}
            href={resource.href}
            className="flex items-center gap-3 text-slate-600 hover:text-sky-600 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            <span>{resource.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
