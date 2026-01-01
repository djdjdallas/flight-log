import Link from 'next/link';
import { Shield, FileCheck, AlertTriangle, CheckCircle, Clock, FileText, User, Plane, MapPin, ExternalLink } from 'lucide-react';
import ResourceLayout from '@/components/resources/ResourceLayout';
import {
  CalloutBox,
  FeaturedSnippet,
  DownloadCard,
  WeeklyBreakdown,
  FAQSection,
  InlineCTA,
  RelatedResources,
  generateResourceMetadata,
  generateArticleSchema,
  generateFAQSchema,
  SchemaScript
} from '@/components/resources';

export const metadata = generateResourceMetadata({
  title: 'FAA Drone Audit Preparation Checklist (2025 Guide)',
  description: 'Complete 30-day FAA drone audit preparation checklist. Learn what documentation the FAA requires, common audit triggers, and how to pass your inspection with confidence.',
  keywords: ['FAA drone audit', 'drone compliance audit', 'Part 107 inspection', 'FAA audit checklist', 'drone audit preparation', 'FAA documentation requirements'],
  slug: 'faa-drone-audit-checklist',
  publishedTime: '2024-12-15T00:00:00Z',
  modifiedTime: '2024-12-15T00:00:00Z'
});

const faqs = [
  {
    question: 'What documentation does the FAA require for drone audits?',
    answer: 'The FAA typically requires: your Part 107 certificate, government-issued photo ID, aircraft registration documents, flight logs showing date/time/location/duration of operations, maintenance records, Remote ID compliance documentation, and any waiver authorizations. Commercial operators should also have insurance documentation available.'
  },
  {
    question: 'How often does the FAA audit drone operators?',
    answer: 'The FAA conducts both random audits and targeted inspections based on complaints, incidents, or TFR violations. Commercial operators flying in controlled airspace, near airports, or conducting high-profile operations face increased audit probability. There\'s no set schedule—inspections can occur at any time.'
  },
  {
    question: 'What triggers an FAA drone audit?',
    answer: 'Common audit triggers include: flying in restricted airspace without authorization, TFR violations, citizen complaints, incidents or accidents, high-profile commercial operations, proximity to airports, and random compliance checks. Social media posts showing potential violations can also trigger investigations.'
  },
  {
    question: 'What are the penalties for failing an FAA drone audit?',
    answer: 'Penalties range from warning letters to civil fines up to $27,500 per violation for individuals and $27,500 per violation per day for organizations. Criminal penalties can include fines up to $250,000 and imprisonment for up to 3 years for serious violations. Certificate suspension or revocation is also possible.'
  },
  {
    question: 'How far back do FAA flight log requirements go?',
    answer: 'The FAA does not specify a mandatory retention period for flight logs, but inspectors may request records from any period. Best practice is to maintain logs for at least 3 years, though many insurance policies and enterprise clients require 5-7 years of records.'
  },
  {
    question: 'Can I refuse an FAA drone audit?',
    answer: 'No. Under 14 CFR Part 107.7, Remote Pilots must present their certificate and identification upon request by FAA personnel. Refusing to cooperate can result in certificate action, civil penalties, and escalated enforcement. Always cooperate fully with inspectors.'
  }
];

const weeklyChecklist = [
  {
    label: 'Week 1',
    title: 'Documentation Audit',
    tasks: [
      'Locate and verify your Part 107 certificate (check expiration date)',
      'Gather all aircraft registration documents and verify they\'re current',
      'Compile maintenance records for each aircraft in your fleet',
      'Verify Remote ID compliance documentation for all aircraft',
      'Organize any LAANC authorizations or waiver documents'
    ]
  },
  {
    label: 'Week 2',
    title: 'Flight Log Review',
    tasks: [
      'Export and organize all flight logs from the past 3 years',
      'Ensure each log includes date, time, location, duration, and aircraft used',
      'Cross-reference flights with any LAANC authorizations received',
      'Fill in any gaps or incomplete entries in your records',
      'Create a searchable index of flights by date and location'
    ]
  },
  {
    label: 'Week 3',
    title: 'Compliance Verification',
    tasks: [
      'Review each aircraft for current Remote ID compliance status',
      'Verify registration numbers match FAA records',
      'Confirm insurance coverage is current and adequate',
      'Review any incidents and ensure proper documentation exists',
      'Check that all crew members have required credentials'
    ]
  },
  {
    label: 'Week 4',
    title: 'Final Preparation',
    tasks: [
      'Organize all documents in a single, accessible location',
      'Create physical and digital copies of critical documents',
      'Practice retrieving specific flight records quickly',
      'Review common FAA interview questions and your answers',
      'Ensure you can demonstrate Remote ID function on aircraft'
    ]
  }
];

