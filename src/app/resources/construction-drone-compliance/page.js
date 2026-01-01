import Link from 'next/link';
import { HardHat, FileCheck, Layers, Users, Shield, MapPin, AlertTriangle, CheckCircle, FolderOpen, ExternalLink } from 'lucide-react';
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
  title: 'Construction Drone Documentation & Compliance Guide (2025)',
  description: 'Complete guide to drone documentation for construction projects. Learn flight log requirements, multi-site management, insurance documentation, and enterprise compliance best practices.',
  keywords: ['construction drone documentation', 'construction drone compliance', 'drone flight log construction', 'construction site drone', 'enterprise drone management'],
  slug: 'construction-drone-compliance',
  publishedTime: '2024-12-15T00:00:00Z',
  modifiedTime: '2024-12-15T00:00:00Z'
});

const faqs = [
  {
    question: 'What documentation do construction companies need for drone operations?',
    answer: 'Construction companies should maintain: Part 107 certificates for all pilots, aircraft registration and Remote ID compliance documentation, flight logs for every operation (date, time, location, pilot, purpose), maintenance records, liability insurance certificates, site-specific flight authorizations, and any LAANC or waiver documentation. Many enterprise clients and general contractors also require standard operating procedures (SOPs) documentation.'
  },
  {
    question: 'How long should construction companies keep drone flight logs?',
    answer: 'Best practice is to retain drone flight logs for the duration of the project plus 5-7 years. This aligns with typical construction document retention requirements and statute of limitations periods. Some projects, especially government contracts, may have specific retention requirements. Digital records stored in compliant systems make long-term retention straightforward.'
  },
  {
    question: 'Do construction drone operators need special insurance?',
    answer: 'Yes, construction drone operations typically require higher insurance limits than standard commercial operations. Most general contractors require $1-2 million in liability coverage, and some large projects may require $5 million or more. Hull coverage for expensive enterprise drones (like DJI Matrice series) is also recommended. Your policy should specifically cover construction site operations.'
  },
  {
    question: 'Can drone data be used in construction legal disputes?',
    answer: 'Yes, drone imagery and flight data are increasingly used in construction disputes as evidence of site conditions, progress, and potential issues. For data to be useful legally, it must be properly documented with clear chain of custody, accurate timestamps, and GPS data. This is why meticulous flight logging is essential for construction operations.'
  },
  {
    question: 'How do construction companies manage drones across multiple sites?',
    answer: 'Multi-site management requires: centralized pilot certification tracking, site-specific flight authorization workflows, standardized flight logging across all locations, equipment assignment and maintenance tracking, airspace monitoring for each site, and consolidated compliance reporting. Most enterprise operations use dedicated drone management software rather than spreadsheets.'
  },
  {
    question: 'What are the OSHA requirements for construction drones?',
    answer: 'While OSHA doesn\'t have drone-specific regulations, drones on construction sites must not create hazards for workers. This includes maintaining safe distances from personnel, securing the launch/landing area, and coordinating with site safety officers. Some companies include drone operations in their Job Hazard Analysis (JHA) documentation.'
  }
];

const tableOfContents = [
  { id: 'why-documentation', title: 'Why Documentation Matters' },
  { id: 'flight-log-requirements', title: 'Flight Log Requirements' },
  { id: 'project-workflows', title: 'Project Documentation Workflows' },
  { id: 'multi-site', title: 'Multi-Site Management' },
  { id: 'insurance', title: 'Insurance Documentation' },
  { id: 'integration', title: 'Project Management Integration' },
  { id: 'faq', title: 'FAQ' }
];

