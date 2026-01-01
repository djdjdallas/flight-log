import Link from 'next/link';
import { Radio, Shield, MapPin, AlertTriangle, CheckCircle, XCircle, ExternalLink, Wifi, Smartphone, Building } from 'lucide-react';
import ResourceLayout from '@/components/resources/ResourceLayout';
import {
  CalloutBox,
  FeaturedSnippet,
  ComparisonTable,
  FAQSection,
  InlineCTA,
  RelatedResources,
  generateResourceMetadata,
  generateArticleSchema,
  generateFAQSchema,
  SchemaScript
} from '@/components/resources';

export const metadata = generateResourceMetadata({
  title: 'What is Remote ID for Drones? Complete 2025 Guide',
  description: 'Everything you need to know about FAA Remote ID requirements. Learn what Remote ID is, the three compliance options, deadlines, and penalties for non-compliance.',
  keywords: ['what is remote id', 'drone remote id', 'FAA remote id requirements', 'remote id compliance', 'remote id deadline', 'drone identification'],
  slug: 'what-is-remote-id',
  publishedTime: '2024-12-15T00:00:00Z',
  modifiedTime: '2024-12-15T00:00:00Z'
});

const faqs = [
  {
    question: 'What is Remote ID for drones?',
    answer: 'Remote ID is a digital identification system for drones required by the FAA. It broadcasts identification and location information from your drone during flight, similar to a digital license plate. This allows the FAA, law enforcement, and other authorities to identify drones in flight and locate their operators.'
  },
  {
    question: 'When did Remote ID become mandatory?',
    answer: 'Remote ID enforcement began on March 16, 2024. As of this date, all drone operators in the United States must comply with Remote ID requirements through one of three methods: Standard Remote ID (built-in), Remote ID broadcast module, or flying within an FAA-Recognized Identification Area (FRIA).'
  },
  {
    question: 'Do I need Remote ID for recreational flying?',
    answer: 'Yes, Remote ID applies to both recreational and commercial drone operators. All drones that require FAA registration (weighing over 0.55 lbs / 250g) must comply with Remote ID requirements, regardless of whether you fly for fun or business.'
  },
  {
    question: 'What information does Remote ID broadcast?',
    answer: 'Standard Remote ID broadcasts: drone serial number or session ID, drone latitude/longitude/altitude, drone velocity, operator latitude/longitude (takeoff location), time mark, and emergency status. This information is broadcast locally via Bluetooth or Wi-Fi and is not transmitted to a central database during flight.'
  },
  {
    question: 'Can anyone see my Remote ID information?',
    answer: 'Yes, Remote ID broadcasts are unencrypted and can be received by anyone with a compatible smartphone app or receiver within range (typically 300-500 meters). Law enforcement and the FAA can use this information to identify and contact drone operators.'
  },
  {
    question: 'What drones have built-in Remote ID?',
    answer: 'Most drones manufactured after September 2022 include Standard Remote ID. DJI drones with built-in Remote ID include: Mini 4 Pro, Air 3, Mavic 3 series, Inspire 3, and others. Check your manufacturer\'s specifications or the FAA\'s list of approved Remote ID devices.'
  },
  {
    question: 'How much does a Remote ID module cost?',
    answer: 'Remote ID broadcast modules typically cost between $100-$200. Popular options include the DroneTag, Dronetag Mini, and similar devices. The module must be registered with the FAA and declared on your aircraft registration.'
  },
  {
    question: 'What are the penalties for flying without Remote ID?',
    answer: 'Flying without Remote ID compliance can result in FAA enforcement action including warning letters, civil penalties up to $27,500 per violation, and potential certificate action for Part 107 pilots. Repeat violations or dangerous operations can result in increased penalties.'
  }
];

const comparisonHeaders = ['Feature', 'Standard Remote ID', 'Broadcast Module', 'FRIA'];
const comparisonRows = [
  ['Built into drone', true, false, 'N/A'],
  ['Works anywhere in US', true, true, false],
  ['Internet connection required', false, false, false],
  ['Additional cost', 'Included in new drones', '$100-200', 'Free'],
  ['FAA registration required', true, true, true],
  ['Broadcasts operator location', true, true, false],
  ['Works with legacy drones', false, true, true],
  ['Geographic restrictions', false, false, 'FRIA boundaries only'],
];

