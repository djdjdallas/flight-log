import {
  ResourceLayout,
  FeaturedSnippet,
  CalloutBox,
  FAQSection,
  ComparisonTable,
  InlineCTA,
  StepGuide,
  RelatedResources,
  generateResourceMetadata,
  generateArticleSchema,
  generateFAQSchema,
  SchemaScript,
} from '@/components/resources';

export const metadata = generateResourceMetadata({
  title: 'California Drone Regulations 2024: Complete State & Local Laws Guide',
  description: 'Navigate California drone laws including state regulations, city ordinances, restricted areas, and permit requirements. Updated guide for commercial and recreational pilots.',
  keywords: ['California drone regulations', 'CA drone laws', 'California drone permits', 'LA drone rules', 'San Francisco drone laws', 'California commercial drone', 'state drone regulations'],
  publishedTime: '2024-01-15',
  modifiedTime: '2024-12-01',
  slug: 'california-drone-regulations',
});

const tocItems = [
  { id: 'california-overview', title: 'California Drone Law Overview' },
  { id: 'state-regulations', title: 'State-Level Regulations' },
  { id: 'major-cities', title: 'Major City Ordinances' },
  { id: 'restricted-areas', title: 'Restricted & Sensitive Areas' },
  { id: 'permits-waivers', title: 'Permits & Waivers' },
  { id: 'enforcement', title: 'Enforcement & Penalties' },
  { id: 'faq', title: 'FAQ' },
];

const faqs = [
  {
    question: 'Can I fly a drone at California state parks?',
    answer: 'Drone flights are prohibited at California State Parks unless you obtain a Special Activity Permit from the park superintendent. Permits are typically granted for commercial film production, scientific research, or search and rescue operations. The application process takes 2-4 weeks and requires proof of FAA certification and liability insurance.',
  },
  {
    question: 'Do I need a permit to fly drones commercially in California?',
    answer: 'At the state level, California does not require a separate commercial drone permit beyond FAA Part 107 certification. However, many cities including Los Angeles, San Francisco, and San Diego have their own permit requirements for commercial operations. Always check local ordinances before flying commercially.',
  },
  {
    question: 'Are there special drone rules near California wildfires?',
    answer: 'Yes. Flying drones near active wildfires is a federal crime in California. The TFRs (Temporary Flight Restrictions) around wildfires extend to all aircraft including drones. Penalties include up to $20,000 in fines and imprisonment. Firefighting aircraft have been grounded due to drone interference, which is why California enforces this strictly.',
  },
  {
    question: 'Can I fly my drone at California beaches?',
    answer: 'It depends on the specific beach. State beaches generally prohibit drones without permits. City-operated beaches vary—some allow recreational flying during off-peak hours, while others ban drones entirely. Los Angeles County beaches prohibit drone takeoff and landing. Always check with the specific beach\'s managing authority.',
  },
  {
    question: 'What are the privacy laws for drones in California?',
    answer: 'California Civil Code 1708.8 makes it illegal to capture images of people on private property using drones without consent if the images are "in a manner that is offensive to a reasonable person." Additionally, California Penal Code 402 prohibits recording through windows or doors. Violators can face civil liability and criminal charges.',
  },
];

const cityComparisonData = {
  headers: ['City', 'Permit Required', 'Park Flying', 'Beach Flying', 'Night Ops'],
  rows: [
    ['Los Angeles', 'Commercial only', 'Prohibited', 'Prohibited', 'FAA rules apply'],
    ['San Francisco', 'All flights', 'Prohibited', 'Limited areas', 'Permit required'],
    ['San Diego', 'Commercial only', 'Designated areas', 'Some allowed', 'FAA rules apply'],
    ['San Jose', 'Commercial only', 'Model aircraft fields', 'N/A', 'FAA rules apply'],
    ['Sacramento', 'Limited', 'Designated parks', 'N/A', 'FAA rules apply'],
  ],
};

const permitSteps = [
  {
    title: 'Determine Jurisdiction',
    description: 'Identify whether your flight location falls under state, county, city, or federal jurisdiction. National parks, military bases, and airports have federal oversight, while state parks and local areas have their own rules.',
  },
  {
    title: 'Check Local Ordinances',
    description: 'Visit the city or county website for drone-specific ordinances. Many California cities have enacted regulations beyond FAA requirements. Look for municipal code sections on unmanned aircraft or model aircraft.',
  },
  {
    title: 'Submit Permit Applications',
    description: 'Apply for required permits well in advance. State park permits need 2-4 weeks, film permits need 3-5 business days, and some city permits can take up to 30 days. Include proof of FAA certification and insurance.',
  },
  {
    title: 'Obtain Insurance',
    description: 'Many California jurisdictions require liability insurance ($1-2 million) for commercial operations. Even when not required, insurance is highly recommended given California\'s strict privacy and trespass laws.',
  },
  {
    title: 'Coordinate with Authorities',
    description: 'For operations in congested areas or near sensitive sites, coordinate with local law enforcement or fire departments. Some cities require notification 24-48 hours before commercial flights.',
  },
];

