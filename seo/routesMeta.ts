import { SITE_URL } from './siteUrl.ts'

export interface RouteMeta {
  path: string
  canonical: string
  title: string
  description: string
  ogType: 'website' | 'article'
  ogImage: string
  twitterCard: 'summary_large_image' | 'summary'
  robots: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  jsonLd: Record<string, unknown> | Array<Record<string, unknown>>
  seoBody?: string
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Synergy Brix',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: DEFAULT_OG_IMAGE,
  },
  description:
    'Synergy Brix is a technology and software development company building custom web applications, software solutions, AI-powered tools, business automation, and scalable digital products.',
  sameAs: [
    'https://www.linkedin.com/in/synergy-brix-721726433/',
    'https://www.instagram.com/synergy.brix',
    'https://wa.me/917972415528',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-79724-15528',
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Gonsalves Property, Near Alphonso Church, Behind Stella Petrol Pump',
    addressLocality: 'Vasai West',
    addressRegion: 'Maharashtra',
    postalCode: '401202',
    addressCountry: 'India',
  },
}

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Synergy Brix',
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
}

function makeBreadcrumbs(items: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const entry: Record<string, unknown> = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      }
      if (item.path) {
        entry.item = item.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${item.path}`
      }
      return entry
    }),
  }
}

export function getAllRoutesMeta(): RouteMeta[] {
  return [
    // 1. Home
    {
      path: '/',
      canonical: `${SITE_URL}/`,
      title: 'Synergy Brix | Software Development & Technology Solutions',
      description:
        'Synergy Brix is a technology and software development company building custom web applications, software solutions, AI-powered tools, business automation, and scalable digital products.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'weekly',
      priority: 1.0,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
      },
    },

    // 2. Services Index
    {
      path: '/services',
      canonical: `${SITE_URL}/services`,
      title: 'Software Development & Technology Services | Synergy Brix',
      description:
        'Discover Synergy Brix services including custom software development, web applications, APIs, business automation, dashboards, SaaS platforms, cloud architecture, and databases.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'weekly',
      priority: 0.9,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'Services' }]),
          {
            '@type': 'Service',
            name: 'Software Development Services',
            provider: { '@id': `${SITE_URL}/#organization` },
            description:
              'Comprehensive software engineering, web application development, automation, and cloud solutions.',
            url: `${SITE_URL}/services`,
          },
        ],
      },
    },

    // 3. Service Detail: Custom Software
    {
      path: '/services/custom-software-development',
      canonical: `${SITE_URL}/services/custom-software-development`,
      title: 'Custom Software Development Services | Synergy Brix',
      description:
        'From idea to implementation, we build custom software tailored to your specific business workflows, operational needs, and long-term scale.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Custom Software Development' },
          ]),
          {
            '@type': 'Service',
            name: 'Custom Software Development',
            provider: { '@id': `${SITE_URL}/#organization` },
            description:
              'Tailored software engineering designed to fit unique business requirements, workflows, and operational scaling.',
            url: `${SITE_URL}/services/custom-software-development`,
          },
        ],
      },
    },

    // 4. Service Detail: Web Application Development
    {
      path: '/services/web-development',
      canonical: `${SITE_URL}/services/web-development`,
      title: 'Web Application Development Services | Synergy Brix',
      description:
        'Fast, secure, and scalable web platforms built with modern frontend and backend architectures tailored to your business operations.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Web Application Development' },
          ]),
          {
            '@type': 'Service',
            name: 'Web Application Development',
            provider: { '@id': `${SITE_URL}/#organization` },
            description:
              'Custom web application development with responsive UI, role-based security, and high performance.',
            url: `${SITE_URL}/services/web-development`,
          },
        ],
      },
    },

    // 5. Service Detail: Business Automation
    {
      path: '/services/business-automation',
      canonical: `${SITE_URL}/services/business-automation`,
      title: 'Business Process Automation Solutions | Synergy Brix',
      description:
        'Reduce operational friction and eliminate manual handoffs with automated workflows connecting data, timing, and actions across systems.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Business Automation' },
          ]),
          {
            '@type': 'Service',
            name: 'Business Automation',
            provider: { '@id': `${SITE_URL}/#organization` },
            description:
              'Automated workflows, task orchestration, notification triggers, and data synchronization for growing businesses.',
            url: `${SITE_URL}/services/business-automation`,
          },
        ],
      },
    },

    // 6. Service Detail: Dashboard Development
    {
      path: '/services/dashboard-development',
      canonical: `${SITE_URL}/services/dashboard-development`,
      title: 'Custom Dashboard & Reporting Development | Synergy Brix',
      description:
        'Turn complex business data into clear, actionable insights with real-time KPI dashboards, automated reporting, and interactive visualizations.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Dashboard Development' },
          ]),
          {
            '@type': 'Service',
            name: 'Dashboard Development',
            provider: { '@id': `${SITE_URL}/#organization` },
            description:
              'Centralized reporting dashboards and data visualization tools for operational clarity and decision making.',
            url: `${SITE_URL}/services/dashboard-development`,
          },
        ],
      },
    },

    // 7. Service Detail: SaaS Development
    {
      path: '/services/saas-development',
      canonical: `${SITE_URL}/services/saas-development`,
      title: 'SaaS Product Development & Engineering | Synergy Brix',
      description:
        'Scalable multi-tenant SaaS products engineered for high performance, subscription billing, secure user management, and growth.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'SaaS Development' },
          ]),
          {
            '@type': 'Service',
            name: 'SaaS Development',
            provider: { '@id': `${SITE_URL}/#organization` },
            description:
              'End-to-end SaaS architecture, multi-tenant database patterns, billing integration, and customer onboarding.',
            url: `${SITE_URL}/services/saas-development`,
          },
        ],
      },
    },

    // 8. Service Detail: Cloud Solutions
    {
      path: '/services/cloud-solutions',
      canonical: `${SITE_URL}/services/cloud-solutions`,
      title: 'Cloud Infrastructure & Architecture Solutions | Synergy Brix',
      description:
        'Reliable cloud architecture, Docker containerization, CI/CD pipelines, and deployment strategies engineered for business stability.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Cloud Solutions' },
          ]),
          {
            '@type': 'Service',
            name: 'Cloud Solutions',
            provider: { '@id': `${SITE_URL}/#organization` },
            description:
              'Cloud infrastructure design, containerization, deployment pipelines, and uptime optimization.',
            url: `${SITE_URL}/services/cloud-solutions`,
          },
        ],
      },
    },

    // 9. Service Detail: Database Solutions
    {
      path: '/services/database-solutions',
      canonical: `${SITE_URL}/services/database-solutions`,
      title: 'Database Architecture & Data Solutions | Synergy Brix',
      description:
        'Scalable database design, PostgreSQL and MySQL optimization, data modeling, query tuning, and secure data infrastructure.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Database Solutions' },
          ]),
          {
            '@type': 'Service',
            name: 'Database Solutions',
            provider: { '@id': `${SITE_URL}/#organization` },
            description:
              'Robust database architecture, query performance optimization, schema design, and migration support.',
            url: `${SITE_URL}/services/database-solutions`,
          },
        ],
      },
    },

    // 10. Solutions Index
    {
      path: '/solutions',
      canonical: `${SITE_URL}/solutions`,
      title: 'Business Solutions & Digital Systems | Synergy Brix',
      description:
        'Explore business solutions from Synergy Brix for operations, CRM, inventory, customer portals, automation, reporting, and internal tools.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'weekly',
      priority: 0.9,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'Solutions' }]),
          {
            '@type': 'WebPage',
            name: 'Business Solutions',
            url: `${SITE_URL}/solutions`,
            description:
              'Outcome-oriented digital solutions for CRM, inventory, workflows, analytics, and portals.',
          },
        ],
      },
    },

    // 11. Industries
    {
      path: '/industries',
      canonical: `${SITE_URL}/industries`,
      title: 'Industry Solutions & Technology Support | Synergy Brix',
      description:
        'See how Synergy Brix supports manufacturing, engineering, healthcare, education, logistics, retail, services, real estate, and startups.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'Industries' }]),
          {
            '@type': 'WebPage',
            name: 'Industry Solutions',
            url: `${SITE_URL}/industries`,
          },
        ],
      },
    },

    // 12. Work / Portfolio Index
    {
      path: '/work',
      canonical: `${SITE_URL}/work`,
      title: 'Client Work & Case Studies | Synergy Brix',
      description:
        'Browse selected project showcases from Synergy Brix, including live client case studies for logistics platforms and wellness coaching brands.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'Work' }]),
          {
            '@type': 'CollectionPage',
            name: 'Client Work & Case Studies',
            url: `${SITE_URL}/work`,
          },
        ],
      },
    },

    // 13. Case Study: SSEZI Returns
    {
      path: '/work/ssezi-returns',
      canonical: `${SITE_URL}/work/ssezi-returns`,
      title: 'SSEZI Returns Logistics Platform Case Study | Synergy Brix',
      description:
        'Case study on designing and developing a modern digital logistics platform for SSEZI Returns to streamline return pickups and distribution.',
      ogType: 'article',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.7,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: 'SSEZI Returns' },
          ]),
          {
            '@type': 'CreativeWork',
            name: 'SSEZI Returns Logistics Platform',
            headline: 'SSEZI Returns Logistics Platform Case Study',
            creator: { '@id': `${SITE_URL}/#organization` },
            url: `${SITE_URL}/work/ssezi-returns`,
            description:
              'Digital platform engineering for SSEZI Returns reverse logistics and fulfillment operations.',
          },
        ],
      },
    },

    // 14. Case Study: Pratik Wellness
    {
      path: '/work/pratik-wellness',
      canonical: `${SITE_URL}/work/pratik-wellness`,
      title: 'Pratik Wellness Coach Platform Case Study | Synergy Brix',
      description:
        'Case study on developing an editorial wellness and nutrition coaching platform for Pratik, featuring program architecture and client onboarding.',
      ogType: 'article',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.7,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: 'Pratik Wellness Coach' },
          ]),
          {
            '@type': 'CreativeWork',
            name: 'Pratik Wellness Coach Platform',
            headline: 'Pratik Wellness Coach Platform Case Study',
            creator: { '@id': `${SITE_URL}/#organization` },
            url: `${SITE_URL}/work/pratik-wellness`,
            description:
              'Modern lifestyle coaching and nutrition consultation web platform for Pratik.',
          },
        ],
      },
    },

    // 15. Process
    {
      path: '/process',
      canonical: `${SITE_URL}/process`,
      title: 'Software Development Process & Delivery Model | Synergy Brix',
      description:
        'Learn how Synergy Brix approaches discovery, planning, design, development, testing, deployment, and ongoing support for business software.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'Process' }]),
          {
            '@type': 'WebPage',
            name: 'Development Process',
            url: `${SITE_URL}/process`,
          },
        ],
      },
    },

    // 16. Technologies
    {
      path: '/technologies',
      canonical: `${SITE_URL}/technologies`,
      title: 'Technology Stack & Engineering Capabilities | Synergy Brix',
      description:
        'Review Synergy Brix technology capabilities across React, TypeScript, Java, Spring Boot, PostgreSQL, Docker, cloud deployment, and REST APIs.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'Technologies' }]),
          {
            '@type': 'WebPage',
            name: 'Technology Stack',
            url: `${SITE_URL}/technologies`,
          },
        ],
      },
    },

    // 17. Insights Index
    {
      path: '/insights',
      canonical: `${SITE_URL}/insights`,
      title: 'Software & Technology Insights | Synergy Brix',
      description:
        'Explore practical articles on business software, automation, API design, architecture, digital transformation, and better technology decisions.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'weekly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'Insights' }]),
          {
            '@type': 'CollectionPage',
            name: 'Insights & Technology Articles',
            url: `${SITE_URL}/insights`,
          },
        ],
      },
    },

    // 18. Insight: Building Technology Around Business Processes
    {
      path: '/insights/building-technology-around-business-processes',
      canonical: `${SITE_URL}/insights/building-technology-around-business-processes`,
      title: 'Building Technology Around Business Processes | Synergy Brix Insights',
      description:
        'Successful software starts with a clear understanding of how work actually happens inside an organization.',
      ogType: 'article',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.7,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: 'Building Technology Around Business Processes' },
          ]),
          {
            '@type': 'BlogPosting',
            headline: 'Building Technology Around Business Processes',
            description:
              'Successful software starts with a clear understanding of how work actually happens inside an organization.',
            datePublished: '2026-06-01T00:00:00+00:00',
            dateModified: '2026-06-01T00:00:00+00:00',
            author: { '@id': `${SITE_URL}/#organization` },
            publisher: { '@id': `${SITE_URL}/#organization` },
            url: `${SITE_URL}/insights/building-technology-around-business-processes`,
          },
        ],
      },
    },

    // 19. Insight: What Makes an API Reliable
    {
      path: '/insights/what-makes-an-api-reliable',
      canonical: `${SITE_URL}/insights/what-makes-an-api-reliable`,
      title: 'What Makes an API Reliable | Synergy Brix Insights',
      description:
        'Reliable APIs are not just technically sound—they are predictable, secure, and easy to integrate over time.',
      ogType: 'article',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.7,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: 'What Makes an API Reliable' },
          ]),
          {
            '@type': 'BlogPosting',
            headline: 'What Makes an API Reliable',
            description:
              'Reliable APIs are not just technically sound—they are predictable, secure, and easy to integrate over time.',
            datePublished: '2026-05-01T00:00:00+00:00',
            dateModified: '2026-05-01T00:00:00+00:00',
            author: { '@id': `${SITE_URL}/#organization` },
            publisher: { '@id': `${SITE_URL}/#organization` },
            url: `${SITE_URL}/insights/what-makes-an-api-reliable`,
          },
        ],
      },
    },

    // 20. Insight: When Dashboards Drive Better Decisions
    {
      path: '/insights/when-dashboards-drive-better-decisions',
      canonical: `${SITE_URL}/insights/when-dashboards-drive-better-decisions`,
      title: 'When Dashboards Drive Better Decisions | Synergy Brix Insights',
      description:
        'A good dashboard does not overwhelm teams—it highlights the right signals and supports practical business action.',
      ogType: 'article',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.7,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: 'When Dashboards Drive Better Decisions' },
          ]),
          {
            '@type': 'BlogPosting',
            headline: 'When Dashboards Drive Better Decisions',
            description:
              'A good dashboard does not overwhelm teams—it highlights the right signals and supports practical business action.',
            datePublished: '2026-04-01T00:00:00+00:00',
            dateModified: '2026-04-01T00:00:00+00:00',
            author: { '@id': `${SITE_URL}/#organization` },
            publisher: { '@id': `${SITE_URL}/#organization` },
            url: `${SITE_URL}/insights/when-dashboards-drive-better-decisions`,
          },
        ],
      },
    },

    // 21. About
    {
      path: '/about',
      canonical: `${SITE_URL}/about`,
      title: 'About Synergy Brix | Technology Partner for Modern Business',
      description:
        'Learn about Synergy Brix, our founding team, and how we build business-first software, automation, and scalable digital systems for growing companies.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'About' }]),
          {
            '@type': 'AboutPage',
            name: 'About Synergy Brix',
            url: `${SITE_URL}/about`,
            mainEntity: { '@id': `${SITE_URL}/#organization` },
          },
        ],
      },
    },

    // 22. Contact
    {
      path: '/contact',
      canonical: `${SITE_URL}/contact`,
      title: 'Contact Synergy Brix | Start Your Software Project',
      description:
        'Get in touch with Synergy Brix to discuss your software project, automation idea, web application, or digital technology initiative.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.8,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'Contact' }]),
          {
            '@type': 'ContactPage',
            name: 'Contact Synergy Brix',
            url: `${SITE_URL}/contact`,
            mainEntity: { '@id': `${SITE_URL}/#organization` },
          },
        ],
      },
    },

    // 23. FAQ
    {
      path: '/faq',
      canonical: `${SITE_URL}/faq`,
      title: 'Frequently Asked Questions (FAQ) | Synergy Brix',
      description:
        'Find answers to common questions about custom software development, web applications, integrations, cloud hosting, automation, and project planning.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'monthly',
      priority: 0.7,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'FAQ' }]),
          {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What services does Synergy Brix provide?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Synergy Brix provides custom software development, web application engineering, business automation, dashboard and reporting systems, SaaS platform development, cloud architecture, and database solutions.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do we get started with a project?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'We begin with an initial discovery discussion to understand your business objectives, operational workflows, and technology requirements before outlining a structured proposal and timeline.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can you integrate with our existing tools and databases?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. We specialize in API design, third-party integrations, and database connectivity to unify disconnected tools and eliminate repetitive manual handoffs.',
                },
              },
            ],
          },
        ],
      },
    },

    // 24. Privacy Policy
    {
      path: '/privacy',
      canonical: `${SITE_URL}/privacy`,
      title: 'Privacy Policy | Synergy Brix',
      description:
        'Read the Synergy Brix privacy policy detailing data handling practices, security commitments, and operational privacy guidelines.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'yearly',
      priority: 0.3,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'Privacy Policy' }]),
          {
            '@type': 'WebPage',
            name: 'Privacy Policy',
            url: `${SITE_URL}/privacy`,
          },
        ],
      },
    },

    // 25. Terms & Conditions
    {
      path: '/terms',
      canonical: `${SITE_URL}/terms`,
      title: 'Terms & Conditions | Synergy Brix',
      description:
        'Read the Synergy Brix terms and conditions regarding software development services, project scopes, intellectual property, and service agreements.',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      changeFrequency: 'yearly',
      priority: 0.3,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          makeBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'Terms & Conditions' }]),
          {
            '@type': 'WebPage',
            name: 'Terms & Conditions',
            url: `${SITE_URL}/terms`,
          },
        ],
      },
    },
  ]
}

export function getNotFoundRouteMeta(): RouteMeta {
  return {
    path: '/404',
    canonical: `${SITE_URL}/404`,
    title: 'Page Not Found | Synergy Brix',
    description: 'The page you requested does not exist or may have moved.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    robots: 'noindex, nofollow',
    changeFrequency: 'never',
    priority: 0.0,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Page Not Found',
      url: `${SITE_URL}/404`,
    },
  }
}
