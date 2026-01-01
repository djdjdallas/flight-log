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
  title: 'Film & Media Drone Compliance Guide 2024: Production Regulations',
  description: 'Complete guide to drone regulations for film, television, and media production. Learn about film permits, insurance requirements, crew certifications, and location-specific rules.',
  keywords: ['film production drone regulations', 'drone filming permits', 'media production drone compliance', 'Hollywood drone rules', 'commercial drone cinematography', 'drone filming insurance'],
  publishedTime: '2024-01-20',
  modifiedTime: '2024-12-01',
  slug: 'film-media-drone-compliance',
});

const tocItems = [
  { id: 'film-drone-overview', title: 'Film Drone Operations Overview' },
  { id: 'permits-licensing', title: 'Permits & Licensing Requirements' },
  { id: 'insurance-requirements', title: 'Insurance Requirements' },
  { id: 'crew-certifications', title: 'Crew Certifications' },
  { id: 'location-considerations', title: 'Location Considerations' },
  { id: 'safety-protocols', title: 'On-Set Safety Protocols' },
  { id: 'post-production', title: 'Post-Production Compliance' },
  { id: 'faq', title: 'FAQ' },
];

const faqs = [
  {
    question: 'Do I need a film permit to fly drones for video production?',
    answer: 'Yes, in most jurisdictions. Beyond FAA Part 107 certification, commercial film and video production typically requires local film permits. Major film offices like FilmLA, the NYC Mayor\'s Office of Media and Entertainment, and similar agencies require drone operations to be included in your production permit application. Fees range from $300-1,000+ and processing takes 3-10 business days.',
  },
  {
    question: 'What insurance do I need for drone cinematography?',
    answer: 'Professional drone cinematography requires aviation liability insurance (typically $1-5 million coverage), which is different from standard general liability. Most film permits and production companies require a Certificate of Insurance (COI) naming them as additional insured. Annual policies cost $1,000-3,000 for $1 million coverage. Per-project policies are also available.',
  },
  {
    question: 'Can I fly drones over actors and crew during filming?',
    answer: 'Flying over people requires either a Part 107 waiver (Category 2, 3, or 4 operations) or using a drone that meets specific safety requirements. Category 1 allows small drones (under 0.55 lbs) over people without a waiver. Larger drones need FAA-accepted means of compliance, remote pilot training, and operational restrictions. Most productions use safety protocols that clear areas rather than fly directly over talent.',
  },
  {
    question: 'What are the rules for drone filming in national parks?',
    answer: 'Drone operations are prohibited in all U.S. National Parks under NPS Policy Memorandum 14-05. For major film productions, the NPS may grant Special Use Permits, but these are rarely approved, expensive ($500-5,000+), and require extensive environmental and safety review. Many productions use stock footage or film from outside park boundaries.',
  },
  {
    question: 'Do I need a separate pilot for commercial film drone work?',
    answer: 'The FAA requires at least one certificated Remote Pilot in Command (RPIC) who holds Part 107 certification. For complex operations, productions often hire dedicated drone pilots while the DP or cinematographer directs shots. Many professional drone operators work in two-person teams—one pilot for flight control and one camera operator for the gimbal.',
  },
];

const permitComparisonData = {
  headers: ['Film Office', 'Drone Permit Fee', 'Processing Time', 'Insurance Minimum'],
  rows: [
    ['FilmLA (Los Angeles)', '$730+', '3-5 business days', '$1 million'],
    ['NYC MOME', '$300', '5-10 business days', '$1 million'],
    ['Georgia Film Office', '$0 (state)', '5 business days', '$1 million'],
    ['New Mexico Film Office', '$0 (state)', '3-5 business days', '$1 million'],
    ['Atlanta Mayor\'s Office', '$100+', '10 business days', '$1 million'],
  ],
};

