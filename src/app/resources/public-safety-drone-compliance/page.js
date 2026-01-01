import Link from 'next/link';
import { Shield, Radio, FileCheck, AlertTriangle, CheckCircle, Users, Building, Scale, ExternalLink, Flame, Search } from 'lucide-react';
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
  title: 'Public Safety Drone Compliance Guide: Police, Fire & Emergency Services (2025)',
  description: 'Complete FAA compliance guide for public safety drone programs. Learn COA vs Part 107, special government authorities, documentation requirements for law enforcement and fire departments.',
  keywords: ['public safety drone compliance', 'law enforcement drone regulations', 'fire department drone program', 'police drone requirements', 'government drone COA'],
  slug: 'public-safety-drone-compliance',
  publishedTime: '2024-12-15T00:00:00Z',
  modifiedTime: '2024-12-15T00:00:00Z'
});

const faqs = [
  {
    question: 'Do law enforcement drones need Part 107 certification?',
    answer: 'Public safety agencies have two options: operate under Part 107 like commercial operators, or apply for a Certificate of Authorization (COA) under Part 89.130 which provides certain government-specific exemptions. Many agencies choose Part 107 for flexibility, but COAs may be better for frequent operations requiring waivers.'
  },
  {
    question: 'Can police fly drones over people during emergencies?',
    answer: 'Government aircraft operating under a COA or Part 107 waiver may have authorization to fly over people in emergency situations. Some agencies hold standing emergency COAs that allow operations over people during active emergencies without obtaining new authorization each time.'
  },
  {
    question: 'What documentation do public safety drone programs need?',
    answer: 'Public safety programs should maintain: pilot Part 107 certificates (or public aircraft crew certifications), aircraft registration, Remote ID compliance, flight logs for all operations, operational policies and procedures, training records, and COA documentation if applicable. Many agencies also face state public records requirements for drone footage.'
  },
  {
    question: 'Do fire department drones need Remote ID?',
    answer: 'Yes, public safety drones must comply with Remote ID requirements. However, there\'s a special provision: government drone operators can request a Remote ID exemption from the FAA for operations where broadcasting would jeopardize law enforcement activities or national security.'
  },
  {
    question: 'Can public safety drones fly in controlled airspace without LAANC?',
    answer: 'Public safety agencies operating under a COA can include blanket airspace authorizations for their jurisdiction. This can be faster than LAANC for emergency response. Part 107 operators still need LAANC or manual authorization for controlled airspace regardless of public safety status.'
  },
  {
    question: 'What insurance do public safety drone programs need?',
    answer: 'Government agencies are often self-insured or covered under existing municipal liability policies. However, specific drone coverage should be verified to cover equipment, liability for property damage, and privacy-related claims. Many agencies carry $1-5 million in specific drone liability coverage.'
  }
];

const tableOfContents = [
  { id: 'public-aircraft', title: 'Public Aircraft vs Part 107' },
  { id: 'coa-option', title: 'Certificate of Authorization (COA)' },
  { id: 'part-107-option', title: 'Part 107 for Public Safety' },
  { id: 'remote-id', title: 'Remote ID Considerations' },
  { id: 'documentation', title: 'Documentation Requirements' },
  { id: 'policies', title: 'Operational Policies' },
  { id: 'faq', title: 'FAQ' }
];

