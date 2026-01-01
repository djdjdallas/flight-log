import Link from 'next/link';
import { Building2, Shield, Camera, FileCheck, AlertTriangle, CheckCircle, MapPin, Scale, ExternalLink } from 'lucide-react';
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
  title: 'Real Estate Drone Photography Compliance Guide (2025)',
  description: 'Complete guide to Part 107 requirements for real estate drone photography. Learn federal regulations, state-specific rules, insurance needs, and documentation best practices.',
  keywords: ['real estate drone photography', 'Part 107 real estate', 'drone compliance real estate', 'real estate aerial photography regulations', 'drone photography legal requirements'],
  slug: 'real-estate-drone-compliance',
  publishedTime: '2024-12-15T00:00:00Z',
  modifiedTime: '2024-12-15T00:00:00Z'
});

const faqs = [
  {
    question: 'Do I need Part 107 for real estate drone photography?',
    answer: 'Yes, if you\'re being compensated in any way for drone photography—including real estate photos and videos—you must hold a Part 107 Remote Pilot Certificate. This applies even if you\'re a real estate agent photographing your own listings, as you\'re indirectly compensated through potential commissions.'
  },
  {
    question: 'Can real estate agents fly drones themselves?',
    answer: 'Yes, but they must obtain their Part 107 certificate first. Many agents choose to get certified, while others hire professional drone operators. Even if you\'re photographing your own listings, commercial rules apply because you\'re doing so for business purposes.'
  },
  {
    question: 'What insurance do I need for real estate drone photography?',
    answer: 'Most commercial drone operators carry $1 million in liability insurance, which is increasingly required by real estate agencies and MLSs. Some operators also carry hull insurance for equipment damage. Your personal homeowner\'s policy typically does not cover commercial drone operations.'
  },
  {
    question: 'Do I need property owner permission to fly for real estate?',
    answer: 'While FAA regulations don\'t require property owner permission for airspace access, best practice is to notify or get permission from the property owner and neighbors. Some states have privacy laws that may affect drone operations over private property. Always respect privacy and avoid capturing images of neighboring properties without consent.'
  },
  {
    question: 'Can I fly over a house for sale without permission?',
    answer: 'For your own client\'s listing, you should have implicit permission. However, be careful about flying over neighboring properties. While the FAA doesn\'t regulate this, state privacy and trespassing laws vary. Some states like California have specific drone privacy laws. It\'s safest to get explicit permission and keep flights over the subject property.'
  },
  {
    question: 'Are there height restrictions for real estate drone photography?',
    answer: 'Yes, under Part 107, you cannot fly higher than 400 feet AGL (above ground level) unless within 400 feet of a structure. For tall buildings, you can fly up to 400 feet above the structure\'s height. Most real estate photography is done well under this limit for optimal perspectives.'
  }
];

const preflightChecklist = [
  'Verify Part 107 certificate is current',
  'Check weather conditions (wind, precipitation, visibility)',
  'Verify property address and confirm appointment',
  'Check airspace restrictions (B4UFLY or Aloft app)',
  'Obtain LAANC authorization if in controlled airspace',
  'Verify Remote ID is functioning',
  'Inspect aircraft and batteries',
  'Confirm liability insurance is current',
  'Review any property-specific restrictions or HOA rules',
  'Plan flight path to avoid neighboring properties'
];

const tableOfContents = [
  { id: 'part-107-requirements', title: 'Part 107 Requirements' },
  { id: 'state-regulations', title: 'State-Specific Regulations' },
  { id: 'insurance', title: 'Insurance Requirements' },
  { id: 'preflight-checklist', title: 'Pre-Flight Checklist' },
  { id: 'documentation', title: 'Documentation Best Practices' },
  { id: 'liability', title: 'Liability Protection' },
  { id: 'faq', title: 'FAQ' }
];

