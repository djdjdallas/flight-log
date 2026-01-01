import Link from 'next/link';
import {
  FileText,
  Shield,
  HelpCircle,
  Building2,
  HardHat,
  GitCompare,
  ArrowRight,
  Clock,
  AlertTriangle,
  Search,
  Plane,
  Tractor,
  Siren,
  MapPin,
  Film,
  Compass,
  Scale
} from 'lucide-react';

export const metadata = {
  title: 'Drone Compliance Resources & Guides | Aeronote',
  description: 'Free guides on FAA Remote ID compliance, drone flight logging, audit preparation, and industry-specific requirements. Expert resources for commercial drone operators.',
  keywords: 'drone compliance, FAA Remote ID, drone flight log, Part 107, drone audit, commercial drone operators',
  openGraph: {
    title: 'Drone Compliance Resources & Guides | Aeronote',
    description: 'Free guides on FAA Remote ID compliance, drone flight logging, audit preparation, and industry-specific requirements.',
    url: 'https://aeronote.app/resources',
    siteName: 'Aeronote',
    type: 'website'
  }
};

const resources = [
  {
    category: 'Urgent',
    categoryColor: 'red',
    items: [
      {
        title: 'DJI Flight Data Backup Guide',
        description: 'Step-by-step instructions to export your DJI flight history before the November 2025 deadline.',
        href: '/resources/dji-flight-data-backup-guide',
        icon: AlertTriangle,
        badge: 'Time Sensitive',
        badgeColor: 'red',
        readingTime: 8
      }
    ]
  },
  {
    category: 'Compliance Essentials',
    categoryColor: 'sky',
    items: [
      {
        title: 'FAA Drone Audit Preparation Checklist',
        description: 'A 30-day preparation guide with downloadable checklist to ensure you pass your FAA inspection.',
        href: '/resources/faa-drone-audit-checklist',
        icon: Shield,
        badge: 'Most Popular',
        badgeColor: 'emerald',
        readingTime: 12
      },
      {
        title: 'What is Remote ID for Drones?',
        description: 'Everything you need to know about FAA Remote ID requirements, compliance options, and penalties.',
        href: '/resources/what-is-remote-id',
        icon: HelpCircle,
        badge: 'Featured Snippet',
        badgeColor: 'sky',
        readingTime: 6
      },
      {
        title: 'Do Drones Under 250g Need Remote ID?',
        description: 'Complete guide to Remote ID requirements for lightweight drones including DJI Mini series and recreational exemptions.',
        href: '/resources/drones-under-250g-remote-id',
        icon: Scale,
        readingTime: 8
      },
      {
        title: 'How Long to Keep Drone Flight Logs',
        description: 'Complete retention guide covering FAA requirements, industry-specific needs, and digital storage best practices.',
        href: '/resources/how-long-keep-drone-flight-logs',
        icon: Clock,
        readingTime: 10
      }
    ]
  },
  {
    category: 'Industry Guides',
    categoryColor: 'slate',
    items: [
      {
        title: 'Real Estate Drone Compliance Guide',
        description: 'Part 107 requirements, state regulations, and documentation best practices for real estate photographers.',
        href: '/resources/real-estate-drone-compliance',
        icon: Building2,
        readingTime: 10
      },
      {
        title: 'Construction Drone Documentation Guide',
        description: 'Project documentation workflows, multi-site management, and enterprise compliance requirements.',
        href: '/resources/construction-drone-compliance',
        icon: HardHat,
        readingTime: 11
      },
      {
        title: 'Agriculture Drone Compliance Guide',
        description: 'Regulations for crop monitoring, precision agriculture, and agricultural exemptions under Part 107 and 137.',
        href: '/resources/agriculture-drone-compliance',
        icon: Tractor,
        readingTime: 14
      },
      {
        title: 'Public Safety Drone Compliance Guide',
        description: 'COAs, Special Governmental Interest waivers, and documentation requirements for law enforcement and emergency services.',
        href: '/resources/public-safety-drone-compliance',
        icon: Siren,
        readingTime: 16
      },
      {
        title: 'Film & Media Production Compliance',
        description: 'Film permits, insurance requirements, crew certifications, and on-set safety protocols for drone cinematography.',
        href: '/resources/film-media-drone-compliance',
        icon: Film,
        readingTime: 16
      },
      {
        title: 'Land Surveying Drone Compliance',
        description: 'FAA regulations, state licensing requirements, accuracy standards, and professional liability considerations.',
        href: '/resources/land-surveying-drone-compliance',
        icon: Compass,
        readingTime: 15
      }
    ]
  },
  {
    category: 'Regional Guides',
    categoryColor: 'amber',
    items: [
      {
        title: 'California Drone Regulations',
        description: 'Navigate California\'s complex state laws, city ordinances, restricted areas, and permit requirements.',
        href: '/resources/california-drone-regulations',
        icon: MapPin,
        badge: 'Local SEO',
        badgeColor: 'amber',
        readingTime: 14
      }
    ]
  },
  {
    category: 'Comparison & Decision',
    categoryColor: 'slate',
    items: [
      {
        title: 'Flight Log Software vs Spreadsheet',
        description: 'A detailed comparison to help you decide when it\'s time to upgrade from spreadsheets to dedicated software.',
        href: '/resources/drone-flight-log-software-vs-spreadsheet',
        icon: GitCompare,
        readingTime: 7
      }
    ]
  }
];

function ResourceCard({ resource }) {
  const Icon = resource.icon;

  return (
    <Link
      href={resource.href}
      className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-sky-200 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="bg-slate-100 group-hover:bg-sky-100 p-3 rounded-lg transition-colors">
          <Icon className="h-6 w-6 text-slate-600 group-hover:text-sky-600 transition-colors" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {resource.badge && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                resource.badgeColor === 'red' ? 'bg-red-100 text-red-700' :
                resource.badgeColor === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                resource.badgeColor === 'amber' ? 'bg-amber-100 text-amber-700' :
                'bg-sky-100 text-sky-700'
              }`}>
                {resource.badge}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors mb-2">
            {resource.title}
          </h3>
          <p className="text-sm text-slate-600 mb-3">
            {resource.description}
          </p>
          <div className="flex items-center text-sm text-slate-500">
            <Clock className="h-4 w-4 mr-1" />
            {resource.readingTime} min read
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </Link>
  );
}

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-sky-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Drone Compliance Resources
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Expert guides, checklists, and industry-specific documentation to help you stay compliant with FAA regulations and pass audits with confidence.
          </p>

          {/* Search Bar (placeholder for future functionality) */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {resources.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                {category.categoryColor === 'red' && (
                  <span className="bg-red-100 p-1.5 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </span>
                )}
                {category.categoryColor === 'amber' && (
                  <span className="bg-amber-100 p-1.5 rounded-lg">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </span>
                )}
                <h2 className="text-2xl font-bold text-slate-900">
                  {category.category}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {category.items.map((resource, resourceIndex) => (
                  <ResourceCard key={resourceIndex} resource={resource} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to automate your compliance?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Stop managing flight logs in spreadsheets. Aeronote automatically tracks your flights, generates audit-ready reports, and keeps you compliant with FAA Remote ID requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/features"
              className="bg-white border border-slate-200 text-slate-700 font-medium px-8 py-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              See All Features
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Stay updated on drone regulations
          </h2>
          <p className="text-slate-300 mb-8">
            Get notified about FAA rule changes, compliance deadlines, and new resources. No spam, ever.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