export default function PublicSafetyDroneCompliancePage() {
  return (
    <>
      <SchemaScript schema={generateArticleSchema({
        title: 'Public Safety Drone Compliance Guide',
        description: 'Complete guide to FAA compliance for law enforcement, fire departments, and emergency services drone programs',
        slug: 'public-safety-drone-compliance',
        publishedTime: '2024-12-15T00:00:00Z',
        modifiedTime: '2024-12-15T00:00:00Z'
      })} />
      <SchemaScript schema={generateFAQSchema(faqs)} />

      <ResourceLayout
        title="Public Safety Drone Compliance Guide"
        subtitle="FAA requirements, COAs, and documentation best practices for law enforcement, fire departments, and emergency services"
        breadcrumbs={[{ label: 'Public Safety Drone Compliance' }]}
        readingTime={11}
        lastUpdated="December 2024"
        tableOfContents={tableOfContents}
      >
        {/* Featured Snippet Target */}
        <FeaturedSnippet question="What FAA authorization do public safety drones need?">
          <p className="mb-4">
            <strong>Public safety agencies have two authorization options:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Part 107:</strong> Same as commercial operators—pilots need Remote Pilot Certificate, follow standard rules, use LAANC for controlled airspace</li>
            <li><strong>Certificate of Authorization (COA):</strong> Agency-specific authorization that can include blanket airspace access, operations over people for emergencies, and other exemptions</li>
          </ul>
          <p className="mt-4 text-sm">
            Both options require aircraft registration and Remote ID compliance. Most smaller agencies use Part 107; larger programs often maintain COAs.
          </p>
        </FeaturedSnippet>

        <p className="lead text-lg text-slate-700">
          Drones have become essential tools for law enforcement, fire departments, and emergency services. From search and rescue to crime scene documentation, public safety applications are growing rapidly. This guide covers the unique compliance requirements for government drone programs.
        </p>

        <section id="public-aircraft">
          <h2>Public Aircraft vs Commercial Operations</h2>
          <p>
            The first decision public safety agencies face is whether to operate as &quot;public aircraft&quot; under a COA or as standard Part 107 commercial operators. This choice affects everything from pilot certification to airspace access.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white border-2 border-sky-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <Building className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Public Aircraft (COA)</h3>
              </div>
              <ul className="space-y-2 text-slate-600 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Blanket airspace authorization possible
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Operations over people (emergency)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Internal pilot certification accepted
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Remote ID exemption possible
                </li>
              </ul>
              <p className="text-sm text-slate-500">
                <strong>Best for:</strong> Large agencies with frequent operations, need for emergency exemptions
              </p>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <FileCheck className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Part 107 Operation</h3>
              </div>
              <ul className="space-y-2 text-slate-600 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Faster to implement
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  No COA application process
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  LAANC for airspace access
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Standard waivers available
                </li>
              </ul>
              <p className="text-sm text-slate-500">
                <strong>Best for:</strong> Smaller agencies, starting programs, occasional operations
              </p>
            </div>
          </div>

          <CalloutBox type="info" title="Many Agencies Use Both">
            <p>
              It&apos;s common for agencies to operate under Part 107 for routine operations while maintaining a COA for emergency situations. This provides maximum flexibility—routine flights use LAANC while emergency responses can use blanket COA authorities.
            </p>
          </CalloutBox>
        </section>

        <section id="coa-option">
          <h2>Certificate of Authorization (COA) Option</h2>
          <p>
            A COA is a tailored authorization from the FAA that allows government agencies to operate drones as public aircraft with specific exemptions from standard rules.
          </p>

          <h3>Types of COAs</h3>
          <div className="space-y-4 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 mb-2">Blanket COA</h4>
              <p className="text-slate-600">
                Covers operations up to 400ft AGL in Class G airspace. Available to all government agencies with a simple online application through DroneZone. Good starting point for new programs.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 mb-2">Jurisdictional COA</h4>
              <p className="text-slate-600">
                Custom COA covering an agency&apos;s entire jurisdiction, including controlled airspace if needed. Requires more detailed application but provides comprehensive authorization. Processing time: 60-90 days typically.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 mb-2">Emergency COA</h4>
              <p className="text-slate-600">
                Special authorization for emergency operations outside normal COA boundaries. Can be requested on short notice for specific incidents. Some agencies maintain standing emergency COAs.
              </p>
            </div>
          </div>

          <h3>COA Application Process</h3>
          <ol className="list-decimal pl-5 space-y-2 my-4 text-slate-600">
            <li>Create account in <a href="https://www.faa.gov/uas/public_safety_gov/public_coa" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">FAA DroneZone <ExternalLink className="inline h-4 w-4" /></a></li>
            <li>Complete agency profile and designate responsible person</li>
            <li>Submit application with operational plan and geographic boundaries</li>
            <li>FAA reviews and may request additional information</li>
            <li>Receive COA with specific conditions and limitations</li>
            <li>Report operations quarterly as required</li>
          </ol>
        </section>

        <section id="part-107-option">
          <h2>Part 107 for Public Safety</h2>
          <p>
            Many public safety agencies choose Part 107 for its simplicity and faster implementation. Here&apos;s what&apos;s required:
          </p>

          <div className="bg-slate-50 rounded-xl p-6 my-8">
            <h3 className="font-semibold text-slate-900 mb-4">Part 107 Requirements for Government Agencies</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-slate-800 mb-3">Pilot Requirements</h4>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    FAA Part 107 certificate for each pilot
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    Recurrent training every 24 months
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    Agency-specific training recommended
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 mb-3">Aircraft Requirements</h4>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    FAA registration for each drone
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    Remote ID compliance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    Maintenance records
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <h3>Common Waivers for Public Safety</h3>
          <p>
            Public safety agencies frequently need these Part 107 waivers:
          </p>
          <ul className="list-disc pl-5 space-y-2 my-4 text-slate-600">
            <li><strong>Operations over people (107.39):</strong> For search and rescue, crowd monitoring</li>
            <li><strong>Night operations (107.29):</strong> Already allowed under current rules with anti-collision lighting</li>
            <li><strong>BVLOS (107.31):</strong> For search patterns, infrastructure inspection</li>
            <li><strong>Multiple aircraft (107.35):</strong> For coordinated operations</li>
          </ul>
        </section>

        <InlineCTA
          title="Manage your public safety drone program"
          description="Aeronote helps government agencies track pilot certifications, maintain flight logs, and generate compliance reports for internal audits and public records requests."
          buttonText="See Government Features"
          buttonUrl="/auth/signup"
        />

        <section id="remote-id">
          <h2>Remote ID Considerations for Public Safety</h2>
          <p>
            Remote ID compliance applies to public safety drones, but there are special considerations:
          </p>

          <CalloutBox type="warning" title="Law Enforcement Remote ID Exemption">
            <p>
              The FAA allows government agencies to request exemption from Remote ID for operations where broadcasting would compromise law enforcement activities or national security. This must be requested specifically and documented.
            </p>
          </CalloutBox>

          <div className="space-y-4 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-sky-100 p-2 rounded-lg flex-shrink-0">
                  <Radio className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Standard Operations: Remote ID Required</h3>
                  <p className="text-slate-600">
                    Routine training flights, public demonstrations, and non-sensitive operations require Remote ID like any commercial operation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Sensitive Operations: Exemption Available</h3>
                  <p className="text-slate-600">
                    For undercover surveillance, tactical operations, or situations where broadcasting location could compromise officer safety, request exemption through your COA or directly from the FAA.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="documentation">
          <h2>Documentation Requirements</h2>
          <p>
            Public safety agencies face unique documentation requirements including public records obligations:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <FileCheck className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Flight Documentation</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li>• Date, time, and duration</li>
                <li>• Mission type and purpose</li>
                <li>• Location (coordinates)</li>
                <li>• Pilot and crew names</li>
                <li>• Aircraft identification</li>
                <li>• Case/incident number (if applicable)</li>
                <li>• Airspace authorization reference</li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Program Documentation</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li>• Pilot certification records</li>
                <li>• Training completion records</li>
                <li>• COA documentation (if applicable)</li>
                <li>• Standard operating procedures</li>
                <li>• Equipment inventory</li>
                <li>• Maintenance logs</li>
                <li>• Annual compliance reports (COA)</li>
              </ul>
            </div>
          </div>

          <CalloutBox type="info" title="Public Records Considerations">
            <p>
              Flight logs and drone footage may be subject to public records requests (FOIA at federal level, state equivalents locally). Agencies should work with their legal counsel to establish retention policies and understand exemptions for ongoing investigations, surveillance footage, and officer safety information.
            </p>
          </CalloutBox>
        </section>

        <section id="policies">
          <h2>Operational Policies</h2>
          <p>
            Successful public safety drone programs require clear operational policies beyond FAA compliance:
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Search className="h-5 w-5 text-sky-600" />
                Privacy and Surveillance Policy
              </h3>
              <ul className="space-y-1 text-slate-600">
                <li>• When drone surveillance is authorized</li>
                <li>• Warrant requirements for surveillance flights</li>
                <li>• Data retention periods for footage</li>
                <li>• Access controls for recorded data</li>
                <li>• Public notification requirements (if any)</li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Flame className="h-5 w-5 text-sky-600" />
                Emergency Response Protocol
              </h3>
              <ul className="space-y-1 text-slate-600">
                <li>• Deployment criteria and authorization chain</li>
                <li>• Airspace coordination (especially near airports)</li>
                <li>• Integration with incident command</li>
                <li>• Documentation during active incidents</li>
                <li>• Post-incident reporting requirements</li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Scale className="h-5 w-5 text-sky-600" />
                Evidence Handling
              </h3>
              <ul className="space-y-1 text-slate-600">
                <li>• Chain of custody procedures</li>
                <li>• Data extraction and preservation</li>
                <li>• Metadata integrity</li>
                <li>• Storage and backup requirements</li>
                <li>• Court admissibility considerations</li>
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
          { title: 'How Long to Keep Drone Flight Logs', href: '/resources/how-long-keep-drone-flight-logs' }
        ]} />
      </ResourceLayout>
    </>
  );
}