export default function RealEstateDroneCompliancePage() {
  return (
    <>
      <SchemaScript schema={generateArticleSchema({
        title: 'Real Estate Drone Photography Compliance Guide',
        description: 'Complete guide to Part 107 requirements for real estate drone photography',
        slug: 'real-estate-drone-compliance',
        publishedTime: '2024-12-15T00:00:00Z',
        modifiedTime: '2024-12-15T00:00:00Z'
      })} />
      <SchemaScript schema={generateFAQSchema(faqs)} />

      <ResourceLayout
        title="Real Estate Drone Photography Compliance Guide"
        subtitle="Everything real estate photographers and agents need to know about Part 107, state regulations, insurance, and documentation for legal drone operations"
        breadcrumbs={[{ label: 'Real Estate Drone Compliance' }]}
        readingTime={10}
        lastUpdated="December 2024"
        tableOfContents={tableOfContents}
      >
        {/* Featured Snippet Target */}
        <FeaturedSnippet question="Do I need Part 107 for real estate drone photography?">
          <p className="mb-4">
            <strong>Yes, Part 107 certification is required</strong> for all commercial drone photography, including real estate. Any drone operation where you receive compensation—directly or indirectly—requires:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>FAA Part 107 Remote Pilot Certificate</li>
            <li>FAA drone registration with visible marking</li>
            <li>Remote ID compliance (built-in or module)</li>
            <li>Airspace authorization for controlled airspace (LAANC)</li>
            <li>Liability insurance (typically $1M minimum)</li>
          </ul>
        </FeaturedSnippet>

        <p className="lead text-lg text-slate-700">
          Real estate drone photography has transformed property marketing, offering perspectives that were once only available via expensive helicopter shoots. But with this opportunity comes responsibility—both to follow FAA regulations and to protect yourself from liability. This guide covers everything you need to operate legally and professionally.
        </p>

        <section id="part-107-requirements">
          <h2>Part 107 Requirements for Real Estate</h2>
          <p>
            The <a href="https://www.faa.gov/uas/commercial_operators" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">FAA Part 107 regulations <ExternalLink className="inline h-4 w-4" /></a> apply to all commercial drone operations, including real estate photography. Here&apos;s what you need to know:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <FileCheck className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Certification</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Pass FAA Part 107 knowledge test
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Complete recurrent training every 24 months
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Carry certificate and photo ID when flying
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <Camera className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Operational Rules</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Fly during daylight (or civil twilight with lighting)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Maintain visual line of sight
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Maximum altitude 400ft AGL
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Maximum speed 100 mph
                </li>
              </ul>
            </div>
          </div>

          <CalloutBox type="warning" title="Real Estate Agents: Yes, You Need Part 107">
            <p>
              Even if you&apos;re photographing your own listings, you need Part 107 certification. The FAA considers this commercial operation because you&apos;re receiving indirect compensation (potential commission). The only exemption is the recreational exemption, which does not apply when the flight furthers any business purpose.
            </p>
          </CalloutBox>
        </section>

        <section id="state-regulations">
          <h2>State-Specific Drone Regulations</h2>
          <p>
            While the FAA regulates airspace nationally, states can impose additional restrictions related to privacy, trespassing, and local ordinances. Here are some key states with specific drone laws affecting real estate photography:
          </p>

          <div className="space-y-6 my-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">California</h3>
                  <p className="text-slate-600 mb-2">
                    California Civil Code 1708.8 prohibits capturing images of people engaging in private activities on private property. When photographing real estate:
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Avoid capturing identifiable people without consent</li>
                    <li>• Be aware of neighboring properties&apos; privacy</li>
                    <li>• Don&apos;t fly over areas where private activities occur (backyards, pools)</li>
                    <li>• Notify neighbors when possible as a courtesy</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Texas</h3>
                  <p className="text-slate-600 mb-2">
                    Texas Government Code Chapter 423 restricts drone surveillance over private property. Real estate operations are generally allowed but:
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Don&apos;t capture images of neighboring properties without consent</li>
                    <li>• Focus imagery on the subject property</li>
                    <li>• Real estate marketing is an enumerated exception but still requires reasonable practices</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Florida</h3>
                  <p className="text-slate-600 mb-2">
                    Florida Statute 934.50 restricts drone surveillance but exempts licensed real estate professionals. However:
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• The exemption covers property inspection for appraisal purposes</li>
                    <li>• Commercial photography is generally permitted with property owner consent</li>
                    <li>• Avoid capturing images intended for surveillance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <CalloutBox type="info" title="Research Your State">
            <p>
              Drone laws vary significantly by state and can change frequently. Before operating, research your state&apos;s specific drone and privacy laws. The <a href="https://www.ncsl.org/research/transportation/current-unmanned-aircraft-state-law-landscape.aspx" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">National Conference of State Legislatures</a> maintains an updated database of state drone laws.
            </p>
          </CalloutBox>
        </section>

        <section id="insurance">
          <h2>Insurance Requirements</h2>
          <p>
            While not federally mandated, liability insurance is essential for professional real estate drone photography. Many clients, MLSs, and property managers require proof of insurance before you can fly.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Liability Insurance</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>$1M minimum recommended</strong> – Industry standard for commercial operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Covers property damage</strong> – If your drone damages the listing or neighboring property</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Covers bodily injury</strong> – If someone is injured by your drone</span>
                </li>
              </ul>
              <p className="text-sm text-slate-500 mt-4">
                Typical cost: $500-1,500/year or $10-50/day for on-demand coverage
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Hull Insurance (Optional)</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Covers your equipment</strong> – Repairs or replacement if damaged</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Theft protection</strong> – Covers stolen equipment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Crash coverage</strong> – Flyaways, crashes, water damage</span>
                </li>
              </ul>
              <p className="text-sm text-slate-500 mt-4">
                Typical cost: 5-10% of equipment value annually
              </p>
            </div>
          </div>

          <div className="bg-sky-50 rounded-xl p-6 my-8">
            <h4 className="font-semibold text-slate-900 mb-4">Recommended Insurance Providers</h4>
            <ul className="space-y-2 text-slate-600">
              <li>• <strong>SkyWatch.AI</strong> – On-demand and annual policies, instant certificates</li>
              <li>• <strong>Thimble</strong> – Pay-per-flight options, easy mobile app</li>
              <li>• <strong>Verifly</strong> – Hourly coverage options</li>
              <li>• <strong>BWI Fly</strong> – Traditional annual policies</li>
              <li>• <strong>Avion Insurance</strong> – Specializes in commercial operations</li>
            </ul>
          </div>
        </section>

        <InlineCTA
          title="Keep your insurance documents organized"
          description="Aeronote stores your insurance certificates alongside flight records, making it easy to provide proof of coverage to clients and during audits."
          buttonText="Get Organized"
          buttonUrl="/auth/signup"
        />

        <section id="preflight-checklist">
          <h2>Pre-Flight Checklist for Real Estate Shoots</h2>
          <p>
            Use this checklist before every real estate drone shoot to ensure compliance and professionalism:
          </p>

          <div className="bg-white border border-slate-200 rounded-xl p-6 my-8">
            <h3 className="font-semibold text-slate-900 mb-4">Real Estate Drone Photography Checklist</h3>
            <div className="space-y-2">
              {preflightChecklist.map((item, index) => (
                <label key={index} className="flex items-start gap-3 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="mt-1 rounded border-slate-300" readOnly />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <CalloutBox type="success" title="Pro Tip: Create a Go-Kit">
            <p>
              Keep a bag with all your essential documents and equipment ready to go. Include: printed Part 107 certificate, insurance certificate, spare batteries, memory cards, and a tablet/phone with airspace apps installed. This saves time and ensures you never forget critical items.
            </p>
          </CalloutBox>
        </section>

        <section id="documentation">
          <h2>Documentation Best Practices</h2>
          <p>
            Proper documentation protects you legally and helps build a professional reputation. Here&apos;s what to record for each real estate shoot:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Flight Log Data</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Date and time of flight</li>
                <li>• Property address</li>
                <li>• Flight duration</li>
                <li>• Maximum altitude reached</li>
                <li>• Weather conditions</li>
                <li>• Aircraft and pilot information</li>
                <li>• Any incidents or anomalies</li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Client Documentation</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Client/agent name and contact</li>
                <li>• Property owner consent (if different from client)</li>
                <li>• Services contracted</li>
                <li>• Delivery specifications</li>
                <li>• Usage rights granted</li>
                <li>• Invoice and payment record</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="liability">
          <h2>Liability Protection Tips</h2>
          <p>
            Beyond insurance, take these steps to minimize your liability exposure:
          </p>

          <div className="space-y-4 my-8">
            <CalloutBox type="info" title="Written Contracts">
              <p>
                Always use written contracts that specify the scope of work, deliverables, usage rights, and liability limitations. Include clauses addressing weather cancellations, reshoots, and copyright ownership.
              </p>
            </CalloutBox>

            <CalloutBox type="info" title="Property Release Forms">
              <p>
                Have property owners sign a release allowing aerial photography. This protects you if someone later claims you didn&apos;t have permission to photograph the property.
              </p>
            </CalloutBox>

            <CalloutBox type="info" title="Neighbor Notification">
              <p>
                When possible, give neighbors advance notice of your shoot. A simple door hanger or verbal heads-up can prevent complaints and awkward confrontations. This is especially important in dense neighborhoods.
              </p>
            </CalloutBox>

            <CalloutBox type="info" title="Post-Processing Blurring">
              <p>
                If neighboring properties or people are captured in your footage, blur or remove them in post-processing. Many clients will appreciate this attention to privacy, and it protects you from potential claims.
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
          { title: 'Flight Log Software vs Spreadsheet', href: '/resources/drone-flight-log-software-vs-spreadsheet' }
        ]} />
      </ResourceLayout>
    </>
  );
}
