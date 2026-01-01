import Link from 'next/link';
import { Scale, HelpCircle, AlertTriangle, CheckCircle, XCircle, Plane, ExternalLink } from 'lucide-react';
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
  title: 'Do Drones Under 250g Need Remote ID? (2025 Answer)',
  description: 'Clear answer on whether sub-250 gram drones need Remote ID. Learn the rules for DJI Mini series, recreational vs commercial use, and when the exemption applies.',
  keywords: ['drones under 250g remote id', 'sub 250 gram drone rules', 'DJI Mini Remote ID', 'lightweight drone regulations', '250g drone exemption'],
  slug: 'drones-under-250g-remote-id',
  publishedTime: '2024-12-15T00:00:00Z',
  modifiedTime: '2024-12-15T00:00:00Z'
});

const faqs = [
  {
    question: 'Do drones under 250 grams need Remote ID?',
    answer: 'It depends on how you fly. Recreational pilots flying unmodified drones under 250g do NOT need Remote ID or registration. However, if you fly commercially (Part 107), add weight to your drone, or if your drone has built-in Remote ID that you\'re required to activate, different rules may apply. The 250g exemption only applies to purely recreational flying with an unmodified drone.'
  },
  {
    question: 'Does the DJI Mini 4 Pro need Remote ID?',
    answer: 'The DJI Mini 4 Pro has built-in Remote ID and the standard version weighs under 250g. For recreational flying in the US, you don\'t need to register or use Remote ID with the standard battery. However, with the Plus (extended) battery, it exceeds 250g and requires registration. For any commercial use, you need Part 107 regardless of weight, which triggers Remote ID requirements.'
  },
  {
    question: 'Can I fly a sub-250g drone commercially without Remote ID?',
    answer: 'No. Commercial operations require Part 107 certification regardless of drone weight. While sub-250g drones are exempt from registration when flown recreationally, Part 107 operations require Remote ID compliance. If your drone has built-in Remote ID, it must be active during commercial flights.'
  },
  {
    question: 'What happens if I add accessories to my sub-250g drone?',
    answer: 'If accessories (like propeller guards, extended batteries, or payloads) push your drone over 250g, you lose the weight exemption. The drone then requires FAA registration and Remote ID compliance. This commonly occurs with DJI Mini series drones when using extended batteries or adding accessories.'
  },
  {
    question: 'Do I need to register a sub-250g drone?',
    answer: 'For purely recreational flying with an unmodified sub-250g drone, FAA registration is not required. However, registration is recommended even when not required—it helps recover lost drones and establishes ownership. Commercial (Part 107) operations require registration regardless of weight.'
  },
  {
    question: 'Is the 250g exemption the same worldwide?',
    answer: 'No. The 250g threshold is specific to FAA regulations in the United States. Other countries have different weight thresholds and requirements. EU regulations have different categories, and some countries require registration for all drones regardless of weight. Always check local regulations when traveling.'
  }
];

const comparisonHeaders = ['Scenario', 'Registration', 'Remote ID', 'Part 107'];
const comparisonRows = [
  ['Recreational, under 250g, unmodified', false, false, false],
  ['Recreational, under 250g, with heavy battery', true, true, false],
  ['Recreational, over 250g', true, true, false],
  ['Commercial, any weight', true, true, true],
  ['Recreational in FRIA, any weight', true, false, false],
];

const tableOfContents = [
  { id: 'quick-answer', title: 'Quick Answer' },
  { id: 'weight-exemption', title: 'The 250g Exemption Explained' },
  { id: 'when-applies', title: 'When the Exemption Applies' },
  { id: 'when-doesnt', title: 'When It Doesn\'t Apply' },
  { id: 'popular-drones', title: 'Popular Sub-250g Drones' },
  { id: 'decision-guide', title: 'Decision Guide' },
  { id: 'faq', title: 'FAQ' }
];