const productionSteps = [
  {
    title: 'Pre-Production Planning',
    description: 'Scout locations and assess airspace restrictions using B4UFLY or Aloft. Identify all required permits 4-6 weeks before shoot dates. Document potential hazards, nearby airports, and restricted areas. Create preliminary shot list with safety considerations.',
  },
  {
    title: 'Permit Applications',
    description: 'Submit film permit applications including drone operations. Apply for FAA authorizations through LAANC or DroneZone. Request any needed Part 107 waivers (allow 90+ days). Coordinate with property owners and local authorities.',
  },
  {
    title: 'Insurance & Contracts',
    description: 'Obtain aviation liability insurance and hull coverage. Get Certificates of Insurance (COIs) for all required parties. Review drone operator contracts for liability allocation. Ensure Workers\' Comp covers aerial operations.',
  },
  {
    title: 'Crew Preparation',
    description: 'Verify Part 107 certification for all pilots. Conduct equipment checks and battery inspections. Brief entire crew on drone safety protocols. Designate visual observers and establish communication procedures.',
  },
  {
    title: 'Day-of-Shoot Protocol',
    description: 'Perform pre-flight checklist and site safety assessment. Establish flight boundaries and no-fly zones on set. Confirm all airspace authorizations are active. Monitor weather conditions and be prepared to stand down if unsafe.',
  },
  {
    title: 'Documentation & Wrap',
    description: 'Log all flights with times, locations, and any incidents. Preserve flight data for compliance records. Document any deviations from planned operations. Complete incident reports if any issues occurred.',
  },
];

const insuranceComparisonData = {
  headers: ['Coverage Type', 'Typical Limit', 'Annual Cost', 'What It Covers'],
  rows: [
    ['Aviation Liability', '$1-5 million', '$1,000-3,000', 'Third-party bodily injury and property damage'],
    ['Hull Coverage', 'Equipment value', '$300-800', 'Physical damage to drone and payload'],
    ['Personal Injury', '$1 million', 'Often included', 'Privacy violations, defamation claims'],
    ['Non-Owned Aviation', '$1 million', '$200-500', 'Liability for rented/borrowed equipment'],
    ['Errors & Omissions', '$1 million', '$500-1,500', 'Professional liability, failed deliverables'],
  ],
};

