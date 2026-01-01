import Link from 'next/link';
import { Wheat, Droplets, Shield, FileCheck, AlertTriangle, CheckCircle, MapPin, Scale, ExternalLink, Plane } from 'lucide-react';
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
  title: 'Agriculture Drone Compliance Guide: Spraying, Mapping & Monitoring (2025)',
  description: 'Complete compliance guide for agricultural drone operations. Learn Part 107 requirements, Part 137 for spraying, EPA regulations, and documentation best practices for farm drones.',
  keywords: ['agriculture drone compliance', 'farm drone regulations', 'Part 137 drone spraying', 'agricultural UAV requirements', 'crop spraying drone license'],
  slug: 'agriculture-drone-compliance',
  publishedTime: '2024-12-15T00:00:00Z',
  modifiedTime: '2024-12-15T00:00:00Z'
});

const faqs = [
  {
    question: 'Do I need Part 137 certification to spray crops with a drone?',
    answer: 'Yes, drone spraying operations that apply pesticides, fertilizers, or other substances to crops require Part 137 Agricultural Aircraft Operator certification in addition to Part 107. Part 137 involves additional training, documentation, and operational requirements specific to aerial application.'
  },
  {
    question: 'Can I use a drone for crop monitoring without special certification?',
    answer: 'Yes, crop monitoring, mapping, and imaging operations only require Part 107 certification. Part 137 is specifically for aerial application (spraying). Imaging, surveying, and monitoring activities fall under standard Part 107 commercial operations.'
  },
  {
    question: 'What EPA requirements apply to drone spraying?',
    answer: 'Drone applicators must follow EPA pesticide label requirements, maintain Restricted Use Pesticide (RUP) records, comply with Worker Protection Standard (WPS) requirements, and follow drift management guidelines. Some states require pesticide applicator licenses specifically for drone operators.'
  },
  {
    question: 'Do agricultural drones need Remote ID?',
    answer: 'Yes, commercial agricultural drones require Remote ID compliance like any Part 107 operation. Most agricultural spray drones are well over 250g and require registration and Remote ID regardless of whether they\'re used commercially.'
  },
  {
    question: 'What documentation do I need for agricultural drone operations?',
    answer: 'Agricultural operations require: Part 107 certificate, Part 137 certificate (for spraying), aircraft registration, Remote ID compliance, flight logs with field/crop information, application records (product, rate, weather conditions), and state pesticide applicator license if required.'
  },
  {
    question: 'Are there special insurance requirements for agricultural drones?',
    answer: 'Yes, agricultural operations typically require higher liability coverage ($1-5 million) and specific coverage for chemical drift, crop damage, and environmental liability. Standard drone policies may exclude spraying operations—verify your coverage specifically includes agricultural application.'
  }
];

const tableOfContents = [
  { id: 'operation-types', title: 'Types of Agricultural Drone Operations' },
  { id: 'part-107', title: 'Part 107 Requirements' },
  { id: 'part-137', title: 'Part 137 for Spraying' },
  { id: 'epa-requirements', title: 'EPA & Chemical Requirements' },
  { id: 'documentation', title: 'Documentation Requirements' },
  { id: 'state-requirements', title: 'State-Specific Requirements' },
  { id: 'faq', title: 'FAQ' }
];

