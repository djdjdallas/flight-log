// Re-export all resource components for easy imports
export {
  CalloutBox,
  FeaturedSnippet,
  UrgencyBanner,
  DownloadCard,
  ComparisonTable,
  FAQSection,
  InlineCTA,
  BottomCTA,
  TableOfContents,
  Breadcrumbs,
  StepGuide,
  WeeklyBreakdown,
  RelatedResources
} from './ContentComponents';

export {
  generateResourceMetadata,
  generateArticleSchema,
  generateHowToSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  SchemaScript
} from './ResourceHead';

export { default as ResourceLayout, ResourcesHeader, ResourcesFooter } from './ResourceLayout';
