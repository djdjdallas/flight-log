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
  title: 'Land Surveying Drone Compliance Guide 2024: Regulations for Surveyors',
  description: 'Complete regulatory guide for drone surveying and mapping operations. Learn about Part 107 requirements, accuracy standards, state surveying laws, and professional licensing considerations.',
  keywords: ['drone surveying regulations', 'UAV land surveying compliance', 'drone mapping regulations', 'photogrammetry drone laws', 'surveying drone requirements', 'professional surveyor drone'],
  publishedTime: '2024-01-25',
  modifiedTime: '2024-12-01',
  slug: 'land-surveying-drone-compliance',
});

const tocItems = [
  { id: 'surveying-overview', title: 'Drone Surveying Regulations Overview' },
  { id: 'faa-requirements', title: 'FAA Requirements for Surveyors' },
  { id: 'state-licensing', title: 'State Licensing & Surveying Laws' },
  { id: 'accuracy-standards', title: 'Accuracy & Deliverable Standards' },
  { id: 'data-management', title: 'Data Management & Privacy' },
  { id: 'equipment-considerations', title: 'Equipment & Calibration' },
  { id: 'project-documentation', title: 'Project Documentation' },
  { id: 'faq', title: 'FAQ' },
];

const faqs = [
  {
    question: 'Do I need to be a licensed surveyor to fly drones for mapping?',
    answer: 'It depends on the work product. In most states, if you\'re producing a legal survey plat, boundary survey, or certified topographic map for legal or regulatory purposes, the work must be performed under the supervision of a licensed Professional Land Surveyor (PLS). However, creating general aerial maps, orthomosaics for planning purposes, or volumetric calculations for internal use typically doesn\'t require surveyor licensure—only FAA Part 107 certification.',
  },
  {
    question: 'What accuracy standards apply to drone surveys?',
    answer: 'Drone survey accuracy varies by use case. ASPRS standards specify accuracy classes: Class I (1 cm) for high-precision boundary work, Class II (2.5 cm) for topographic mapping, and Class III (5 cm) for planning-level work. Achieving these requires proper ground control points (GCPs), RTK/PPK positioning, and calibrated sensors. For legal surveys, accuracy must meet state-specific minimum standards.',
  },
  {
    question: 'Can drone surveys be used for official property boundary determination?',
    answer: 'Drone data alone cannot establish legal property boundaries. Boundary surveys require a licensed Professional Land Surveyor to research deeds, evaluate evidence, set monuments, and certify the survey. However, drones can support boundary surveys by providing detailed topographic context, locating existing monuments, and documenting improvements. The drone data supplements but doesn\'t replace traditional surveying methods.',
  },
  {
    question: 'What insurance do surveyors need for drone operations?',
    answer: 'Surveyors need both professional liability (E&O) insurance covering survey work and aviation liability insurance covering drone operations. Professional liability ($1-2 million) covers errors in survey products. Aviation liability ($1 million minimum) covers third-party bodily injury and property damage from drone operations. Some clients require $5 million combined coverage. Hull insurance is recommended for expensive mapping drones.',
  },
  {
    question: 'How long should drone survey data be retained?',
    answer: 'Best practice is to retain raw drone data, processing files, and deliverables for at least 10 years—matching typical survey record retention requirements. Many states require licensed surveyors to maintain project records for specific periods (ranging from 5 years to permanently). FAA requires Part 107 flight logs for 2 years minimum. When surveys may affect property rights, indefinite retention is recommended.',
  },
];

const equipmentComparisonData = {
  headers: ['Equipment Type', 'Typical Accuracy', 'Best Use Case', 'Approx. Cost'],
  rows: [
    ['Consumer drone + GCPs', '2-5 cm', 'Planning, volumetrics', '$1,500-3,000'],
    ['Mapping drone + PPK', '1-3 cm', 'Topographic surveys', '$10,000-20,000'],
    ['RTK/PPK drone', '1-2 cm', 'Engineering surveys', '$15,000-30,000'],
    ['LiDAR drone', '2-5 cm vertical', 'Vegetation, terrain', '$50,000-150,000'],
    ['Survey-grade RTK', '<1 cm', 'Boundary support', '$25,000-50,000'],
  ],
};