export default function FilmMediaDroneCompliancePage() {
  const articleSchema = generateArticleSchema({
    title: 'Film & Media Drone Compliance Guide 2024: Production Regulations',
    description: 'Complete guide to drone regulations for film, television, and media production.',
    publishedTime: '2024-01-20',
    modifiedTime: '2024-12-01',
    slug: 'film-media-drone-compliance',
  });

  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <SchemaScript schema={articleSchema} />
      <SchemaScript schema={faqSchema} />

      <ResourceLayout
        title="Film & Media Drone Compliance Guide"
        subtitle="Navigate the complex regulatory landscape of drone cinematography for film, television, and commercial video production."
        readingTime={16}
        lastUpdated="December 2024"
        tableOfContents={tocItems}
      >
        <FeaturedSnippet
          question="What regulations apply to drone filming for commercial production?"
          answer="Commercial drone filming requires: (1) FAA Part 107 Remote Pilot certification, (2) Remote ID compliance for all drones, (3) Local film permits from city/county film offices, (4) Aviation liability insurance ($1-5 million typical), (5) Airspace authorization via LAANC for controlled airspace, and (6) Operations over people waivers if flying above talent/crew. Most major film offices charge $300-730+ for drone-inclusive permits with 3-10 day processing times."
        />

        <section id="film-drone-overview">
          <h2>Film Drone Operations Overview</h2>
          <p>
            Drone cinematography has revolutionized film and video production, enabling shots
            that previously required expensive helicopter rentals or complex crane setups.
            However, commercial film production with drones involves navigating multiple
            regulatory layers that go beyond standard Part 107 operations.
          </p>
          <p>
            Productions must satisfy FAA requirements, state and local film permit regulations,
            union rules (for SAG/IATSE productions), location-specific restrictions, and
            insurance requirements from studios and distributors. Understanding these
            overlapping requirements is essential for legal, insurable productions.
          </p>

          <CalloutBox type="info" title="The Film Production Difference">
            While FAA Part 107 certification allows commercial drone use, film production adds
            complexity: you're often flying in urban areas, near people, on tight schedules,
            and under contracts that specify strict compliance requirements. Productions that
            cut corners on permits risk shut-downs, fines, and liability exposure that can
            exceed the entire production budget.
          </CalloutBox>
        </section>

        <section id="permits-licensing">
          <h2>Permits & Licensing Requirements</h2>

          <h3>FAA Requirements</h3>
          <p>
            All commercial drone operations, including film production, require:
          </p>
          <ul>
            <li><strong>Part 107 certification:</strong> At least one Remote Pilot in Command on set</li>
            <li><strong>Aircraft registration:</strong> All drones must be registered with FAA ($5 for 3 years)</li>
            <li><strong>Remote ID:</strong> Required for all drones as of March 2024</li>
            <li><strong>Airspace authorization:</strong> LAANC or FAA DroneZone approval for controlled airspace</li>
          </ul>

          <h3>Local Film Permits</h3>
          <p>
            Most cities and counties require film permits for commercial production, and drone
            operations must be specifically included. Major film offices have established
            procedures for drone approvals.
          </p>

          <ComparisonTable
            title="Major Film Office Drone Permit Requirements"
            headers={permitComparisonData.headers}
            rows={permitComparisonData.rows}
          />

          <h3>FilmLA Process (Los Angeles)</h3>
          <p>
            Los Angeles hosts more production than any other U.S. city, and FilmLA has detailed
            drone requirements:
          </p>
          <ul>
            <li><strong>Application:</strong> Submit drone operations as part of standard film permit application</li>
            <li><strong>Documentation:</strong> Provide Part 107 certificate, aircraft registration, flight plan</li>
            <li><strong>Insurance:</strong> $1 million minimum aviation liability, FilmLA named as additional insured</li>
            <li><strong>Notification:</strong> LAPD Air Support Division notification required for certain areas</li>
            <li><strong>Timeline:</strong> Minimum 3 business days; complex locations may require more</li>
          </ul>

          <CalloutBox type="warning" title="Permit Lead Times">
            Don't assume drone permits can be obtained at the last minute. While LAANC provides
            near-instant FAA airspace authorization, local film permits typically require 3-10
            business days. For operations needing Part 107 waivers (like flying over people),
            allow 90+ days for FAA review.
          </CalloutBox>

          <h3>Part 107 Waivers for Film Production</h3>
          <p>
            Film productions frequently need waivers from standard Part 107 restrictions:
          </p>
          <ul>
            <li><strong>Operations over people:</strong> For shots over extras, crowds, or talent</li>
            <li><strong>Night operations:</strong> Now largely standard, but some locations have additional restrictions</li>
            <li><strong>Beyond visual line of sight:</strong> For certain tracking shots or large-area coverage</li>
            <li><strong>Multiple aircraft:</strong> For complex sequences requiring multiple drones</li>
          </ul>

          <InlineCTA
            text="Managing permits across multiple production locations?"
            buttonText="Try Aeronote Free"
            href="/signup"
          />
        </section>

        <section id="insurance-requirements">
          <h2>Insurance Requirements</h2>
          <p>
            Insurance is non-negotiable for professional film drone operations. Studios,
            production companies, and film permits all require proof of coverage.
          </p>

          <ComparisonTable
            title="Film Production Drone Insurance Types"
            headers={insuranceComparisonData.headers}
            rows={insuranceComparisonData.rows}
          />

          <h3>Certificate of Insurance (COI) Requirements</h3>
          <p>
            Most productions require COIs that name specific parties as additional insured:
          </p>
          <ul>
            <li>Production company</li>
            <li>Studio or distributor</li>
            <li>Location owners</li>
            <li>Film permit issuing authority</li>
            <li>Equipment rental houses</li>
          </ul>

          <h3>Insurance for Hired Drone Operators</h3>
          <p>
            When hiring outside drone operators, verify their coverage includes:
          </p>
          <ul>
            <li><strong>Adequate limits:</strong> Minimum $1 million, with $5 million preferred for large productions</li>
            <li><strong>Proper classification:</strong> Must be aviation insurance, not general liability</li>
            <li><strong>Payload coverage:</strong> Cinema cameras can cost $100,000+; ensure they're covered</li>
            <li><strong>Worldwide coverage:</strong> If shooting internationally</li>
          </ul>

          <CalloutBox type="info" title="Production Insurance vs. Operator Insurance">
            Productions typically carry their own production insurance, but this rarely covers
            drone operations adequately. Professional drone operators should have their own
            aviation-specific policies. Never assume production insurance will cover a drone
            incident—verify with both your insurer and the production.
          </CalloutBox>
        </section>

        <section id="crew-certifications">
          <h2>Crew Certifications & Qualifications</h2>

          <h3>FAA Certifications</h3>
          <p>
            Every drone operation requires at least one person with these credentials:
          </p>
          <ul>
            <li><strong>Remote Pilot Certificate:</strong> Part 107 certification (initial test + biennial recurrency)</li>
            <li><strong>Current medical:</strong> Under BasicMed or not subject to any disqualifying conditions</li>
            <li><strong>TRUST completion:</strong> For recreational components, though commercial work requires Part 107</li>
          </ul>

          <h3>Professional Drone Operator Qualifications</h3>
          <p>
            Beyond FAA minimums, professional film drone operators typically have:
          </p>
          <ul>
            <li><strong>Cinema experience:</strong> Understanding of shot composition, camera movement, and director communication</li>
            <li><strong>Platform expertise:</strong> Proficiency with professional cinema drones (DJI Inspire 3, Freefly Alta, etc.)</li>
            <li><strong>Gimbal operation:</strong> Ability to operate camera gimbals separately from flight controls</li>
            <li><strong>Safety training:</strong> On-set safety protocols, especially for flying near people</li>
            <li><strong>Portfolio:</strong> Demonstrated experience on professional productions</li>
          </ul>

          <h3>Two-Operator Model</h3>
          <p>
            Professional film drone work often uses a two-person team:
          </p>
          <ul>
            <li><strong>Pilot/RPIC:</strong> Responsible for flight safety, airspace compliance, and aircraft control</li>
            <li><strong>Camera operator:</strong> Controls gimbal and camera, frames shots, coordinates with DP</li>
          </ul>
          <p>
            This division allows each operator to focus on their specialty and improves both
            safety and shot quality. The RPIC always has authority to abort maneuvers for safety.
          </p>

          <h3>Union Considerations</h3>
          <p>
            On union productions (SAG-AFTRA, IATSE), drone operations may involve:
          </p>
          <ul>
            <li><strong>Camera department:</strong> ICG Local 600 may claim jurisdiction over camera operators</li>
            <li><strong>Special effects:</strong> Some productions classify drones under special effects</li>
            <li><strong>Stunts:</strong> Flying near talent may require stunt coordinator involvement</li>
          </ul>
        </section>

        <section id="location-considerations">
          <h2>Location Considerations</h2>

          <h3>Airspace Assessment</h3>
          <p>
            Before selecting drone shoot locations, assess airspace restrictions:
          </p>
          <ul>
            <li><strong>Controlled airspace:</strong> Class B/C/D requires LAANC or manual authorization</li>
            <li><strong>Restricted areas:</strong> Military installations, national security sites</li>
            <li><strong>TFRs:</strong> Temporary flight restrictions for events, VIP movement, emergencies</li>
            <li><strong>Heliports:</strong> Many urban areas have heliport traffic to consider</li>
          </ul>

          <h3>Common Film Location Types</h3>

          <h4>Studio Lots</h4>
          <ul>
            <li>Generally controlled environment with established drone procedures</li>
            <li>May have blanket airspace agreements with FAA</li>
            <li>Studio security protocols apply</li>
            <li>Coordinate with studio aviation coordinator if applicable</li>
          </ul>

          <h4>Practical Locations</h4>
          <ul>
            <li>Require location agreements that include drone operations</li>
            <li>Property owner insurance requirements vary</li>
            <li>Assess for obstacles: power lines, trees, buildings</li>
            <li>Consider impact on neighboring properties</li>
          </ul>

          <h4>Public Property</h4>
          <ul>
            <li>City streets, parks, and public spaces require film permits</li>
            <li>May require police or fire department coordination</li>
            <li>Time restrictions often apply</li>
            <li>Neighborhood notification may be required</li>
          </ul>

          <CalloutBox type="warning" title="National Parks and Federal Lands">
            Drone operations are prohibited in National Parks, National Monuments, and many
            other federal lands. National Forests have varying rules—some allow recreational
            drones but require permits for commercial use. BLM lands generally allow drones
            but may have restrictions in wilderness areas. Always verify before location scouting.
          </CalloutBox>
        </section>

        <section id="safety-protocols">
          <h2>On-Set Safety Protocols</h2>

          <StepGuide
            title="Production Drone Safety Workflow"
            steps={productionSteps}
          />

          <h3>Establishing Flight Zones</h3>
          <p>
            Professional productions establish clear zones for drone operations:
          </p>
          <ul>
            <li><strong>Takeoff/landing zone:</strong> Secure area with limited access, away from crew traffic</li>
            <li><strong>Flight area:</strong> Clearly marked boundaries for drone operations</li>
            <li><strong>Exclusion zones:</strong> Areas where the drone will not fly (near talent without waivers, sensitive equipment)</li>
            <li><strong>Emergency landing zones:</strong> Pre-identified safe areas for unplanned landings</li>
          </ul>

          <h3>Communication Protocols</h3>
          <p>
            Clear communication is essential for safe drone filming:
          </p>
          <ul>
            <li><strong>Radio channel:</strong> Dedicated channel for drone operations</li>
            <li><strong>Standard calls:</strong> "Drone going up," "Drone coming down," "Drone is hot" (recording)</li>
            <li><strong>Emergency commands:</strong> "Abort" or "Land now" must be immediately honored</li>
            <li><strong>AD coordination:</strong> All flights coordinated through 1st AD</li>
          </ul>

          <h3>Weather Considerations</h3>
          <ul>
            <li><strong>Wind limits:</strong> Most cinema drones limited to 15-25 mph winds</li>
            <li><strong>Precipitation:</strong> Rain and snow are typically no-fly conditions</li>
            <li><strong>Temperature:</strong> Battery performance degrades in cold; heat affects motors</li>
            <li><strong>Visibility:</strong> Minimum visibility required for visual line of sight</li>
          </ul>

          <h3>Emergency Procedures</h3>
          <ul>
            <li><strong>Loss of signal:</strong> Pre-programmed return-to-home or hover behavior</li>
            <li><strong>Low battery:</strong> Automatic RTH with crew notification</li>
            <li><strong>Flyaway:</strong> Immediate notification to AD, tracking via GPS</li>
            <li><strong>Injury:</strong> First aid on set, production medic notification</li>
          </ul>
        </section>

        <section id="post-production">
          <h2>Post-Production Compliance</h2>

          <h3>Flight Log Documentation</h3>
          <p>
            Maintain detailed records for every production drone flight:
          </p>
          <ul>
            <li>Date, time, and location of each flight</li>
            <li>Aircraft and battery serial numbers</li>
            <li>Pilot in command name and certificate number</li>
            <li>Airspace authorization references</li>
            <li>Weather conditions at time of flight</li>
            <li>Any incidents, deviations, or safety concerns</li>
            <li>Production and shot references</li>
          </ul>

          <h3>Record Retention</h3>
          <p>
            Keep drone operation records for:
          </p>
          <ul>
            <li><strong>Minimum 2 years:</strong> FAA requirement for commercial flight logs</li>
            <li><strong>Production duration + 7 years:</strong> Typical studio requirement for production records</li>
            <li><strong>Insurance requirements:</strong> Some policies require longer retention</li>
          </ul>

          <CalloutBox type="info" title="Digital Flight Logs">
            Use digital flight logging that captures telemetry data automatically. This provides
            defensible records if questions arise about flight paths, altitudes, or locations
            during production. Aeronote automatically logs this data from your drone's flight
            records.
          </CalloutBox>

          <h3>Deliverables and Compliance Documentation</h3>
          <p>
            Studios and production companies may request:
          </p>
          <ul>
            <li>Copies of all permits and authorizations</li>
            <li>Certificate of insurance copies</li>
            <li>Pilot certification verification</li>
            <li>Flight logs for specific shooting days</li>
            <li>Incident reports (if any occurred)</li>
          </ul>
        </section>

        <section id="faq">
          <h2>Frequently Asked Questions</h2>
          <FAQSection faqs={faqs} />
        </section>

        <RelatedResources
          resources={[
            {
              title: 'Real Estate Drone Compliance',
              description: 'Guidelines for property photography and videography operations.',
              href: '/resources/real-estate-drone-compliance',
            },
            {
              title: 'California Drone Regulations',
              description: 'State and local laws for drone operations in the entertainment capital.',
              href: '/resources/california-drone-regulations',
            },
            {
              title: 'How Long to Keep Drone Flight Logs',
              description: 'Record retention requirements for commercial drone operations.',
              href: '/resources/how-long-keep-drone-flight-logs',
            },
          ]}
        />
      </ResourceLayout>
    </>
  );
}