export default function ConstructionDroneCompliancePage() {
  return (
    <>
      <SchemaScript schema={generateArticleSchema({
        title: 'Construction Drone Documentation & Compliance Guide',
        description: 'Complete guide to drone documentation for construction projects',
        slug: 'construction-drone-compliance',
        publishedTime: '2024-12-15T00:00:00Z',
        modifiedTime: '2024-12-15T00:00:00Z'
      })} />
      <SchemaScript schema={generateFAQSchema(faqs)} />

      <ResourceLayout
        title="Construction Drone Documentation & Compliance Guide"
        subtitle="Best practices for flight logging, multi-site management, and enterprise compliance in construction drone operations"
        breadcrumbs={[{ label: 'Construction Drone Compliance' }]}
        readingTime={11}
        lastUpdated="December 2024"
        tableOfContents={tableOfContents}
      >
        {/* Featured Snippet Target */}
        <FeaturedSnippet question="What documentation do construction companies need for drone operations?">
          <p className="mb-4">
            Construction companies operating drones must maintain comprehensive documentation including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Pilot credentials:</strong> Part 107 certificates for all drone operators</li>
            <li><strong>Aircraft records:</strong> Registration, Remote ID compliance, maintenance logs</li>
            <li><strong>Flight logs:</strong> Date, time, location, pilot, aircraft, purpose for each flight</li>
            <li><strong>Insurance:</strong> Liability certificates (typically $1-5M for construction)</li>
            <li><strong>Authorizations:</strong> LAANC approvals, waivers, site-specific permits</li>
            <li><strong>SOPs:</strong> Standard operating procedures and safety protocols</li>
          </ul>
        </FeaturedSnippet>

        <p className="lead text-lg text-slate-700">
          Construction is one of the fastest-growing sectors for commercial drone operations. From progress monitoring to surveying and inspections, drones deliver significant ROI. But with enterprise-scale operations come enterprise-scale documentation requirements. This guide helps construction companies implement compliant, professional drone programs.
        </p>

        <section id="why-documentation">
          <h2>Why Documentation Matters in Construction</h2>
          <p>
            Unlike one-off commercial drone jobs, construction drone operations exist within a larger ecosystem of project documentation, legal requirements, and stakeholder accountability. Poor documentation creates risks that extend far beyond FAA compliance:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Risks of Poor Documentation
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Inability to prove site conditions in disputes</li>
                <li>• FAA enforcement for compliance failures</li>
                <li>• Insurance claim denials</li>
                <li>• Loss of enterprise client contracts</li>
                <li>• Safety incident liability</li>
                <li>• Project delay documentation gaps</li>
              </ul>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Benefits of Proper Documentation
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Defensible evidence in legal disputes</li>
                <li>• Smooth FAA audits</li>
                <li>• Insurance compliance verification</li>
                <li>• Meet enterprise client requirements</li>
                <li>• Protect against liability claims</li>
                <li>• Accurate progress tracking</li>
              </ul>
            </div>
          </div>

          <CalloutBox type="warning" title="Legal Discovery">
            <p>
              In construction litigation, drone data is increasingly requested during discovery. Flight logs, imagery metadata, and pilot records may all be subject to legal holds. If your documentation is incomplete or inconsistent, it can undermine your legal position—even if you were operating properly.
            </p>
          </CalloutBox>
        </section>

        <section id="flight-log-requirements">
          <h2>Flight Log Requirements for Construction</h2>
          <p>
            Construction drone flight logs need to capture more information than typical commercial operations to satisfy both regulatory and project documentation needs.
          </p>

          <div className="bg-white border border-slate-200 rounded-xl p-6 my-8">
            <h3 className="font-semibold text-slate-900 mb-4">Construction Flight Log Data Points</h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-sky-600" />
                  Required by FAA
                </h4>
                <ul className="space-y-1 text-slate-600 text-sm">
                  <li>• Date and time of flight</li>
                  <li>• Flight location (GPS coordinates)</li>
                  <li>• Pilot name/certificate number</li>
                  <li>• Aircraft registration number</li>
                  <li>• Flight duration</li>
                  <li>• Any incidents or accidents</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <HardHat className="h-5 w-5 text-sky-600" />
                  Construction-Specific
                </h4>
                <ul className="space-y-1 text-slate-600 text-sm">
                  <li>• Project name/number</li>
                  <li>• Site location/zone</li>
                  <li>• Purpose of flight</li>
                  <li>• Deliverables captured</li>
                  <li>• Weather conditions</li>
                  <li>• Site supervisor notified</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-sky-600" />
                  Enterprise/Compliance
                </h4>
                <ul className="space-y-1 text-slate-600 text-sm">
                  <li>• Pre-flight checklist completed</li>
                  <li>• Airspace authorization reference</li>
                  <li>• Equipment serial numbers</li>
                  <li>• Battery cycles used</li>
                  <li>• Firmware versions</li>
                  <li>• Data storage location</li>
                </ul>
              </div>
            </div>
          </div>

          <CalloutBox type="info" title="Automated vs Manual Logging">
            <p>
              Manual flight logging introduces errors and is time-consuming at scale. Modern drone management platforms can automatically capture flight data from DJI, Autel, and other manufacturers, ensuring consistent and accurate records without pilot effort.
            </p>
          </CalloutBox>
        </section>

        <section id="project-workflows">
          <h2>Project Documentation Workflows</h2>
          <p>
            Integrating drone documentation into existing construction project workflows ensures nothing falls through the cracks and data is accessible when needed.
          </p>

          <div className="space-y-6 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-sky-100 p-3 rounded-lg flex-shrink-0">
                  <Layers className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Progress Documentation Workflow</h3>
                  <ol className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded mt-0.5">1</span>
                      <span><strong>Schedule flight</strong> – Coordinate with site supervisor and check airspace</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded mt-0.5">2</span>
                      <span><strong>Complete pre-flight</strong> – Document weather, equipment check, site conditions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded mt-0.5">3</span>
                      <span><strong>Execute flight</strong> – Capture standardized angles/coverage for consistency</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded mt-0.5">4</span>
                      <span><strong>Log flight data</strong> – Record all required fields immediately after landing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded mt-0.5">5</span>
                      <span><strong>Process & store</strong> – Upload to project management system with metadata</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded mt-0.5">6</span>
                      <span><strong>Distribute</strong> – Share with stakeholders per project requirements</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-sky-100 p-3 rounded-lg flex-shrink-0">
                  <FolderOpen className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">File Organization Best Practices</h3>
                  <p className="text-slate-600 mb-4">
                    Consistent file naming and folder structure makes retrieval easy, especially during disputes or audits:
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm text-slate-600">
                    <p>ProjectName/</p>
                    <p className="pl-4">├── Flight_Logs/</p>
                    <p className="pl-8">├── 2024-12-15_Progress_Flight.csv</p>
                    <p className="pl-8">└── 2024-12-22_Inspection_Flight.csv</p>
                    <p className="pl-4">├── Imagery/</p>
                    <p className="pl-8">├── 2024-12-15/</p>
                    <p className="pl-8">│   ├── DJI_0001.JPG</p>
                    <p className="pl-8">│   └── metadata.json</p>
                    <p className="pl-4">├── Reports/</p>
                    <p className="pl-4">└── Authorizations/</p>
                    <p className="pl-8">└── LAANC_2024-12-15.pdf</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <InlineCTA
          title="Simplify multi-project documentation"
          description="Aeronote automatically organizes flight data by project, generates compliance reports, and integrates with your existing project management tools."
          buttonText="See Enterprise Features"
          buttonUrl="/auth/signup"
        />

        <section id="multi-site">
          <h2>Multi-Site Management</h2>
          <p>
            Managing drone operations across multiple construction sites introduces complexity that simple spreadsheets can&apos;t handle. Here&apos;s what enterprise-scale operations need to consider:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Pilot Management</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Centralized Part 107 certificate tracking
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Recurrent training expiration alerts
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Site authorization tracking per pilot
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Flight hour and experience logging
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <MapPin className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Site-Specific Considerations</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Pre-configured airspace authorization per site
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Site-specific no-fly zones and hazards
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Local regulation awareness (state/city)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Emergency contact and safety protocols
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <HardHat className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Equipment Tracking</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Aircraft assignment to sites/pilots
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Maintenance schedule tracking
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Battery cycle monitoring
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Firmware version compliance
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <FileCheck className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Reporting & Compliance</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Consolidated compliance dashboards
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Per-project flight summaries
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Audit-ready export functionality
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Client-specific reporting formats
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="insurance">
          <h2>Insurance Documentation</h2>
          <p>
            Construction drone operations typically require higher insurance limits and more detailed documentation than standard commercial work.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Typical Construction Insurance Requirements</h3>
                <ul className="space-y-2 text-slate-600">
                  <li><strong>General Liability:</strong> $1-5 million depending on project size and GC requirements</li>
                  <li><strong>Additional Insured:</strong> Name the project owner and general contractor as additional insured</li>
                  <li><strong>Professional Liability:</strong> May be required for surveying or engineering-related work</li>
                  <li><strong>Hull Coverage:</strong> Recommended for enterprise drones ($10K+ equipment)</li>
                  <li><strong>Workers&apos; Comp:</strong> Required in most states if you have employees</li>
                </ul>
              </div>
            </div>
          </div>

          <CalloutBox type="info" title="Certificate of Insurance (COI)">
            <p>
              Most general contractors will require a Certificate of Insurance (COI) before allowing drone operations on site. Keep digital copies readily available and ensure they&apos;re updated whenever policies renew. Many drone insurance providers offer instant COI generation through their portals.
            </p>
          </CalloutBox>
        </section>

        <section id="integration">
          <h2>Project Management Integration</h2>
          <p>
            Drone data becomes most valuable when integrated with existing construction project management workflows. Here&apos;s how to connect the dots:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Common Integrations</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Procore:</strong> Link flight data to daily logs and photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span><strong>PlanGrid/Autodesk:</strong> Attach aerial imagery to plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Box/Dropbox:</strong> Centralized file storage and sharing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span><strong>DroneDeploy/Pix4D:</strong> Photogrammetry processing</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Data Flow Best Practices</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>Use consistent naming conventions across all systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>Maintain a single source of truth for flight records</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>Automate data transfer where possible via APIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>Document your data flow in project SOPs</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="faq">
          <FAQSection faqs={faqs} />
        </section>

        <RelatedResources resources={[
          { title: 'FAA Drone Audit Preparation Checklist', href: '/resources/faa-drone-audit-checklist' },
          { title: 'What is Remote ID for Drones?', href: '/resources/what-is-remote-id' },
          { title: 'Flight Log Software vs Spreadsheet', href: '/resources/drone-flight-log-software-vs-spreadsheet' }
        ]} />
      </ResourceLayout>
    </>
  );
}