const workflowSteps = [
  {
    title: 'Project Planning & Site Assessment',
    description: 'Evaluate project scope, accuracy requirements, and deliverables needed. Check airspace restrictions and obtain necessary authorizations. Plan ground control point (GCP) layout based on terrain and project extent. Assess site accessibility and potential hazards.',
  },
  {
    title: 'Ground Control Establishment',
    description: 'Set ground control points using survey-grade GNSS receivers. For high-accuracy work, use a minimum of 5 GCPs distributed throughout the project area. Document GCP coordinates with clear tie to project datum and epoch. Consider check points separate from control for accuracy verification.',
  },
  {
    title: 'Flight Planning & Execution',
    description: 'Plan flight missions with appropriate overlap (70-80% forward, 60-70% side). Set flight altitude based on required ground sample distance (GSD). Execute flights during optimal lighting conditions (avoid harsh shadows). Log all flight parameters, weather conditions, and equipment used.',
  },
  {
    title: 'Data Processing & Quality Control',
    description: 'Process imagery using photogrammetry software (Pix4D, Agisoft, DroneDeploy). Apply GCP constraints and verify accuracy against check points. Review quality reports for reprojection error and point density. Generate required deliverables (orthomosaic, DSM, point cloud, contours).',
  },
  {
    title: 'Deliverable Preparation',
    description: 'Format deliverables according to client specifications and industry standards. Include accuracy statements, methodology descriptions, and data limitations. Apply professional certification/stamp if required by state law. Ensure proper coordinate system, projection, and units are documented.',
  },
  {
    title: 'Project Documentation & Archival',
    description: 'Archive all raw data, processing files, flight logs, and deliverables. Document equipment serial numbers, calibration dates, and software versions. Maintain chain of custody documentation if data may be used legally. Store records according to state retention requirements.',
  },
];

const stateComparisonData = {
  headers: ['Regulation Area', 'Typical Requirement', 'Variation'],
  rows: [
    ['Boundary surveys', 'PLS license required', 'Universal'],
    ['Topographic mapping', 'Varies by purpose', 'Some states require PLS'],
    ['Construction staking', 'Often PLS required', 'Varies by jurisdiction'],
    ['ALTA/NSPS surveys', 'PLS required', 'Universal'],
    ['Volumetric calculations', 'Usually no PLS needed', 'Internal use typically exempt'],
    ['Elevation certificates', 'PLS/PE required', 'NFIP requirements'],
  ],
};