export default function AgricultureDroneCompliancePage() {
  return (
    <>
      <SchemaScript schema={generateArticleSchema({
        title: 'Agriculture Drone Compliance Guide',
        description: 'Complete guide to agricultural drone compliance including Part 137 and EPA requirements',
        slug: 'agriculture-drone-compliance',
        publishedTime: '2024-12-15T00:00:00Z',
        modifiedTime: '2024-12-15T00:00:00Z'
      })} />
      <SchemaScript schema={generateFAQSchema(faqs)} />

      <ResourceLayout
        title="Agriculture Drone Compliance Guide"
        subtitle="FAA Part 107, Part 137, EPA requirements, and documentation best practices for crop spraying, mapping, and monitoring"
        breadcrumbs={[{ label: 'Agriculture Drone Compliance' }]}
        readingTime={10}
        lastUpdated="December 2024"
        tableOfContents={tableOfContents}
      >
        {/* Featured Snippet Target */}
        <FeaturedSnippet question="What certifications do I need to spray crops with a drone?">
          <p className="mb-4">
            <strong>Drone crop spraying requires multiple certifications:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>FAA Part 107:</strong> Remote Pilot Certificate (all commercial operations)</li>
            <li><strong>FAA Part 137:</strong> Agricultural Aircraft Operator certificate (for aerial application)</li>
            <li><strong>State License:</strong> Pesticide applicator license (required in most states)</li>
            <li><strong>EPA Compliance:</strong> Follow label requirements, record keeping</li>
            <li><strong>Aircraft Requirements:</strong> FAA registration, Remote ID compliance</li>
          </ul>
        </FeaturedSnippet>

        <p className="lead text-lg text-slate-700">
          Agricultural drones are revolutionizing farming—from precision spraying to crop health monitoring. But the regulatory landscape is more complex than typical commercial drone operations. This guide covers everything you need to operate agricultural drones legally and safely.
        </p>

        <section id="operation-types">
          <h2>Types of Agricultural Drone Operations</h2>
          <p>
            The certification requirements depend on what type of agricultural work you&apos;re performing. Understanding these categories is essential for compliance:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white border-2 border-emerald-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Wheat className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Imaging & Monitoring</h3>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">Part 107 Only</span>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Crop health assessment (NDVI imaging)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Field mapping and surveying
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Irrigation monitoring
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Pest/disease scouting
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Livestock monitoring
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-amber-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Droplets className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Aerial Application</h3>
                <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">Part 107 + Part 137</span>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  Pesticide spraying
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  Herbicide application
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  Fertilizer application
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  Seed spreading
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  Cover crop seeding
                </li>
              </ul>
            </div>
          </div>

          <CalloutBox type="info" title="The Key Distinction">
            <p>
              <strong>If your drone is dispensing any substance onto crops or land, you need Part 137.</strong> If you&apos;re only capturing data (photos, video, sensor readings) without releasing anything from the aircraft, Part 107 alone is sufficient.
            </p>
          </CalloutBox>
        </section>

        <section id="part-107">
          <h2>Part 107 Requirements for Agriculture</h2>
          <p>
            All commercial agricultural drone operations start with Part 107 certification. Here&apos;s what&apos;s specifically relevant for agricultural operators:
          </p>

          <div className="bg-slate-50 rounded-xl p-6 my-8">
            <h3 className="font-semibold text-slate-900 mb-4">Part 107 Basics for Agricultural Operations</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Remote Pilot Certificate
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Aircraft registration (FAA DroneZone)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Remote ID compliance
                </li>
              </ul>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Visual line of sight
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  400ft AGL maximum
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Daylight operations (or waiver)
                </li>
              </ul>
            </div>
          </div>

          <h3>Agricultural-Specific Waivers</h3>
          <p>
            Agricultural operations commonly need waivers for:
          </p>
          <ul className="list-disc pl-5 space-y-2 my-4 text-slate-600">
            <li><strong>Operations from a moving vehicle (107.25):</strong> Following spray patterns in a truck</li>
            <li><strong>Visual line of sight (107.31):</strong> Large field operations may require BVLOS</li>
            <li><strong>Operations over people (107.39):</strong> If farm workers are in the field</li>
            <li><strong>Night operations (107.29):</strong> Early morning or evening applications</li>
          </ul>
        </section>

        <section id="part-137">
          <h2>Part 137: Agricultural Aircraft Operations</h2>
          <p>
            If you&apos;re dispensing any material from your drone—pesticides, fertilizers, seeds—you need <a href="https://www.ecfr.gov/current/title-14/chapter-I/subchapter-G/part-137" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">Part 137 certification <ExternalLink className="inline h-4 w-4" /></a>.
          </p>

          <CalloutBox type="warning" title="Part 137 Is Mandatory for Spraying">
            <p>
              Operating without Part 137 when dispensing substances can result in certificate action against your Part 107, civil penalties up to $27,500 per violation, and potential criminal charges for pesticide violations. This is actively enforced.
            </p>
          </CalloutBox>

          <h3>Part 137 Certificate Requirements</h3>
          <div className="space-y-4 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 mb-3">Private Agricultural Aircraft Operator</h4>
              <p className="text-slate-600 mb-3">For farmers treating their own land or operating on an exchange basis:</p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Knowledge test on Part 137 regulations
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Application to FAA Flight Standards District Office (FSDO)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Congested area plan (if operating near congested areas)
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 mb-3">Commercial Agricultural Aircraft Operator</h4>
              <p className="text-slate-600 mb-3">For operators providing services to other farmers:</p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Everything required for private certification
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Demonstrated skill test
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Operations manual
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Higher insurance requirements
                </li>
              </ul>
            </div>
          </div>
        </section>

        <InlineCTA
          title="Track your ag compliance in one place"
          description="Aeronote helps agricultural operators manage flight logs, application records, and compliance documentation across all your fields and operations."
          buttonText="Start Free Trial"
          buttonUrl="/auth/signup"
        />

        <section id="epa-requirements">
          <h2>EPA & Chemical Compliance</h2>
          <p>
            Beyond FAA requirements, agricultural spraying operations must comply with EPA regulations:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <Scale className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Pesticide Label Compliance</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li>• Follow all label directions exactly</li>
                <li>• Observe buffer zones and setbacks</li>
                <li>• Apply at specified rates</li>
                <li>• Note weather restrictions (wind, temperature)</li>
                <li>• Observe re-entry intervals (REI)</li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <FileCheck className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Record Keeping Requirements</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li>• Product name and EPA registration number</li>
                <li>• Application date, time, and location</li>
                <li>• Total amount applied</li>
                <li>• Crop and field identification</li>
                <li>• Applicator name and license number</li>
              </ul>
            </div>
          </div>

          <CalloutBox type="error" title="Restricted Use Pesticides (RUP)">
            <p>
              Applying Restricted Use Pesticides requires additional certification. Only certified applicators or those under their direct supervision can apply RUPs. Violations carry significant civil and criminal penalties. Records must be kept for 2 years minimum.
            </p>
          </CalloutBox>
        </section>

        <section id="documentation">
          <h2>Documentation Requirements</h2>
          <p>
            Agricultural operations require more comprehensive documentation than typical commercial drone work:
          </p>

          <div className="bg-slate-50 rounded-xl p-6 my-8">
            <h3 className="font-semibold text-slate-900 mb-4">Complete Agricultural Flight Log</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-800 mb-3">Flight Information</h4>
                <ul className="space-y-1 text-slate-600 text-sm">
                  <li>• Date and time of operation</li>
                  <li>• Field location (GPS coordinates)</li>
                  <li>• Aircraft registration number</li>
                  <li>• Pilot name and certificate numbers</li>
                  <li>• Total flight time</li>
                  <li>• Weather conditions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 mb-3">Application Records</h4>
                <ul className="space-y-1 text-slate-600 text-sm">
                  <li>• Product applied (name, EPA #)</li>
                  <li>• Application rate (oz/acre, gal/acre)</li>
                  <li>• Total product used</li>
                  <li>• Acres treated</li>
                  <li>• Wind speed and direction</li>
                  <li>• Customer/landowner name</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="state-requirements">
          <h2>State-Specific Requirements</h2>
          <p>
            Many states have additional requirements for agricultural drone operators:
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Pesticide Applicator Licensing</h3>
                  <p className="text-slate-600 mb-2">
                    Most states require drone applicators to hold a state pesticide applicator license. Requirements vary:
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Some states have specific drone/UAS categories</li>
                    <li>• Others include drone spraying under existing aerial categories</li>
                    <li>• Testing and continuing education requirements vary</li>
                    <li>• Some states require business licenses for commercial applicators</li>
                  </ul>
                </div>
              </div>
            </div>

            <CalloutBox type="info" title="Check Your State">
              <p>
                Contact your state&apos;s Department of Agriculture before starting spraying operations. Requirements change frequently, and state penalties for pesticide violations can be severe. Many states also require notification before aerial application in certain areas.
              </p>
            </CalloutBox>
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