export default function DronesUnder250gRemoteIDPage() {
  return (
    <>
      <SchemaScript schema={generateArticleSchema({
        title: 'Do Drones Under 250g Need Remote ID?',
        description: 'Clear guide on Remote ID requirements for lightweight drones',
        slug: 'drones-under-250g-remote-id',
        publishedTime: '2024-12-15T00:00:00Z',
        modifiedTime: '2024-12-15T00:00:00Z'
      })} />
      <SchemaScript schema={generateFAQSchema(faqs)} />

      <ResourceLayout
        title="Do Drones Under 250g Need Remote ID?"
        subtitle="Clear answers on when the weight exemption applies and when it doesn't"
        breadcrumbs={[{ label: 'Sub-250g Remote ID Rules' }]}
        readingTime={6}
        lastUpdated="December 2024"
        tableOfContents={tableOfContents}
      >
        {/* Featured Snippet Target */}
        <FeaturedSnippet question="Do drones under 250 grams need Remote ID?">
          <p className="mb-4">
            <strong>Short answer: It depends on how you fly.</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Recreational flying, unmodified drone:</strong> No Remote ID required</li>
            <li><strong>Recreational with heavy battery (over 250g):</strong> Remote ID required</li>
            <li><strong>Commercial flying (Part 107):</strong> Remote ID required regardless of weight</li>
            <li><strong>Flying in a FRIA:</strong> No Remote ID required</li>
          </ul>
          <p className="mt-4 text-sm">
            The 250g exemption only applies to purely recreational flying with an unmodified, unregistered drone.
          </p>
        </FeaturedSnippet>

        <section id="quick-answer">
          <h2>The Quick Answer</h2>
          <p>
            This is one of the most confusing topics in drone regulations, so let&apos;s clarify it upfront:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                <h3 className="font-semibold text-slate-900">No Remote ID Needed If:</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li>• Flying purely for fun (recreational)</li>
                <li>• Drone weighs under 250g <em>as flown</em></li>
                <li>• No modifications that add weight</li>
                <li>• Not receiving any compensation</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
                <h3 className="font-semibold text-slate-900">Remote ID IS Needed If:</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li>• Flying commercially (Part 107)</li>
                <li>• Drone exceeds 250g with accessories/battery</li>
                <li>• Your drone has built-in Remote ID (commercial use)</li>
                <li>• You voluntarily registered your drone</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="weight-exemption">
          <h2>The 250g Exemption Explained</h2>
          <p>
            The FAA created a weight-based exemption to reduce the regulatory burden on casual recreational pilots flying small, lightweight drones. Here&apos;s how it works:
          </p>

          <CalloutBox type="info" title="The Legal Basis">
            <p>
              Under <a href="https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-89" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">14 CFR Part 89 <ExternalLink className="inline h-4 w-4" /></a>, Remote ID requirements apply to drones that require FAA registration. Under <a href="https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-48" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">14 CFR Part 48 <ExternalLink className="inline h-4 w-4" /></a>, drones weighing less than 250 grams (0.55 lbs) operated exclusively for recreational purposes are exempt from registration.
            </p>
          </CalloutBox>

          <p className="my-4">
            <strong>The chain of logic is:</strong>
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-600 my-4">
            <li>Remote ID is required for drones that must be registered</li>
            <li>Drones under 250g flown recreationally don&apos;t require registration</li>
            <li>Therefore, these drones don&apos;t require Remote ID</li>
          </ol>

          <p>
            But here&apos;s where it gets tricky: this exemption has several conditions that many pilots overlook.
          </p>
        </section>

        <section id="when-applies">
          <h2>When the 250g Exemption Applies</h2>
          <p>
            All of these conditions must be true for the exemption to apply:
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
                  <span className="text-emerald-600 font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Purely Recreational Purpose</h3>
                  <p className="text-slate-600">
                    You&apos;re flying for fun with no commercial intent. This means:
                  </p>
                  <ul className="mt-2 space-y-1 text-slate-600 text-sm">
                    <li>• Not selling photos or videos</li>
                    <li>• Not flying for a business (even your own)</li>
                    <li>• Not receiving any compensation or business benefit</li>
                    <li>• Not using footage for commercial content</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
                  <span className="text-emerald-600 font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Weight Under 250g As Flown</h3>
                  <p className="text-slate-600">
                    The total weight including everything attached must be under 250g:
                  </p>
                  <ul className="mt-2 space-y-1 text-slate-600 text-sm">
                    <li>• Drone body + battery + propellers</li>
                    <li>• Any accessories (prop guards, lights, etc.)</li>
                    <li>• Extended batteries push many drones over 250g</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
                  <span className="text-emerald-600 font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Not Voluntarily Registered</h3>
                  <p className="text-slate-600">
                    If you voluntarily registered your sub-250g drone with the FAA, you&apos;ve opted into the registration system and Remote ID requirements apply.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="when-doesnt">
          <h2>When the Exemption Does NOT Apply</h2>
          <p>
            Here are the common scenarios where even a sub-250g drone needs Remote ID:
          </p>

          <div className="space-y-4 my-8">
            <CalloutBox type="error" title="Commercial Use (Part 107)">
              <p>
                <strong>Any commercial use requires Part 107 certification</strong>, and Part 107 operations require Remote ID compliance—regardless of drone weight. This includes:
              </p>
              <ul className="mt-2 space-y-1">
                <li>• Real estate photography</li>
                <li>• Content creation for monetized channels</li>
                <li>• Roof inspections</li>
                <li>• Any work where you&apos;re compensated</li>
              </ul>
            </CalloutBox>

            <CalloutBox type="warning" title="Extended Battery Trap">
              <p>
                Many popular &quot;sub-250g&quot; drones have extended battery options that push them over 250g:
              </p>
              <ul className="mt-2 space-y-1">
                <li>• <strong>DJI Mini 4 Pro:</strong> 249g standard, 309g with Plus battery</li>
                <li>• <strong>DJI Mini 3 Pro:</strong> 249g standard, 293g with Plus battery</li>
                <li>• <strong>DJI Mini 3:</strong> Under 250g with either battery</li>
              </ul>
              <p className="mt-2">
                If you fly with the extended battery, you need registration and Remote ID.
              </p>
            </CalloutBox>

            <CalloutBox type="warning" title="Accessories and Modifications">
              <p>
                Adding weight through accessories voids the exemption:
              </p>
              <ul className="mt-2 space-y-1">
                <li>• Propeller guards (~10-15g each)</li>
                <li>• LED lights</li>
                <li>• Strobe beacons</li>
                <li>• Any payload or attachment</li>
              </ul>
            </CalloutBox>
          </div>
        </section>

        <InlineCTA
          title="Track your compliance automatically"
          description="Aeronote monitors your fleet's Remote ID status and alerts you when aircraft or configurations require compliance updates."
          buttonText="Start Free Trial"
          buttonUrl="/auth/signup"
        />

        <section id="popular-drones">
          <h2>Popular Sub-250g Drones: Do They Need Remote ID?</h2>
          <p>
            Here&apos;s a quick reference for common lightweight drones:
          </p>

          <div className="overflow-x-auto my-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-4 font-semibold text-slate-900 border-b border-slate-200">Drone</th>
                  <th className="text-center p-4 font-semibold text-slate-900 border-b border-slate-200">Weight</th>
                  <th className="text-center p-4 font-semibold text-slate-900 border-b border-slate-200">Has Remote ID</th>
                  <th className="text-center p-4 font-semibold text-slate-900 border-b border-slate-200">Rec. Exemption?</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600">DJI Mini 4 Pro (standard battery)</td>
                  <td className="p-4 text-center text-slate-600">249g</td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100 bg-amber-50">
                  <td className="p-4 text-slate-600">DJI Mini 4 Pro (Plus battery)</td>
                  <td className="p-4 text-center text-slate-600">309g</td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><XCircle className="h-5 w-5 text-red-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600">DJI Mini 3</td>
                  <td className="p-4 text-center text-slate-600">248g</td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100 bg-amber-50">
                  <td className="p-4 text-slate-600">DJI Mini 3 Pro (Plus battery)</td>
                  <td className="p-4 text-center text-slate-600">293g</td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><XCircle className="h-5 w-5 text-red-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600">DJI Mini 2 SE</td>
                  <td className="p-4 text-center text-slate-600">246g</td>
                  <td className="p-4 text-center"><XCircle className="h-5 w-5 text-slate-400 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-600">DJI Mini 2</td>
                  <td className="p-4 text-center text-slate-600">249g</td>
                  <td className="p-4 text-center"><XCircle className="h-5 w-5 text-slate-400 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate-500 my-4">
            <strong>Note:</strong> &quot;Rec. Exemption&quot; means eligible for the recreational exemption (no registration or Remote ID required) when flown recreationally. Commercial use always requires Part 107 and Remote ID compliance.
          </p>
        </section>

        <section id="decision-guide">
          <h2>Decision Guide: Do I Need Remote ID?</h2>
          <p>
            Use this flowchart to determine your Remote ID requirements:
          </p>

          <div className="bg-slate-50 rounded-xl p-6 my-8">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="font-semibold text-slate-900 mb-2">Question 1: Are you flying commercially (receiving any compensation)?</p>
                <div className="ml-4 space-y-2">
                  <p className="text-slate-600">→ <strong>Yes:</strong> You need Part 107 + Remote ID required</p>
                  <p className="text-slate-600">→ <strong>No:</strong> Continue to Question 2</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="font-semibold text-slate-900 mb-2">Question 2: Does your drone weigh 250g or more as flown?</p>
                <div className="ml-4 space-y-2">
                  <p className="text-slate-600">→ <strong>Yes:</strong> Registration + Remote ID required</p>
                  <p className="text-slate-600">→ <strong>No:</strong> Continue to Question 3</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="font-semibold text-slate-900 mb-2">Question 3: Did you voluntarily register your drone?</p>
                <div className="ml-4 space-y-2">
                  <p className="text-slate-600">→ <strong>Yes:</strong> Remote ID required</p>
                  <p className="text-slate-600">→ <strong>No:</strong> <span className="text-emerald-600 font-semibold">No Remote ID required!</span></p>
                </div>
              </div>
            </div>
          </div>

          <h3>Requirement Summary</h3>
          <ComparisonTable
            headers={comparisonHeaders}
            rows={comparisonRows}
          />
        </section>

        <section id="faq">
          <FAQSection faqs={faqs} />
        </section>

        <RelatedResources resources={[
          { title: 'What is Remote ID for Drones?', href: '/resources/what-is-remote-id' },
          { title: 'FAA Drone Audit Preparation Checklist', href: '/resources/faa-drone-audit-checklist' },
          { title: 'DJI Flight Data Backup Guide', href: '/resources/dji-flight-data-backup-guide' }
        ]} />
      </ResourceLayout>
    </>
  );
}