export default function LandSurveyingDroneCompliancePage() {
  const articleSchema = generateArticleSchema({
    title: 'Land Surveying Drone Compliance Guide 2024: Regulations for Surveyors',
    description: 'Complete regulatory guide for drone surveying and mapping operations.',
    publishedTime: '2024-01-25',
    modifiedTime: '2024-12-01',
    slug: 'land-surveying-drone-compliance',
  });

  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <SchemaScript schema={articleSchema} />
      <SchemaScript schema={faqSchema} />

      <ResourceLayout
        title="Land Surveying Drone Compliance Guide"
        subtitle="Navigate the intersection of FAA regulations, state surveying laws, and professional standards for drone-based mapping and surveying operations."
        readingTime={15}
        lastUpdated="December 2024"
        tableOfContents={tocItems}
      >
        <FeaturedSnippet
          question="What regulations apply to drone surveying and mapping?"
          answer="Drone surveying requires: (1) FAA Part 107 Remote Pilot certification for all commercial operations, (2) Remote ID compliance, (3) Professional Land Surveyor (PLS) license when producing legal surveys or boundary plats in most states, (4) Compliance with state-specific surveying laws and minimum standards, (5) Aviation and professional liability insurance, and (6) Adherence to accuracy standards (ASPRS, state standards) appropriate to the survey type. The drone operator may be different from the licensed surveyor, but legal survey products must be supervised and certified by a PLS."
        />

        <section id="surveying-overview">
          <h2>Drone Surveying Regulations Overview</h2>
          <p>
            Drone technology has transformed land surveying, enabling rapid data collection over
            large areas with impressive accuracy. However, surveyors using drones must navigate
            two distinct regulatory frameworks: FAA aviation regulations governing drone
            operations, and state professional licensing laws governing surveying practice.
          </p>
          <p>
            The key question for any drone surveying project is: "Does this work constitute
            the practice of land surveying under state law?" If yes, it must be performed under
            the supervision of a licensed Professional Land Surveyor. If no, it requires only
            FAA Part 107 compliance.
          </p>

          <CalloutBox type="info" title="Two Regulatory Frameworks">
            Drone surveying sits at the intersection of aviation law (FAA jurisdiction) and
            professional practice law (state jurisdiction). A person can be fully compliant
            with FAA regulations while violating state surveying laws—or vice versa. Compliance
            with both frameworks is required for legal drone surveying operations.
          </CalloutBox>
        </section>

        <section id="faa-requirements">
          <h2>FAA Requirements for Surveyors</h2>
          <p>
            All commercial drone operations, including surveying and mapping, must comply with
            FAA Part 107 regulations:
          </p>

          <h3>Part 107 Certification</h3>
          <ul>
            <li><strong>Remote Pilot Certificate:</strong> Required for all commercial drone operations</li>
            <li><strong>Initial test:</strong> 60 multiple-choice questions on regulations, airspace, and weather</li>
            <li><strong>Recurrent training:</strong> Required every 24 calendar months</li>
            <li><strong>Operating under PLS:</strong> The drone pilot doesn't need to be the licensed surveyor, but someone with Part 107 must operate or supervise the drone</li>
          </ul>

          <h3>Operational Requirements</h3>
          <ul>
            <li><strong>Daylight operations:</strong> Civil twilight or later with anti-collision lighting</li>
            <li><strong>Visual line of sight:</strong> Pilot or visual observer must maintain visual contact</li>
            <li><strong>Maximum altitude:</strong> 400 feet AGL, or within 400 feet of a structure</li>
            <li><strong>Airspace authorization:</strong> Required for controlled airspace (Class B, C, D, E surface)</li>
            <li><strong>Weather minimums:</strong> 3 miles visibility, 500 feet below and 2,000 feet horizontal from clouds</li>
          </ul>

          <h3>Common Part 107 Waivers for Surveying</h3>
          <p>
            Large-area surveying projects often require waivers from standard Part 107 restrictions:
          </p>
          <ul>
            <li><strong>Beyond visual line of sight (BVLOS):</strong> For large corridor or area surveys</li>
            <li><strong>Night operations:</strong> Standard rules now allow with proper lighting, but complex sites may need additional consideration</li>
            <li><strong>Operations over people:</strong> For surveys in populated or active work sites</li>
            <li><strong>Altitude waivers:</strong> Above 400 feet for certain mapping applications</li>
          </ul>

          <h3>Remote ID Compliance</h3>
          <p>
            As of March 2024, all drones used for surveying must comply with Remote ID requirements:
          </p>
          <ul>
            <li>Standard Remote ID: Built-in broadcast of identification and location</li>
            <li>Remote ID module: Add-on broadcast device for older drones</li>
            <li>FRIA exception: Only for fixed recreational sites (not applicable to surveying)</li>
          </ul>

          <InlineCTA
            text="Need to track Part 107 compliance and flight logs for your surveying operations?"
            buttonText="Try Aeronote Free"
            href="/signup"
          />
        </section>

        <section id="state-licensing">
          <h2>State Licensing & Surveying Laws</h2>
          <p>
            The critical compliance question for drone surveying is whether the work constitutes
            "the practice of land surveying" under state law. This determines whether a
            Professional Land Surveyor (PLS) license is required.
          </p>

          <h3>What Requires a PLS License</h3>
          <p>
            In virtually all states, the following activities require PLS licensure:
          </p>
          <ul>
            <li><strong>Boundary surveys:</strong> Establishing or reestablishing property lines</li>
            <li><strong>ALTA/NSPS land title surveys:</strong> For real estate transactions and title insurance</li>
            <li><strong>Subdivision plats:</strong> Creating new lots and recording plats</li>
            <li><strong>Legal descriptions:</strong> Writing metes and bounds descriptions</li>
            <li><strong>Monument setting:</strong> Establishing survey markers</li>
            <li><strong>Certified topographic surveys:</strong> When used for legal or regulatory purposes</li>
          </ul>

          <ComparisonTable
            title="Survey Activities and Licensing Requirements"
            headers={stateComparisonData.headers}
            rows={stateComparisonData.rows}
          />

          <h3>What Typically Doesn't Require PLS</h3>
          <ul>
            <li><strong>Planning-level mapping:</strong> General aerial imagery and maps for internal planning</li>
            <li><strong>Volumetric calculations:</strong> Stockpile measurements for inventory (not regulatory)</li>
            <li><strong>Progress photography:</strong> Visual documentation without measurements</li>
            <li><strong>Orthomosaic generation:</strong> For visualization, not legal measurement</li>
            <li><strong>Pre-design site assessment:</strong> General topographic information</li>
          </ul>

          <CalloutBox type="warning" title="State Variation Warning">
            Surveying laws vary significantly by state. Some states have broad definitions of
            surveying practice that capture more drone mapping activities. Others have specific
            exemptions for certain types of mapping work. Always verify requirements with your
            state board of licensure before undertaking drone mapping projects.
          </CalloutBox>

          <h3>Working with Licensed Surveyors</h3>
          <p>
            For work requiring PLS licensure, several arrangements are common:
          </p>
          <ul>
            <li><strong>PLS firm with drone capability:</strong> Licensed survey firm operates their own drones</li>
            <li><strong>Drone operator subcontracting to PLS:</strong> Drone pilot collects data, PLS processes and certifies</li>
            <li><strong>PLS supervising drone pilot:</strong> Drone operator works under direct PLS supervision</li>
          </ul>
          <p>
            In all cases, the licensed surveyor is responsible for the accuracy and certification
            of survey products, regardless of who flew the drone.
          </p>
        </section>

        <section id="accuracy-standards">
          <h2>Accuracy & Deliverable Standards</h2>
          <p>
            Professional surveying requires adherence to accuracy standards that define acceptable
            precision for different types of work.
          </p>

          <h3>ASPRS Accuracy Standards</h3>
          <p>
            The American Society for Photogrammetry and Remote Sensing (ASPRS) publishes
            accuracy standards commonly applied to drone mapping:
          </p>
          <ul>
            <li><strong>Horizontal accuracy:</strong> Measured as RMSEr (radial root mean square error)</li>
            <li><strong>Vertical accuracy:</strong> Measured as RMSEz (vertical root mean square error)</li>
            <li><strong>Accuracy classes:</strong> Multiple classes based on required precision</li>
          </ul>

          <ComparisonTable
            title="Drone Survey Equipment and Accuracy Capabilities"
            headers={equipmentComparisonData.headers}
            rows={equipmentComparisonData.rows}
          />

          <h3>State Minimum Standards</h3>
          <p>
            Many states publish minimum standards for survey accuracy that may exceed ASPRS
            recommendations:
          </p>
          <ul>
            <li><strong>Urban boundary surveys:</strong> Often require sub-centimeter accuracy</li>
            <li><strong>Rural boundary surveys:</strong> May allow 1:10,000 or similar relative accuracy</li>
            <li><strong>Topographic surveys:</strong> Typically specify contour interval accuracy</li>
            <li><strong>Construction surveys:</strong> May require real-time staking accuracy</li>
          </ul>

          <h3>ALTA/NSPS Standards</h3>
          <p>
            ALTA/NSPS Land Title Surveys (the most common survey for real estate transactions)
            have specific accuracy requirements:
          </p>
          <ul>
            <li><strong>Relative positional precision:</strong> 0.07 feet (2 cm) plus 50 ppm</li>
            <li><strong>For a 1,000-foot boundary:</strong> Maximum allowable error of approximately 0.12 feet</li>
            <li><strong>Drone role:</strong> Can supplement but generally cannot replace traditional methods for boundary determination</li>
          </ul>

          <CalloutBox type="info" title="Accuracy vs. Precision">
            Drones can achieve impressive precision (repeatability), but accuracy (correctness
            relative to true position) depends on proper ground control and processing. Without
            adequate GCPs or RTK/PPK positioning, visually impressive maps may have significant
            positional errors. Always verify accuracy against independent check points.
          </CalloutBox>
        </section>

        <section id="data-management">
          <h2>Data Management & Privacy</h2>

          <h3>Data Ownership and Rights</h3>
          <p>
            Drone survey data ownership should be clearly established in contracts:
          </p>
          <ul>
            <li><strong>Raw data:</strong> Typically retained by surveyor unless contract specifies otherwise</li>
            <li><strong>Processed deliverables:</strong> Usually client property upon payment</li>
            <li><strong>Reuse rights:</strong> Define whether surveyor can use data for portfolio, training, etc.</li>
            <li><strong>Third-party sharing:</strong> Restrictions on sharing with other parties</li>
          </ul>

          <h3>Privacy Considerations</h3>
          <p>
            Surveying drones inevitably capture images of neighboring properties and may record
            people. Privacy best practices include:
          </p>
          <ul>
            <li><strong>Mission focus:</strong> Limit flight areas to project extent plus reasonable buffer</li>
            <li><strong>Data handling:</strong> Process only needed imagery, don't retain unnecessary captures</li>
            <li><strong>Neighbor notification:</strong> Consider notifying adjacent property owners</li>
            <li><strong>Image blurring:</strong> Blur identifiable people or sensitive features in deliverables</li>
            <li><strong>State privacy laws:</strong> Comply with applicable state drone privacy laws</li>
          </ul>

          <h3>Data Security</h3>
          <p>
            Survey data often contains sensitive information about property and infrastructure:
          </p>
          <ul>
            <li><strong>Encryption:</strong> Encrypt stored data, especially on portable devices</li>
            <li><strong>Access controls:</strong> Limit access to project data on need-to-know basis</li>
            <li><strong>Secure transfer:</strong> Use secure methods for delivering data to clients</li>
            <li><strong>Cloud storage:</strong> Evaluate security of cloud processing and storage services</li>
            <li><strong>Retention policies:</strong> Define how long data is retained and how it's destroyed</li>
          </ul>
        </section>

        <section id="equipment-considerations">
          <h2>Equipment & Calibration</h2>

          <h3>Drone Selection for Surveying</h3>
          <p>
            Survey accuracy requirements drive equipment selection:
          </p>
          <ul>
            <li><strong>Planning-level work (5+ cm):</strong> Consumer drones with adequate camera resolution</li>
            <li><strong>Engineering surveys (2-5 cm):</strong> Mapping-specific drones with PPK capability</li>
            <li><strong>High-precision surveys (&lt;2 cm):</strong> RTK-enabled drones with survey-grade GNSS</li>
            <li><strong>Terrain with vegetation:</strong> Consider LiDAR-equipped systems</li>
          </ul>

          <h3>Camera and Sensor Calibration</h3>
          <p>
            Proper calibration is essential for survey-grade accuracy:
          </p>
          <ul>
            <li><strong>Factory calibration:</strong> Most mapping cameras come pre-calibrated</li>
            <li><strong>Self-calibration:</strong> Photogrammetry software can refine camera parameters</li>
            <li><strong>Periodic verification:</strong> Check calibration against known control periodically</li>
            <li><strong>Documentation:</strong> Record calibration dates and parameters used</li>
          </ul>

          <h3>GNSS Equipment</h3>
          <p>
            Ground control and drone positioning require reliable GNSS:
          </p>
          <ul>
            <li><strong>Survey-grade receivers:</strong> For establishing ground control points</li>
            <li><strong>RTK base stations:</strong> For real-time drone positioning</li>
            <li><strong>PPK processing:</strong> Post-processing for areas without RTK coverage</li>
            <li><strong>CORS networks:</strong> State and commercial reference station networks</li>
          </ul>
        </section>

        <section id="project-documentation">
          <h2>Project Documentation</h2>

          <StepGuide
            title="Survey Drone Workflow"
            steps={workflowSteps}
          />

          <h3>Essential Documentation</h3>
          <p>
            Maintain thorough records for every survey project:
          </p>
          <ul>
            <li><strong>Project scope:</strong> Client requirements, accuracy specifications, deliverables</li>
            <li><strong>Flight logs:</strong> Date, time, location, equipment, weather, pilot</li>
            <li><strong>Control documentation:</strong> GCP coordinates, datums, equipment, methodology</li>
            <li><strong>Processing records:</strong> Software, settings, quality metrics, accuracy results</li>
            <li><strong>Deliverable metadata:</strong> Coordinate system, projection, accuracy statements</li>
            <li><strong>Certification:</strong> PLS stamp/seal where required</li>
          </ul>

          <h3>Quality Assurance</h3>
          <p>
            Implement QA procedures appropriate to project requirements:
          </p>
          <ul>
            <li><strong>Independent check points:</strong> Verify accuracy against points not used as control</li>
            <li><strong>Point density analysis:</strong> Ensure adequate coverage throughout project</li>
            <li><strong>Overlap verification:</strong> Confirm flight overlap met specifications</li>
            <li><strong>Processing quality reports:</strong> Review and document quality metrics</li>
            <li><strong>Field verification:</strong> Spot-check deliverables against physical features</li>
          </ul>

          <CalloutBox type="info" title="Professional Liability Considerations">
            Detailed documentation protects surveyors if questions arise about project accuracy
            or methodology. Records demonstrating proper procedures, equipment calibration, and
            quality control can be critical in defending against professional liability claims.
            Aeronote helps maintain compliant flight logs automatically.
          </CalloutBox>
        </section>

        <section id="faq">
          <h2>Frequently Asked Questions</h2>
          <FAQSection faqs={faqs} />
        </section>

        <RelatedResources
          resources={[
            {
              title: 'Construction Drone Compliance',
              description: 'Regulations for drone operations on construction sites.',
              href: '/resources/construction-drone-compliance',
            },
            {
              title: 'How Long to Keep Drone Flight Logs',
              description: 'Record retention requirements for professional drone operations.',
              href: '/resources/how-long-keep-drone-flight-logs',
            },
            {
              title: 'FAA Drone Audit Checklist',
              description: 'Ensure your surveying operations meet all FAA requirements.',
              href: '/resources/faa-drone-audit-checklist',
            },
          ]}
        />
      </ResourceLayout>
    </>
  );
}
