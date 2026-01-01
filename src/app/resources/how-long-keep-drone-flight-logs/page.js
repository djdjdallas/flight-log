import Link from 'next/link';
import { Clock, FileText, Shield, AlertTriangle, CheckCircle, Scale, Building2, ExternalLink } from 'lucide-react';
import ResourceLayout from '@/components/resources/ResourceLayout';
import {
  CalloutBox,
  FeaturedSnippet,
  FAQSection,
  InlineCTA,
  RelatedResources,
  generateResourceMetadata,
  generateArticleSchema,
  generateFAQSchema,
  SchemaScript
} from '@/components/resources';

export const metadata = generateResourceMetadata({
  title: 'How Long Should You Keep Drone Flight Logs? (2025 Guide)',
  description: 'Learn FAA flight log retention requirements for Part 107 pilots. Discover how long to keep drone records for compliance, insurance, and legal protection.',
  keywords: ['drone flight log retention', 'how long keep flight logs', 'Part 107 record keeping', 'FAA flight log requirements', 'drone documentation retention'],
  slug: 'how-long-keep-drone-flight-logs',
  publishedTime: '2024-12-15T00:00:00Z',
  modifiedTime: '2024-12-15T00:00:00Z'
});

const faqs = [
  {
    question: 'How long does the FAA require you to keep drone flight logs?',
    answer: 'The FAA does not specify a mandatory retention period for Part 107 flight logs. However, 14 CFR 107.49 requires pilots to make flight records available to the FAA upon request. Best practice is to retain logs for at least 3 years to cover the statute of limitations for most civil penalties, though many professionals recommend 5-7 years for comprehensive protection.'
  },
  {
    question: 'Do recreational drone pilots need to keep flight logs?',
    answer: 'Recreational pilots flying under the Exception for Recreational Flyers (49 USC 44809) are not required to maintain flight logs. However, keeping basic records is still recommended for insurance purposes and to document safe operational history.'
  },
  {
    question: 'What happens if I delete old flight logs?',
    answer: 'If the FAA requests records you\'ve deleted, you cannot produce them. While there\'s no penalty for not having ancient records, inability to document flights during an investigation or audit can work against you. The absence of records when making a defense or insurance claim means you have no evidence to support your position.'
  },
  {
    question: 'Should I keep flight logs for drones I no longer own?',
    answer: 'Yes, keep flight logs even after selling or retiring a drone. Records may be needed for: insurance claims filed after sale, legal matters arising from previous operations, or demonstrating your overall operational safety record. Archive them securely rather than deleting.'
  },
  {
    question: 'How should I store long-term flight records?',
    answer: 'Use the 3-2-1 backup rule: 3 copies, 2 different media types, 1 offsite. Cloud storage with automatic backup is ideal for primary storage. Export periodic backups to external drives. Ensure your storage method maintains data integrity and allows easy retrieval when needed.'
  },
  {
    question: 'Do enterprise clients have different retention requirements?',
    answer: 'Yes, enterprise and government clients often require 5-10 year retention periods. Construction projects may need records for the project duration plus 7 years. Government contracts often specify retention requirements in the SOW. Always check contract terms for specific requirements.'
  }
];

const tableOfContents = [
  { id: 'faa-requirements', title: 'FAA Requirements' },
  { id: 'recommended-periods', title: 'Recommended Retention Periods' },
  { id: 'insurance-requirements', title: 'Insurance Requirements' },
  { id: 'legal-considerations', title: 'Legal Considerations' },
  { id: 'what-to-keep', title: 'What Records to Keep' },
  { id: 'storage-best-practices', title: 'Storage Best Practices' },
  { id: 'faq', title: 'FAQ' }
];

