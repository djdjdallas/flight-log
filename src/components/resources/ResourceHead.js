// SEO metadata generator for resource pages
// Usage: Export metadata object from page.js using generateResourceMetadata()

export function generateResourceMetadata({
  title,
  description,
  keywords = [],
  publishedTime,
  modifiedTime,
  slug,
  type = 'article', // article, howto, faq
  image = '/og-default.png'
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aeronote.app';
  const fullUrl = `${baseUrl}/resources/${slug}`;
  const fullTitle = `${title} | Aeronote`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Aeronote Team' }],
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: 'Aeronote',
      type: 'article',
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image]
    },
    alternates: {
      canonical: fullUrl
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

// Schema.org structured data generators
export function generateArticleSchema({
  title,
  description,
  slug,
  publishedTime,
  modifiedTime,
  image
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aeronote.app';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image || `${baseUrl}/og-default.png`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Organization',
      name: 'Aeronote',
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aeronote',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/resources/${slug}`
    }
  };
}

export function generateHowToSchema({
  title,
  description,
  steps,
  totalTime, // ISO 8601 duration e.g., "PT30M" for 30 minutes
  image
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aeronote.app';

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    image: image || `${baseUrl}/og-default.png`,
    totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.text,
      image: step.image
    }))
  };
}

export function generateFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// JSON-LD Script component for embedding schema
export function SchemaScript({ schema }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb schema generator
export function generateBreadcrumbSchema(items) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aeronote.app';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Resources',
        item: `${baseUrl}/resources`
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 3,
        name: item.label,
        item: item.href ? `${baseUrl}${item.href}` : undefined
      }))
    ]
  };
}