const tableOfContents = [
  { id: 'what-faa-requires', title: 'What the FAA Requires' },
  { id: 'document-checklist', title: 'Document Checklist' },
  { id: 'week-by-week', title: '30-Day Preparation Plan' },
  { id: 'audit-triggers', title: 'Common Audit Triggers' },
  { id: 'during-inspection', title: 'What to Expect During Inspection' },
  { id: 'penalties', title: 'Penalties for Non-Compliance' },
  { id: 'faq', title: 'FAQ' }
];

export default function FAADroneAuditChecklistPage() {
  return (
    <>
      <SchemaScript schema={generateArticleSchema({
        title: 'FAA Drone Audit Preparation Checklist',
        description: 'Complete guide to preparing for FAA drone compliance audits',
        slug: 'faa-drone-audit-checklist',
        publishedTime: '2024-12-15T00:00:00Z',
        modifiedTime: '2024-12-15T00:00:00Z'
      })} />
      <SchemaScript schema={generateFAQSchema(faqs)} />

      <ResourceLayout
        title="FAA Drone Audit Preparation Checklist"
        subtitle="A comprehensive 30-day guide to ensure you're ready for an FAA inspection. Includes downloadable checklist and documentation requirements."
        breadcrumbs={[{ label: 'FAA Drone Audit Checklist' }]}
        readingTime={12}
        lastUpdated="December 2024"
        tableOfContents={tableOfContents}
      >
        {/* Featured Snippet Target */}
        <FeaturedSnippet question="What documentation does the FAA require for drone audits?">
          <p className="mb-4">
            The FAA requires commercial drone operators to present the following documentation during audits:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Valid Part 107 Remote Pilot Certificate</li>
            <li>Government-issued photo identification</li>
            <li>Aircraft registration documentation (FAA DroneZone)</li>
            <li>Flight logs with date, time, location, and duration</li>
            <li>Maintenance records for each aircraft</li>
            <li>Remote ID compliance documentation</li>
            <li>Any waiver authorizations (if applicable)</li>
            <li>LAANC authorization records (if operating in controlled airspace)</li>
          </ul>
        </FeaturedSnippet>

        <p className="lead text-lg text-slate-700">
          An FAA audit can happen at any time—during a flight operation, at your business location, or as a follow-up to a complaint. The key to passing an inspection isn&apos;t luck; it&apos;s preparation. This guide walks you through everything you need to have ready.
        </p>

        <CalloutBox type="warning" title="New in 2024: Remote ID Enforcement">
          <p>
            As of March 16, 2024, the FAA is actively enforcing Remote ID requirements. Inspectors will verify that your aircraft either has Standard Remote ID, broadcasts via a Remote ID module, or you&apos;re operating in an FAA-Recognized Identification Area (FRIA). Non-compliance can result in certificate action.
          </p>
        </CalloutBox>

        <section id="what-faa-requires">
          <h2>What the FAA Requires from Drone Operators</h2>
          <p>
            Under <a href="https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-107" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">14 CFR Part 107 <ExternalLink className="inline h-4 w-4" /></a>, commercial drone operators must comply with specific documentation and operational requirements. During an audit, FAA inspectors can request proof of compliance with any of these regulations.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <User className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Pilot Requirements</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Valid Part 107 Remote Pilot Certificate
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Government-issued photo ID
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Recurrent training every 24 months
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Physical and mental fitness to fly
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <Plane className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Aircraft Requirements</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  FAA registration (visible registration number)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Remote ID compliance (built-in or module)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Safe operating condition
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Weight under 55 lbs (or Part 107.31 waiver)
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Documentation Requirements</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Flight logs (date, time, location, duration)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Maintenance records
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Waiver authorizations (if applicable)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  LAANC authorizations (if applicable)
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <MapPin className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Operational Requirements</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Visual line of sight maintained
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Airspace authorization (controlled airspace)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Altitude compliance (400ft AGL max)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  No operations over people (without waiver)
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="document-checklist">
          <h2>Complete Document Checklist</h2>
          <p>
            Use this comprehensive checklist to ensure you have every document an FAA inspector might request. We recommend keeping both physical and digital copies organized and easily accessible.
          </p>

          <DownloadCard
            title="FAA Drone Audit Preparation Checklist"
            description="Printable PDF with all required documents and a week-by-week preparation timeline"
            fileType="PDF"
            pages="4"
            lastUpdated="December 2024"
            downloadUrl="/downloads/faa-audit-checklist.pdf"
            buttonText="Download Free"
          />

          <div className="bg-slate-50 rounded-xl p-6 my-8">
            <h3 className="font-semibold text-slate-900 mb-4">Essential Documents Checklist</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Pilot Credentials</h4>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    Part 107 Remote Pilot Certificate (unexpired)
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    Government-issued photo ID
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    Recurrent training completion certificate (if applicable)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-slate-800 mb-2">Aircraft Documentation</h4>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    FAA registration certificate for each aircraft
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    Remote ID Declaration of Compliance (DoC) or module documentation
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    Maintenance logs and inspection records
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    Serial numbers matching registration
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-slate-800 mb-2">Flight Records</h4>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    Complete flight logs (minimum 3 years recommended)
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    LAANC authorizations for controlled airspace flights
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    Pre-flight checklists (if your SOP requires them)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-slate-800 mb-2">Authorizations & Insurance</h4>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    Part 107 waivers (night, over people, BVLOS, etc.)
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    Certificate of Insurance (liability coverage)
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" readOnly />
                    COA documentation (if applicable)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <InlineCTA
          title="Organize your compliance documents in minutes"
          description="Aeronote keeps all your flight logs, aircraft records, and compliance documents in one searchable place. Generate audit-ready reports instantly."
          buttonText="Get Organized Now"
          buttonUrl="/auth/signup"
        />

        <section id="week-by-week">
          <h2>30-Day Audit Preparation Plan</h2>
          <p>
            Whether you&apos;ve been notified of an upcoming inspection or just want to be prepared, this week-by-week plan ensures you&apos;re ready for any FAA audit.
          </p>

          <WeeklyBreakdown weeks={weeklyChecklist} />
        </section>

        <section id="audit-triggers">
          <h2>Common FAA Audit Triggers</h2>
          <p>
            Understanding what triggers FAA attention can help you avoid unwanted scrutiny. Here are the most common reasons drone operators face audits:
          </p>

          <div className="space-y-4 my-8">
            <CalloutBox type="error" title="High-Risk Triggers">
              <ul className="space-y-2 mt-2">
                <li><strong>TFR Violations:</strong> Flying in temporary flight restrictions (sporting events, VIP movements, wildfires) almost always results in investigation.</li>
                <li><strong>Near-Miss Reports:</strong> Pilots reporting close encounters with drones trigger immediate FAA response.</li>
                <li><strong>Accidents & Incidents:</strong> Any accident causing injury or significant property damage requires reporting and likely investigation.</li>
              </ul>
            </CalloutBox>

            <CalloutBox type="warning" title="Medium-Risk Triggers">
              <ul className="space-y-2 mt-2">
                <li><strong>Citizen Complaints:</strong> Reports from the public about unsafe or illegal operations.</li>
                <li><strong>Social Media Posts:</strong> Videos or photos showing apparent violations can trigger investigations.</li>
                <li><strong>Airport Proximity:</strong> Operations near airports (even with authorization) receive increased scrutiny.</li>
              </ul>
            </CalloutBox>

            <CalloutBox type="info" title="Standard Triggers">
              <ul className="space-y-2 mt-2">
                <li><strong>Random Compliance Checks:</strong> The FAA conducts routine spot-checks of commercial operators.</li>
                <li><strong>High-Profile Operations:</strong> Large-scale commercial operations, especially media coverage.</li>
                <li><strong>LAANC Data Review:</strong> The FAA can audit operations based on LAANC authorization patterns.</li>
              </ul>
            </CalloutBox>
          </div>
        </section>

        <section id="during-inspection">
          <h2>What to Expect During an FAA Inspection</h2>
          <p>
            FAA inspections can happen in the field during operations or at your place of business. Here&apos;s how to handle each scenario professionally.
          </p>

          <h3>Field Inspections (During Operations)</h3>
          <p>
            If an FAA inspector approaches you during a flight operation:
          </p>
          <ol className="list-decimal pl-5 space-y-2 my-4">
            <li><strong>Remain calm and professional.</strong> Inspectors are doing their job—cooperation goes a long way.</li>
            <li><strong>Land safely</strong> if currently flying, following normal procedures.</li>
            <li><strong>Present your credentials</strong> when requested (Part 107 certificate and photo ID).</li>
            <li><strong>Answer questions honestly.</strong> If you don&apos;t know something, say so—don&apos;t guess.</li>
            <li><strong>Provide documentation</strong> for the current operation (LAANC authorization, pre-flight checklist, etc.).</li>
            <li><strong>Demonstrate Remote ID</strong> if requested—show that your aircraft is broadcasting properly.</li>
          </ol>

          <h3>Office/Business Inspections</h3>
          <p>
            For scheduled or unannounced inspections at your business location:
          </p>
          <ol className="list-decimal pl-5 space-y-2 my-4">
            <li><strong>Have documentation ready</strong> in an organized, accessible location.</li>
            <li><strong>Provide a quiet space</strong> for the inspector to review records.</li>
            <li><strong>Be prepared to retrieve specific records</strong>—they may ask for flights from specific dates or locations.</li>
            <li><strong>Have aircraft available</strong> for physical inspection if requested.</li>
            <li><strong>Take notes</strong> on what was discussed and any follow-up items.</li>
          </ol>

          <CalloutBox type="success" title="Pro Tip: Keep a Field Kit">
            <p>
              Maintain a &quot;compliance kit&quot; that goes with you on every flight containing: physical copies of your Part 107 certificate, aircraft registration, current insurance card, and a mobile device with access to your digital flight logs and LAANC authorizations.
            </p>
          </CalloutBox>
        </section>

        <section id="penalties">
          <h2>Penalties for Non-Compliance</h2>
          <p>
            Understanding the consequences of failing an FAA audit underscores the importance of preparation. Penalties vary based on the severity and nature of violations.
          </p>

          <div className="overflow-x-auto my-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-4 font-semibold text-slate-900 border-b border-slate-200">Violation Type</th>
                  <th className="text-left p-4 font-semibold text-slate-900 border-b border-slate-200">Potential Penalty</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600">Missing/Invalid Registration</td>
                  <td className="p-4 text-slate-600">Up to $27,500 civil penalty</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600">Operating without Part 107 Certificate</td>
                  <td className="p-4 text-slate-600">Up to $27,500 civil penalty</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600">Remote ID Non-Compliance</td>
                  <td className="p-4 text-slate-600">Warning letter to civil penalty</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600">Airspace Violations</td>
                  <td className="p-4 text-slate-600">$1,100 - $27,500 per violation</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600">Careless/Reckless Operation</td>
                  <td className="p-4 text-slate-600">Certificate suspension/revocation + fines</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600">Endangering Manned Aircraft</td>
                  <td className="p-4 text-slate-600">Criminal penalties up to $250,000 + 3 years imprisonment</td>
                </tr>
              </tbody>
            </table>
          </div>

          <CalloutBox type="error" title="Repeat Violations">
            <p>
              The FAA takes a dim view of repeat violations. If you&apos;ve received a warning letter or civil penalty in the past, subsequent violations will typically result in escalated enforcement action, including certificate revocation.
            </p>
          </CalloutBox>
        </section>

        <section id="faq">
          <FAQSection faqs={faqs} />
        </section>

        <RelatedResources resources={[
          { title: 'What is Remote ID for Drones?', href: '/resources/what-is-remote-id' },
          { title: 'DJI Flight Data Backup Guide', href: '/resources/dji-flight-data-backup-guide' },
          { title: 'Flight Log Software vs Spreadsheet', href: '/resources/drone-flight-log-software-vs-spreadsheet' }
        ]} />
      </ResourceLayout>
    </>
  );
}