const tableOfContents = [
  { id: 'what-is-remote-id', title: 'What is Remote ID?' },
  { id: 'compliance-options', title: 'Three Compliance Options' },
  { id: 'comparison', title: 'Option Comparison' },
  { id: 'what-it-broadcasts', title: 'What Remote ID Broadcasts' },
  { id: 'checking-compliance', title: 'Check Your Compliance Status' },
  { id: 'penalties', title: 'Penalties for Non-Compliance' },
  { id: 'faq', title: 'FAQ' }
];

export default function WhatIsRemoteIDPage() {
  return (
    <>
      <SchemaScript schema={generateArticleSchema({
        title: 'What is Remote ID for Drones?',
        description: 'Complete guide to FAA Remote ID requirements for drone operators',
        slug: 'what-is-remote-id',
        publishedTime: '2024-12-15T00:00:00Z',
        modifiedTime: '2024-12-15T00:00:00Z'
      })} />
      <SchemaScript schema={generateFAQSchema(faqs)} />

      <ResourceLayout
        title="What is Remote ID for Drones?"
        subtitle="A complete guide to FAA Remote ID requirements, compliance options, and what you need to know to fly legally in 2025"
        breadcrumbs={[{ label: 'What is Remote ID?' }]}
        readingTime={6}
        lastUpdated="December 2024"
        tableOfContents={tableOfContents}
      >
        {/* Featured Snippet Target - Definition */}
        <FeaturedSnippet question="What is Remote ID for drones?">
          <p className="mb-4">
            <strong>Remote ID is a digital license plate for drones</strong> required by the FAA since March 16, 2024. It broadcasts identification and location information during flight, allowing authorities to identify drones and locate operators. All drones over 0.55 lbs (250g) must comply through one of three methods:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Standard Remote ID:</strong> Built into new drones manufactured after Sep 2022</li>
            <li><strong>Broadcast Module:</strong> Add-on device for legacy drones ($100-200)</li>
            <li><strong>FRIA:</strong> Flying within FAA-Recognized Identification Areas only</li>
          </ul>
        </FeaturedSnippet>

        <section id="what-is-remote-id">
          <h2>Understanding Remote ID</h2>
          <p>
            Remote ID is the FAA&apos;s solution for drone identification and accountability in the national airspace. Think of it as a digital license plate that broadcasts information about your drone while it&apos;s flying. This technology helps the FAA, law enforcement, and national security agencies distinguish between legitimate drone operations and potential threats.
          </p>
          <p>
            The Remote ID rule (<a href="https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-89" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">14 CFR Part 89 <ExternalLink className="inline h-4 w-4" /></a>) was published in January 2021, with full compliance required as of March 16, 2024. This applies to both recreational and commercial operators.
          </p>

          <CalloutBox type="info" title="Why Remote ID Exists">
            <p>
              Before Remote ID, there was no way for authorities to identify drones in flight or locate their operators. This created security concerns, complicated airspace management, and made it difficult to investigate drone incidents. Remote ID enables drones to be integrated more safely into the national airspace.
            </p>
          </CalloutBox>

          <div className="bg-gradient-to-br from-slate-50 to-sky-50 rounded-xl p-8 my-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">How Remote ID Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-sm flex items-center justify-center">
                  <Radio className="h-8 w-8 text-sky-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">1. Drone Broadcasts</h4>
                <p className="text-sm text-slate-600">
                  Your drone continuously broadcasts identification data via Bluetooth or Wi-Fi during flight
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-sm flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-sky-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">2. Receivers Detect</h4>
                <p className="text-sm text-slate-600">
                  Anyone with a compatible app or device can receive the broadcast within range (~500m)
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-sm flex items-center justify-center">
                  <Shield className="h-8 w-8 text-sky-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">3. Authorities Identify</h4>
                <p className="text-sm text-slate-600">
                  FAA and law enforcement can identify the drone, its operator location, and registration
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="compliance-options">
          <h2>Three Ways to Comply with Remote ID</h2>
          <p>
            The FAA provides three paths to Remote ID compliance. Your best option depends on when your drone was manufactured and where you typically fly.
          </p>

          <div className="space-y-6 my-8">
            {/* Option 1: Standard Remote ID */}
            <div className="bg-white border-2 border-emerald-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-3 rounded-lg flex-shrink-0">
                  <Wifi className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">Option 1: Standard Remote ID</h3>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">Recommended</span>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Built into drones manufactured after September 16, 2022. This is the most seamless compliance option as it requires no additional equipment or setup.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Pros:</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          No additional cost or equipment
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Automatic—just fly normally
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Works anywhere in the US
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Cons:</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-slate-400" />
                          Only available on newer drones
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-slate-400" />
                          May require firmware updates
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                      <strong>Compatible drones:</strong> DJI Mini 4 Pro, Air 3, Mavic 3 Pro/Classic/Enterprise, Inspire 3, Matrice 30/350, Autel EVO II V3, Skydio 2+/X2, and most drones released after late 2022.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2: Broadcast Module */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-sky-100 p-3 rounded-lg flex-shrink-0">
                  <Radio className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">Option 2: Remote ID Broadcast Module</h3>
                    <span className="bg-sky-100 text-sky-700 text-xs font-medium px-2 py-0.5 rounded-full">For Legacy Drones</span>
                  </div>
                  <p className="text-slate-600 mb-4">
                    An add-on device that attaches to your existing drone and broadcasts Remote ID information. Best for pilots with older drones they want to continue using.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Pros:</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Works with any drone
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Fly anywhere in the US
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          One-time purchase
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Cons:</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-slate-400" />
                          Additional cost ($100-200)
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-slate-400" />
                          Adds weight to drone
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-slate-400" />
                          Must maintain visual line of sight to module
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                      <strong>Popular modules:</strong> DroneTag Mini, DroneTag Beacon, Involi LEMAN, and other FAA-approved broadcast modules. Check the <a href="https://uasdoc.faa.gov/listDocs" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">FAA Declaration of Compliance list <ExternalLink className="inline h-4 w-4" /></a> for approved devices.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 3: FRIA */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg flex-shrink-0">
                  <Building className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">Option 3: FAA-Recognized Identification Area (FRIA)</h3>
                    <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">Limited Use</span>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Designated areas where you can fly without Remote ID. Primarily at fixed flying sites operated by community-based organizations (CBOs) like the AMA.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Pros:</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          No equipment needed
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Free to use
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Good for training
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Cons:</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-slate-400" />
                          Very limited locations
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-slate-400" />
                          Not practical for commercial ops
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-slate-400" />
                          Maximum altitude: 400ft within FRIA
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                      <strong>Find FRIAs:</strong> Use the <a href="https://faa.maps.arcgis.com/apps/webappviewer/index.html?id=6c9b5a99bc2f4f77a04babe4e6019e15" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">FAA UAS Facility Maps <ExternalLink className="inline h-4 w-4" /></a> to locate FAA-Recognized Identification Areas near you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="comparison">
          <h2>Remote ID Options Comparison</h2>
          <p>
            Use this comparison to determine which Remote ID compliance method is best for your situation.
          </p>

          <ComparisonTable
            headers={comparisonHeaders}
            rows={comparisonRows}
            highlightColumn={1}
          />

          <CalloutBox type="success" title="Recommendation for Commercial Operators">
            <p>
              If you fly commercially, Standard Remote ID (either built-in or via broadcast module) is the only practical option. FRIAs are too limited geographically for most commercial operations. Consider upgrading to a drone with built-in Remote ID for the smoothest experience.
            </p>
          </CalloutBox>
        </section>

        <InlineCTA
          title="Track your Remote ID compliance status"
          description="Aeronote automatically tracks Remote ID compliance for your entire fleet, alerts you to issues, and generates compliance reports for audits."
          buttonText="Start Free Trial"
          buttonUrl="/auth/signup"
        />

        <section id="what-it-broadcasts">
          <h2>What Information Does Remote ID Broadcast?</h2>
          <p>
            Understanding what data your drone transmits helps you know what authorities (and others) can see about your operations.
          </p>

          <div className="bg-slate-50 rounded-xl p-6 my-8">
            <h3 className="font-semibold text-slate-900 mb-4">Standard Remote ID Broadcast Message</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-800 mb-3">Drone Information</h4>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Serial Number or Session ID:</strong> Unique identifier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Latitude & Longitude:</strong> Current drone position</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Geometric Altitude:</strong> Height above ground</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Velocity:</strong> Speed and direction</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 mb-3">Operator Information</h4>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Control Station Location:</strong> Takeoff point coordinates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Time Mark:</strong> Timestamp of message</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Emergency Status:</strong> If declared</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <CalloutBox type="warning" title="Privacy Consideration">
            <p>
              Remote ID broadcasts are <strong>not encrypted</strong> and can be received by anyone within range using a smartphone app. This means members of the public can potentially identify where you&apos;re operating from. Plan accordingly if privacy is a concern for your operations.
            </p>
          </CalloutBox>
        </section>

        <section id="checking-compliance">
          <h2>How to Check Your Compliance Status</h2>
          <p>
            Not sure if your drone is Remote ID compliant? Here&apos;s how to find out:
          </p>

          <ol className="list-decimal pl-5 space-y-4 my-6">
            <li>
              <strong>Check your drone&apos;s specifications:</strong> Look up your model on the manufacturer&apos;s website or product documentation. Drones released after September 2022 should have Standard Remote ID built-in.
            </li>
            <li>
              <strong>Check the FAA&apos;s approved list:</strong> Visit the <a href="https://uasdoc.faa.gov/listDocs" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">FAA Declaration of Compliance database <ExternalLink className="inline h-4 w-4" /></a> to see if your drone or Remote ID module is FAA-approved.
            </li>
            <li>
              <strong>Test with a Remote ID receiver app:</strong> Use apps like &quot;OpenDroneID&quot; (free) or &quot;Drone Scanner&quot; to verify your drone is broadcasting correctly during flight.
            </li>
            <li>
              <strong>Check firmware:</strong> Ensure your drone&apos;s firmware is updated. Some drones required updates to enable Remote ID functionality.
            </li>
          </ol>

          <div className="bg-sky-50 rounded-xl p-6 my-8">
            <h4 className="font-semibold text-slate-900 mb-4">Popular Remote ID Receiver Apps</h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-sky-600" />
                <span><strong>OpenDroneID</strong> – Free, open-source (Android)</span>
              </li>
              <li className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-sky-600" />
                <span><strong>Drone Scanner</strong> – Free, easy to use (iOS & Android)</span>
              </li>
              <li className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-sky-600" />
                <span><strong>DroneTag App</strong> – From broadcast module manufacturer</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="penalties">
          <h2>Penalties for Remote ID Non-Compliance</h2>
          <p>
            Since March 16, 2024, the FAA has been actively enforcing Remote ID requirements. Here&apos;s what you risk by flying without compliance:
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">First-Time Violations</h4>
                  <p className="text-slate-600">
                    Warning letters and educational enforcement for first-time, minor violations. The FAA typically takes a compliance-focused approach initially.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Repeat or Serious Violations</h4>
                  <p className="text-slate-600 mb-3">
                    Civil penalties and certificate action for repeat violations, intentional non-compliance, or violations that create safety risks:
                  </p>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Civil penalties up to <strong>$27,500 per violation</strong></li>
                    <li>• Part 107 certificate suspension or revocation</li>
                    <li>• Potential criminal penalties for egregious cases</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <CalloutBox type="info" title="Enforcement Priority">
            <p>
              The FAA prioritizes enforcement based on safety risk. Flying without Remote ID in controlled airspace, near airports, or during incidents will likely result in more severe enforcement than recreational flying in uncontrolled airspace.
            </p>
          </CalloutBox>
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