export default function CaliforniaDroneRegulationsPage() {
  const articleSchema = generateArticleSchema({
    title: 'California Drone Regulations 2024: Complete State & Local Laws Guide',
    description: 'Navigate California drone laws including state regulations, city ordinances, restricted areas, and permit requirements.',
    publishedTime: '2024-01-15',
    modifiedTime: '2024-12-01',
    slug: 'california-drone-regulations',
  });

  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <SchemaScript schema={articleSchema} />
      <SchemaScript schema={faqSchema} />

      <ResourceLayout
        title="California Drone Regulations 2024"
        subtitle="Your complete guide to navigating California's complex web of state laws, city ordinances, and restricted airspace for drone operations."
        readingTime={14}
        lastUpdated="December 2024"
        tableOfContents={tocItems}
      >
        <FeaturedSnippet
          question="What are the main California drone regulations?"
          answer="California requires compliance with FAA rules plus state-specific laws: Civil Code 1708.8 (privacy), Penal Code 402 (unlawful recording), and Government Code 853 (emergency response interference). Drones are banned at state parks without permits. Most major cities have additional ordinances requiring permits for commercial use. Flying near wildfires is a federal crime with up to $20,000 in fines."
        />

        <section id="california-overview">
          <h2>California Drone Law Overview</h2>
          <p>
            California has one of the most complex drone regulatory environments in the United
            States. Beyond federal FAA regulations, drone operators must navigate state laws
            addressing privacy, emergency response, and trespass, plus a patchwork of local
            ordinances that vary significantly between cities and counties.
          </p>
          <p>
            The state's large population, extensive wildfire risk, numerous filming locations,
            and high-value real estate have driven stricter regulations than most other states.
            Understanding these layered requirements is essential for both recreational and
            commercial drone pilots operating in California.
          </p>

          <CalloutBox type="warning" title="California's Three-Layer System">
            Drone operations in California must comply with: (1) Federal FAA regulations including
            Part 107 for commercial use and Remote ID requirements, (2) California state laws on
            privacy, emergencies, and critical infrastructure, and (3) Local city/county ordinances
            that may impose additional restrictions or permit requirements.
          </CalloutBox>
        </section>

        <section id="state-regulations">
          <h2>California State-Level Regulations</h2>

          <h3>Privacy Laws (Civil Code 1708.8)</h3>
          <p>
            California's privacy laws are among the strictest for drone operators. Civil Code
            Section 1708.8 creates civil liability for anyone who uses a drone to capture
            images or recordings of a person engaging in personal or familial activities on
            private property, if done in a manner offensive to a reasonable person.
          </p>
          <p>
            Key provisions include:
          </p>
          <ul>
            <li><strong>Physical invasion:</strong> Entering airspace above private property to capture images without consent</li>
            <li><strong>Constructive invasion:</strong> Using telephoto or zoom capabilities to capture images that couldn't be seen without enhancement</li>
            <li><strong>Liability extends to:</strong> Both the drone operator and anyone who commissioned or paid for the images</li>
            <li><strong>Damages:</strong> Victims can recover actual damages, disgorgement of profits, and punitive damages up to three times actual damages</li>
          </ul>

          <h3>Unlawful Recording (Penal Code 402)</h3>
          <p>
            Beyond civil liability, California Penal Code 402 makes it a criminal offense to
            use any device to look through a window or door of an inhabited structure with
            the intent to invade privacy. This applies directly to drones equipped with cameras.
          </p>

          <h3>Emergency Response Interference</h3>
          <p>
            California Government Code Section 853 prohibits operating drones that interfere
            with emergency response operations, including:
          </p>
          <ul>
            <li>Firefighting aircraft and ground crews</li>
            <li>Law enforcement operations</li>
            <li>Search and rescue missions</li>
            <li>Medical emergency response</li>
          </ul>

          <CalloutBox type="error" title="Wildfire TFR Violations">
            Flying near California wildfires can result in federal criminal charges, up to $20,000
            in FAA civil penalties, and potential liability for firefighting delays. When aircraft
            are grounded due to drones, firefighting efforts can be delayed by hours, allowing
            fires to spread and potentially causing deaths and property destruction.
          </CalloutBox>

          <h3>State Parks and Beaches</h3>
          <p>
            The California Department of Parks and Recreation prohibits drone operations at all
            280+ state parks, beaches, and recreation areas without a Special Activity Permit.
            This includes popular destinations like:
          </p>
          <ul>
            <li>Anza-Borrego Desert State Park</li>
            <li>Point Lobos State Natural Reserve</li>
            <li>Crystal Cove State Park</li>
            <li>Pfeiffer Big Sur State Park</li>
            <li>All California state beaches</li>
          </ul>
        </section>

        <section id="major-cities">
          <h2>Major City Drone Ordinances</h2>
          <p>
            California's largest cities have enacted their own drone regulations that often
            exceed state and federal requirements. Here's what you need to know for the
            state's most populous metropolitan areas.
          </p>

          <ComparisonTable
            title="California City Drone Regulations Comparison"
            headers={cityComparisonData.headers}
            rows={cityComparisonData.rows}
          />

          <h3>Los Angeles</h3>
          <p>
            Los Angeles Municipal Code Section 56.31 regulates drone operations within city limits:
          </p>
          <ul>
            <li><strong>Parks:</strong> Drones prohibited at all LA city parks without Department of Recreation and Parks permit</li>
            <li><strong>Beaches:</strong> No takeoff or landing at LA County beaches</li>
            <li><strong>Film permits:</strong> Commercial drone filming requires FilmLA permit ($730+ application fee)</li>
            <li><strong>Helicopter routes:</strong> Significant restrictions near LAX and Hollywood tour routes</li>
          </ul>

          <h3>San Francisco</h3>
          <p>
            San Francisco has some of the strictest drone regulations in California:
          </p>
          <ul>
            <li><strong>All drone flights:</strong> Require registration with SF Recreation and Parks Department</li>
            <li><strong>Parks:</strong> Prohibited at all city parks, including Golden Gate Park</li>
            <li><strong>Commercial:</strong> Requires city business license plus film permit for any commercial use</li>
            <li><strong>SFO proximity:</strong> Much of the city falls within SFO's controlled airspace</li>
          </ul>

          <h3>San Diego</h3>
          <p>
            San Diego Municipal Code Chapter 5, Article 9, Division 5 governs drone operations:
          </p>
          <ul>
            <li><strong>Parks:</strong> Allowed only at designated model aircraft areas</li>
            <li><strong>Beaches:</strong> Generally permitted with restrictions on crowds</li>
            <li><strong>Commercial:</strong> Requires business tax certificate</li>
            <li><strong>Border proximity:</strong> Additional federal restrictions near US-Mexico border</li>
          </ul>

          <InlineCTA
            text="Managing flights across California's different jurisdictions?"
            buttonText="Try Aeronote Free"
            href="/signup"
          />
        </section>

        <section id="restricted-areas">
          <h2>Restricted & Sensitive Areas</h2>
          <p>
            California contains numerous restricted and sensitive areas where drone flights
            are either prohibited or require special authorization.
          </p>

          <h3>National Parks</h3>
          <p>
            All nine California National Parks prohibit drone operations under NPS Policy Memorandum 14-05:
          </p>
          <ul>
            <li>Yosemite National Park</li>
            <li>Joshua Tree National Park</li>
            <li>Death Valley National Park</li>
            <li>Sequoia & Kings Canyon National Parks</li>
            <li>Redwood National Park</li>
            <li>Channel Islands National Park</li>
            <li>Pinnacles National Park</li>
            <li>Lassen Volcanic National Park</li>
          </ul>

          <h3>Military Installations</h3>
          <p>
            California hosts numerous military bases with permanent flight restrictions:
          </p>
          <ul>
            <li><strong>Camp Pendleton:</strong> Large restricted area in San Diego County</li>
            <li><strong>Edwards Air Force Base:</strong> Extensive restricted airspace in Mojave Desert</li>
            <li><strong>Naval Base San Diego:</strong> Restricted harbor and surrounding areas</li>
            <li><strong>Vandenberg Space Force Base:</strong> Launch-related TFRs frequently active</li>
            <li><strong>China Lake:</strong> Large restricted zone in Kern and San Bernardino counties</li>
          </ul>

          <h3>Critical Infrastructure</h3>
          <p>
            California law provides additional protection for critical infrastructure beyond
            federal requirements:
          </p>
          <ul>
            <li>Power plants and electrical substations</li>
            <li>Water treatment facilities and reservoirs</li>
            <li>Oil refineries and storage facilities</li>
            <li>Ports of Los Angeles and Long Beach</li>
            <li>Major bridges (Golden Gate, Bay Bridge)</li>
          </ul>

          <CalloutBox type="info" title="LAANC Availability">
            California has extensive LAANC (Low Altitude Authorization and Notification Capability)
            coverage at major airports including LAX, SFO, SAN, SJC, and OAK. Use LAANC through
            approved apps to get near-real-time authorization for controlled airspace operations
            where available.
          </CalloutBox>
        </section>

        <section id="permits-waivers">
          <h2>Permits & Waivers</h2>
          <p>
            Operating legally in California often requires obtaining permits from multiple
            agencies. Here's a systematic approach to navigating the permit process.
          </p>

          <StepGuide
            title="California Drone Permit Process"
            steps={permitSteps}
          />

          <h3>Common Permit Types</h3>

          <h4>State Parks Special Activity Permit</h4>
          <ul>
            <li><strong>Authority:</strong> California Department of Parks and Recreation</li>
            <li><strong>Timeline:</strong> 2-4 weeks processing</li>
            <li><strong>Requirements:</strong> FAA certification, liability insurance, detailed flight plan</li>
            <li><strong>Fees:</strong> $150-500 depending on scope</li>
          </ul>

          <h4>Film Permits (FilmLA)</h4>
          <ul>
            <li><strong>Coverage:</strong> Los Angeles city and county</li>
            <li><strong>Timeline:</strong> 3-5 business days minimum</li>
            <li><strong>Requirements:</strong> Insurance certificate, location agreements, FAA authorization</li>
            <li><strong>Fees:</strong> $730 application + daily fees + security deposits</li>
          </ul>

          <h4>FAA Part 107 Waivers</h4>
          <p>
            Common waivers requested for California operations include:
          </p>
          <ul>
            <li><strong>Night operations:</strong> Now standard under updated Part 107, but some local permits still reference this</li>
            <li><strong>Operations over people:</strong> Required for events, crowds, and urban filming</li>
            <li><strong>Beyond visual line of sight:</strong> For infrastructure inspection and agricultural operations</li>
            <li><strong>Altitude waivers:</strong> Above 400 feet for building inspection or aerial mapping</li>
          </ul>
        </section>

        <section id="enforcement">
          <h2>Enforcement & Penalties</h2>
          <p>
            California actively enforces drone regulations through multiple agencies, and
            penalties can be severe.
          </p>

          <h3>Enforcement Agencies</h3>
          <ul>
            <li><strong>FAA:</strong> Federal violations, airspace incursions, Remote ID violations</li>
            <li><strong>California Highway Patrol:</strong> State law violations, emergency interference</li>
            <li><strong>Local police:</strong> City ordinance violations, privacy complaints</li>
            <li><strong>Park rangers:</strong> State and national park violations</li>
          </ul>

          <h3>Penalty Structure</h3>
          <ComparisonTable
            title="California Drone Violation Penalties"
            headers={['Violation Type', 'Civil Penalty', 'Criminal Penalty']}
            rows={[
              ['Privacy invasion (Civil Code 1708.8)', 'Up to 3x actual damages', 'N/A'],
              ['Unlawful recording (PC 402)', '$1,000 fine', 'Up to 6 months jail'],
              ['State park violation', 'Up to $1,000', 'Possible misdemeanor'],
              ['Emergency interference', 'Up to $5,000', 'Up to 1 year jail'],
              ['Wildfire TFR violation', 'Up to $20,000 (FAA)', 'Federal criminal charges'],
              ['City ordinance violation', 'Varies by city', 'Usually infraction'],
            ]}
          />

          <CalloutBox type="warning" title="Documentation is Critical">
            With California's strict liability laws and active enforcement, maintaining detailed
            flight logs is essential for demonstrating compliance. If challenged, you'll need to
            prove you had proper authorization, followed all applicable rules, and didn't violate
            privacy laws.
          </CalloutBox>
        </section>

        <section id="faq">
          <h2>Frequently Asked Questions</h2>
          <FAQSection faqs={faqs} />
        </section>

        <RelatedResources
          resources={[
            {
              title: 'FAA Drone Audit Checklist',
              description: 'Ensure compliance with federal requirements that apply throughout California.',
              href: '/resources/faa-drone-audit-checklist',
            },
            {
              title: 'Real Estate Drone Compliance',
              description: 'Guidelines for property photography in California\'s competitive real estate market.',
              href: '/resources/real-estate-drone-compliance',
            },
            {
              title: 'What is Remote ID?',
              description: 'Understand the federal Remote ID requirements now in effect across California.',
              href: '/resources/what-is-remote-id',
            },
          ]}
        />
      </ResourceLayout>
    </>
  );
}