export default function HowLongKeepFlightLogsPage() {
  return (
    <>
      <SchemaScript schema={generateArticleSchema({
        title: 'How Long Should You Keep Drone Flight Logs?',
        description: 'Guide to drone flight log retention requirements and best practices',
        slug: 'how-long-keep-drone-flight-logs',
        publishedTime: '2024-12-15T00:00:00Z',
        modifiedTime: '2024-12-15T00:00:00Z'
      })} />
      <SchemaScript schema={generateFAQSchema(faqs)} />

      <ResourceLayout
        title="How Long Should You Keep Drone Flight Logs?"
        subtitle="FAA requirements, insurance considerations, and best practices for flight log retention"
        breadcrumbs={[{ label: 'Flight Log Retention Guide' }]}
        readingTime={7}
        lastUpdated="December 2024"
        tableOfContents={tableOfContents}
      >
        {/* Featured Snippet Target */}
        <FeaturedSnippet question="How long should you keep drone flight logs?">
          <p className="mb-4">
            <strong>Recommended retention periods for drone flight logs:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>FAA minimum:</strong> No specified period, but records must be available upon request</li>
            <li><strong>Best practice:</strong> 3 years minimum (covers statute of limitations)</li>
            <li><strong>Insurance recommended:</strong> 5-7 years (covers most claim periods)</li>
            <li><strong>Enterprise/Government:</strong> Project duration + 7-10 years</li>
            <li><strong>Safest approach:</strong> Keep all records permanently in cloud storage</li>
          </ul>
        </FeaturedSnippet>

        <p className="lead text-lg text-slate-700">
          One of the most common questions commercial drone operators ask is: &quot;How long do I need to keep my flight logs?&quot; The answer depends on FAA regulations, insurance requirements, and the types of clients you serve. This guide breaks down the retention requirements and best practices to keep you protected.
        </p>

        <section id="faa-requirements">
          <h2>What Does the FAA Require?</h2>
          <p>
            Here&apos;s what often surprises pilots: <strong>the FAA doesn&apos;t specify a mandatory retention period for flight logs under Part 107</strong>. The regulation at <a href="https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-107/subpart-B/section-107.49" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">14 CFR 107.49 <ExternalLink className="inline h-4 w-4" /></a> requires that you make certain information available to the FAA upon request, but doesn&apos;t say for how long.
          </p>

          <CalloutBox type="info" title="What 14 CFR 107.49 Actually Says">
            <p>
              The regulation requires you to make available upon request: your remote pilot certificate, aircraft registration, and any authorization for the operation. Flight logs are not explicitly mentioned, but they serve as proof of compliance with operating rules.
            </p>
          </CalloutBox>

          <p>
            However, the absence of a specific requirement doesn&apos;t mean you should delete records freely. The FAA can investigate operations and request documentation for incidents that occurred years ago. The federal statute of limitations for civil penalties is generally 5 years, and some violations can be pursued longer.
          </p>
        </section>

        <section id="recommended-periods">
          <h2>Recommended Retention Periods</h2>
          <p>
            Based on regulatory requirements, insurance needs, and industry best practices, here are our recommended retention periods:
          </p>

          <div className="overflow-x-auto my-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-4 font-semibold text-slate-900 border-b border-slate-200">Operator Type</th>
                  <th className="text-left p-4 font-semibold text-slate-900 border-b border-slate-200">Minimum</th>
                  <th className="text-left p-4 font-semibold text-slate-900 border-b border-slate-200">Recommended</th>
                  <th className="text-left p-4 font-semibold text-slate-900 border-b border-slate-200">Why</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600 font-medium">Recreational</td>
                  <td className="p-4 text-slate-600">None required</td>
                  <td className="p-4 text-slate-600">1-3 years</td>
                  <td className="p-4 text-slate-600">Insurance claims, incident documentation</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600 font-medium">Part 107 (Individual)</td>
                  <td className="p-4 text-slate-600">3 years</td>
                  <td className="p-4 text-slate-600">5-7 years</td>
                  <td className="p-4 text-slate-600">Statute of limitations, insurance</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600 font-medium">Part 107 (Business)</td>
                  <td className="p-4 text-slate-600">5 years</td>
                  <td className="p-4 text-slate-600">7+ years</td>
                  <td className="p-4 text-slate-600">Business records, client contracts</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600 font-medium">Construction</td>
                  <td className="p-4 text-slate-600">Project + 5 years</td>
                  <td className="p-4 text-slate-600">Project + 7-10 years</td>
                  <td className="p-4 text-slate-600">Construction defect statutes</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600 font-medium">Government Contracts</td>
                  <td className="p-4 text-slate-600">Per contract</td>
                  <td className="p-4 text-slate-600">10+ years</td>
                  <td className="p-4 text-slate-600">Federal record retention requirements</td>
                </tr>
              </tbody>
            </table>
          </div>

          <CalloutBox type="success" title="The Easiest Approach">
            <p>
              With cloud storage being essentially free and unlimited, the simplest approach is to <strong>keep all records permanently</strong>. There&apos;s no cost to retention and significant risk to deletion. Set up automatic backups and never worry about retention periods again.
            </p>
          </CalloutBox>
        </section>

        <section id="insurance-requirements">
          <h2>Insurance Retention Requirements</h2>
          <p>
            Your insurance policy may have its own requirements for documentation. Understanding these can be critical when filing claims.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Liability Claims</h3>
              </div>
              <p className="text-slate-600 mb-4">
                If your drone causes property damage or injury, you may need to provide:
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Flight log for the incident date
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Pre-flight inspection records
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Maintenance history
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Pilot certification proof
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <Scale className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Defense Documentation</h3>
              </div>
              <p className="text-slate-600 mb-4">
                If someone claims your drone was involved in an incident, your records prove you weren&apos;t there:
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  GPS flight paths with timestamps
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Location data showing where you actually flew
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Remote ID broadcast records
                </li>
              </ul>
            </div>
          </div>

          <CalloutBox type="warning" title="Claims Can Come Years Later">
            <p>
              Personal injury claims can be filed up to 2-3 years after an incident (varies by state). Property damage claims may have similar windows. A claim filed in 2027 about an incident in 2024 requires you to have 2024 records available.
            </p>
          </CalloutBox>
        </section>

        <InlineCTA
          title="Never lose a flight record again"
          description="Aeronote automatically stores all your flight data with secure cloud backup. Generate reports for any time period instantly, even years later."
          buttonText="Start Free Trial"
          buttonUrl="/auth/signup"
        />

        <section id="legal-considerations">
          <h2>Legal Considerations</h2>
          <p>
            Beyond FAA and insurance requirements, there are legal reasons to maintain comprehensive flight records:
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                  <Scale className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Statute of Limitations</h3>
                  <p className="text-slate-600">
                    The federal government has <strong>5 years</strong> to bring civil enforcement actions for most FAA violations. Some criminal violations have longer periods. State civil claims (property damage, personal injury) typically range from <strong>2-6 years</strong> depending on the state and claim type.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                  <Building2 className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Construction Defect Claims</h3>
                  <p className="text-slate-600">
                    If you provide inspection or progress monitoring services for construction, be aware that construction defect claims can be filed <strong>10+ years</strong> after project completion in some states. Your flight data may be requested as evidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">E-Discovery Obligations</h3>
                  <p className="text-slate-600">
                    If litigation occurs, you may have a legal obligation to preserve and produce relevant records. Deleting records after you&apos;re aware of potential litigation can result in <strong>spoliation sanctions</strong>—penalties for destroying evidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="what-to-keep">
          <h2>What Records Should You Keep?</h2>
          <p>
            Not all data is equally important. Here&apos;s what you should prioritize retaining:
          </p>

          <div className="bg-slate-50 rounded-xl p-6 my-8">
            <h3 className="font-semibold text-slate-900 mb-4">Essential Records (Keep Forever)</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Flight date and time
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Flight location (GPS coordinates)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Flight duration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Pilot name and certificate number
                </li>
              </ul>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Aircraft registration number
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Airspace authorizations (LAANC)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Incident reports (if any)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Maintenance records
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 my-8">
            <h3 className="font-semibold text-slate-900 mb-4">Recommended Records (5-7 Years)</h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-sky-500" />
                Pre-flight inspection checklists
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-sky-500" />
                Weather conditions at time of flight
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-sky-500" />
                Client/project information
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-sky-500" />
                Battery cycle counts per flight
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-sky-500" />
                Telemetry data (if available)
              </li>
            </ul>
          </div>
        </section>

        <section id="storage-best-practices">
          <h2>Storage Best Practices</h2>
          <p>
            How you store records is as important as how long you keep them. Follow these best practices:
          </p>

          <div className="space-y-4 my-8">
            <CalloutBox type="info" title="The 3-2-1 Backup Rule">
              <ul className="space-y-1 mt-2">
                <li><strong>3 copies</strong> of your data</li>
                <li><strong>2 different storage types</strong> (cloud + local)</li>
                <li><strong>1 offsite backup</strong> (cloud or remote location)</li>
              </ul>
            </CalloutBox>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                <div className="bg-sky-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-sky-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Automatic Backup</h4>
                <p className="text-sm text-slate-600">Use software that automatically syncs and backs up your flight data</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                <div className="bg-sky-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-sky-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Secure Storage</h4>
                <p className="text-sm text-slate-600">Use encrypted storage and strong passwords for all accounts</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                <div className="bg-sky-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-sky-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Export Regularly</h4>
                <p className="text-sm text-slate-600">Periodically export data to ensure portability and redundancy</p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq">
          <FAQSection faqs={faqs} />
        </section>

        <RelatedResources resources={[
          { title: 'FAA Drone Audit Preparation Checklist', href: '/resources/faa-drone-audit-checklist' },
          { title: 'DJI Flight Data Backup Guide', href: '/resources/dji-flight-data-backup-guide' },
          { title: 'Flight Log Software vs Spreadsheet', href: '/resources/drone-flight-log-software-vs-spreadsheet' }
        ]} />
      </ResourceLayout>
    </>
  );
}
