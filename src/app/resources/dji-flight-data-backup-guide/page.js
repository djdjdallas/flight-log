import Link from 'next/link';
import { AlertTriangle, Download, Smartphone, Monitor, Upload, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import ResourceLayout from '@/components/resources/ResourceLayout';
import {
  CalloutBox,
  FeaturedSnippet,
  UrgencyBanner,
  StepGuide,
  FAQSection,
  InlineCTA,
  RelatedResources,
  generateResourceMetadata,
  generateHowToSchema,
  generateFAQSchema,
  SchemaScript
} from '@/components/resources';

export const metadata = generateResourceMetadata({
  title: 'How to Backup DJI Flight Data Before November 2025 Deadline',
  description: 'Step-by-step guide to export and backup your DJI flight logs before they\'re deleted. Learn how to download your flight history from DJI Fly, DJI Go 4, and DJI FlightHub.',
  keywords: ['DJI flight log backup', 'DJI flight data download', 'DJI flight history export', 'DJI data deadline November 2025', 'backup drone flight logs'],
  slug: 'dji-flight-data-backup-guide',
  publishedTime: '2024-12-15T00:00:00Z',
  modifiedTime: '2024-12-15T00:00:00Z'
});

const howToSteps = [
  { title: 'Access DJI Account', text: 'Log into your DJI account through the DJI Fly app or web portal' },
  { title: 'Navigate to Flight Records', text: 'Find the Flight Records or Flight History section in settings' },
  { title: 'Select Export Format', text: 'Choose your preferred export format (CSV, TXT, or sync to cloud)' },
  { title: 'Download All Records', text: 'Export all flight records to your device or cloud storage' },
  { title: 'Verify Backup', text: 'Confirm all flights are included and data is readable' }
];

const faqs = [
  {
    question: 'When is the DJI flight data deletion deadline?',
    answer: 'DJI has announced that historical flight data stored on their servers will be removed starting November 7, 2025. All pilots should export their data before this date to preserve their flight history.'
  },
  {
    question: 'What DJI flight data will be deleted?',
    answer: 'Flight records stored on DJI\'s cloud servers including flight paths, telemetry data, takeoff/landing locations, flight duration, and associated timestamps. Locally stored data on your device or SD card will not be affected.'
  },
  {
    question: 'How do I export flight logs from DJI Fly app?',
    answer: 'Open DJI Fly > tap Profile > tap Flight Records > tap the share/export icon > select all flights > choose export format (CSV recommended) > save to your device or share to cloud storage.'
  },
  {
    question: 'Can I import DJI flight data into other apps?',
    answer: 'Yes, most flight logging software including Aeronote accepts DJI flight data exports. Export your data as CSV or TXT format for maximum compatibility. Aeronote can automatically parse DJI flight logs and preserve all your historical data.'
  },
  {
    question: 'What format should I export my DJI flight logs in?',
    answer: 'CSV (Comma Separated Values) is the most versatile format, compatible with spreadsheets and most flight logging software. TXT format preserves raw data but may require parsing. Export in both formats if unsure.'
  }
];

const tableOfContents = [
  { id: 'deadline', title: 'Understanding the Deadline' },
  { id: 'what-youll-lose', title: 'What Data You\'ll Lose' },
  { id: 'backup-dji-fly', title: 'Backup from DJI Fly App' },
  { id: 'backup-dji-go', title: 'Backup from DJI Go 4' },
  { id: 'backup-web', title: 'Backup via Web Portal' },
  { id: 'import-aeronote', title: 'Import into Aeronote' },
  { id: 'faq', title: 'FAQ' }
];

export default function DJIBackupGuidePage() {
  return (
    <>
      <SchemaScript schema={generateHowToSchema({
        title: 'How to Backup DJI Flight Data',
        description: 'Complete guide to exporting DJI flight logs before the November 2025 deadline',
        steps: howToSteps,
        totalTime: 'PT15M'
      })} />
      <SchemaScript schema={generateFAQSchema(faqs)} />

      <ResourceLayout
        title="How to Backup Your DJI Flight Data Before November 2025"
        subtitle="Complete step-by-step guide to export and preserve your flight history before DJI removes cloud-stored data"
        breadcrumbs={[{ label: 'DJI Flight Data Backup Guide' }]}
        readingTime={8}
        lastUpdated="December 2024"
        tableOfContents={tableOfContents}
        urgencyBanner={
          <UrgencyBanner
            deadline="2025-11-07"
            message="DJI will delete cloud-stored flight data. Export now to preserve your records."
          />
        }
      >
        {/* Featured Snippet Target */}
        <FeaturedSnippet question="How do I backup my DJI flight logs before they're deleted?">
          <p className="mb-4">
            To backup DJI flight data before the November 2025 deadline: Open the DJI Fly app, go to Profile → Flight Records, tap the export icon, select all flights, and save as CSV format. You can also export via the DJI web portal at <a href="https://account.dji.com" target="_blank" rel="noopener noreferrer">account.dji.com</a>.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>DJI Fly app: Profile → Flight Records → Export</li>
            <li>DJI Go 4: Me → Flight Records → Share</li>
            <li>Web portal: account.dji.com → Flight History → Download</li>
          </ul>
        </FeaturedSnippet>

        <section id="deadline">
          <h2>Understanding the DJI Data Deadline</h2>
          <p>
            In late 2024, DJI announced significant changes to how they store and manage pilot flight data. Starting <strong>November 7, 2025</strong>, DJI will permanently delete historical flight records stored on their cloud servers. This affects all pilots who have synced their flight data through DJI Fly, DJI Go 4, or DJI FlightHub.
          </p>
          <p>
            This change is part of DJI's updated privacy policy and data retention practices. While the company has not specified the exact reasons, the decision aligns with increasing global data privacy regulations and user data minimization practices.
          </p>

          <CalloutBox type="warning" title="Commercial Pilots: Act Now">
            <p>
              If you fly commercially under Part 107, your flight logs may be required during FAA audits. Losing this data could result in compliance issues, insurance complications, or inability to demonstrate regulatory adherence during inspections.
            </p>
          </CalloutBox>
        </section>

        <section id="what-youll-lose">
          <h2>What Flight Data You&apos;ll Lose</h2>
          <p>
            Understanding exactly what data is at risk helps you prioritize your backup strategy. Here&apos;s a breakdown of what DJI stores and will delete:
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-6 w-6 text-red-500" />
                <h4 className="font-semibold text-slate-900">Data Being Deleted</h4>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li>• Flight paths and GPS tracks</li>
                <li>• Takeoff and landing coordinates</li>
                <li>• Flight duration and timestamps</li>
                <li>• Altitude and speed telemetry</li>
                <li>• Battery usage statistics</li>
                <li>• Cloud-synced flight summaries</li>
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
                <h4 className="font-semibold text-slate-900">Data Not Affected</h4>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li>• Local files on your phone/tablet</li>
                <li>• SD card flight recordings</li>
                <li>• Videos and photos</li>
                <li>• DAT files on aircraft</li>
                <li>• Previously exported backups</li>
                <li>• Third-party app data</li>
              </ul>
            </div>
          </div>

          <CalloutBox type="info" title="Why This Matters for Compliance">
            <p>
              FAA regulations require commercial pilots to maintain flight records. While there&apos;s no mandated retention period, most insurance policies and best practices recommend keeping records for 3-7 years. Your DJI cloud data may be the only comprehensive record of older flights.
            </p>
          </CalloutBox>
        </section>

        <section id="backup-dji-fly">
          <h2>Method 1: Export from DJI Fly App</h2>
          <p>
            The DJI Fly app is used with newer drones including the Mini series, Air series, and Mavic 3. Follow these steps to export your flight records:
          </p>

          <StepGuide steps={[
            {
              title: 'Open DJI Fly and Access Profile',
              content: (
                <p>Launch the DJI Fly app on your mobile device. Tap your profile icon in the top-left corner of the main screen to access your account settings.</p>
              ),
              image: 'DJI Fly home screen with profile icon highlighted'
            },
            {
              title: 'Navigate to Flight Records',
              content: (
                <p>Scroll down and tap &quot;Flight Records&quot; or &quot;Flight History&quot;. You&apos;ll see a list of all synced flights with dates, durations, and locations.</p>
              ),
              image: 'Flight Records section in DJI Fly'
            },
            {
              title: 'Select Flights to Export',
              content: (
                <p>Tap the share/export icon (usually in the top-right corner). Select &quot;Select All&quot; to include your complete flight history, or manually choose specific flights.</p>
              ),
              image: 'Flight selection screen with export options'
            },
            {
              title: 'Choose Export Format and Save',
              content: (
                <>
                  <p className="mb-2">Select your preferred export format:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>CSV</strong> – Best for spreadsheets and importing to other apps (recommended)</li>
                    <li><strong>TXT</strong> – Raw data format, good for archival</li>
                    <li><strong>KML</strong> – For viewing flight paths in Google Earth</li>
                  </ul>
                </>
              ),
              image: 'Export format selection dialog'
            },
            {
              title: 'Verify Your Export',
              content: (
                <p>Open the exported file to confirm all flights are included. Check that dates, durations, and locations are present. We recommend exporting in multiple formats for redundancy.</p>
              )
            }
          ]} />

          <CalloutBox type="success" title="Pro Tip: Enable Auto-Sync First">
            <p>
              Before exporting, ensure all your flights are synced to DJI&apos;s cloud. Go to Settings → Cloud → enable &quot;Auto-sync flight records&quot;. Let it complete syncing, then export for the most complete backup.
            </p>
          </CalloutBox>
        </section>

        <section id="backup-dji-go">
          <h2>Method 2: Export from DJI Go 4 App</h2>
          <p>
            DJI Go 4 is used with older aircraft like the Phantom 4 series, Mavic Pro, and Inspire 2. The export process is slightly different:
          </p>

          <StepGuide steps={[
            {
              title: 'Access the Me Tab',
              content: (
                <p>Open DJI Go 4 and tap the &quot;Me&quot; tab at the bottom of the screen. Ensure you&apos;re logged into your DJI account.</p>
              )
            },
            {
              title: 'Open Flight Records',
              content: (
                <p>Tap &quot;Flight Records&quot; to view your synced flight history. Records are organized by date with flight paths shown on a map.</p>
              )
            },
            {
              title: 'Share Individual or Batch Records',
              content: (
                <p>Tap a flight to view details, then tap &quot;Share&quot; to export. For batch export, use the multi-select option if available, or export flights one by one for older app versions.</p>
              )
            },
            {
              title: 'Save to Files or Cloud',
              content: (
                <p>Choose to save to your device&apos;s Files app, send via email, or upload to cloud storage like Google Drive, Dropbox, or iCloud.</p>
              )
            }
          ]} />

          <CalloutBox type="warning" title="DJI Go 4 Limitations">
            <p>
              The DJI Go 4 app has more limited export options than DJI Fly. If batch export isn&apos;t available, consider using the web portal method below for faster bulk exports.
            </p>
          </CalloutBox>
        </section>

        <section id="backup-web">
          <h2>Method 3: Export via DJI Web Portal</h2>
          <p>
            The web portal offers the fastest way to export large amounts of flight data, especially useful for commercial pilots with hundreds of flights.
          </p>

          <StepGuide steps={[
            {
              title: 'Log into DJI Account Portal',
              content: (
                <p>
                  Visit <a href="https://account.dji.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline inline-flex items-center gap-1">account.dji.com <ExternalLink className="h-4 w-4" /></a> and log in with your DJI account credentials.
                </p>
              )
            },
            {
              title: 'Navigate to Flight History',
              content: (
                <p>Find the &quot;Flight History&quot; or &quot;My Flights&quot; section in your account dashboard. This may be under &quot;My Devices&quot; or &quot;Activity&quot; depending on your region.</p>
              )
            },
            {
              title: 'Download Flight Data',
              content: (
                <p>Use the download or export option to save your complete flight history. The web portal typically offers CSV export with comprehensive data fields.</p>
              )
            },
            {
              title: 'Store Securely',
              content: (
                <p>Save the exported files to multiple locations: local computer, external drive, and cloud storage. This ensures you won&apos;t lose data due to device failure.</p>
              )
            }
          ]} />
        </section>

        <InlineCTA
          title="Never worry about losing flight data again"
          description="Aeronote automatically backs up every flight with real-time sync. Import your DJI history and never lose another record."
          buttonText="Import Your DJI Data"
          buttonUrl="/auth/signup"
        />

        <section id="import-aeronote">
          <h2>Import Your DJI Data into Aeronote</h2>
          <p>
            Once you&apos;ve exported your DJI flight data, importing it into Aeronote ensures your records are permanently preserved, searchable, and ready for compliance reports.
          </p>

          <StepGuide steps={[
            {
              title: 'Create Your Aeronote Account',
              content: (
                <p>
                  <Link href="/auth/signup" className="text-sky-600 hover:underline">Sign up for free</Link> and complete the quick onboarding to set up your pilot profile and aircraft.
                </p>
              )
            },
            {
              title: 'Navigate to Import',
              content: (
                <p>From your dashboard, go to Flights → Import Data. Select &quot;DJI&quot; as your import source.</p>
              )
            },
            {
              title: 'Upload Your Export Files',
              content: (
                <p>Drag and drop your CSV or TXT files, or click to browse. Aeronote automatically parses DJI flight data format and maps it to your flight log.</p>
              )
            },
            {
              title: 'Review and Confirm',
              content: (
                <p>Preview the imported flights, verify the data looks correct, and confirm the import. Your historical flights are now permanently stored and backed up.</p>
              )
            }
          ]} />

          <div className="bg-slate-50 rounded-xl p-6 my-8">
            <h4 className="font-semibold text-slate-900 mb-4">What Aeronote Imports from DJI:</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Flight dates and times
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Duration and distance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  GPS coordinates
                </li>
              </ul>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Max altitude and speed
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Aircraft identification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Battery statistics
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
          { title: 'Flight Log Software vs Spreadsheet Comparison', href: '/resources/drone-flight-log-software-vs-spreadsheet' }
        ]} />
      </ResourceLayout>
    </>
  );
}
