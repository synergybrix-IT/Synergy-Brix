import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe2,
  Code2,
  Workflow,
  BarChart3,
  Database,
  Check,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Minus,
  MapPin,
  Mail,
  Phone,
  Layers,
  Sparkles,
  Building2,
  ShoppingBag,
  Store,
  Briefcase,
  Wrench,
  Rocket,
  ShieldCheck,
  Server,
  Zap,
  Users,
  Calendar,
  FileSpreadsheet,
  MessageSquare,
  Clock,
} from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { SITE_URL } from '../config/siteUrl'
import { SectionIndex, Magnetic, PointerParallax, BgText } from '../components/premium'

export interface VasaiLandingPageProps {
  onOpenProjectModal?: () => void
}

/* ============================================================================
 * Services Data (Section 2)
 * ========================================================================= */
const WEBSITE_SERVICES = [
  {
    title: 'Business Website Development',
    short:
      'Professional corporate websites designed to establish strong credibility and communicate your value proposition clearly. Engineered for fast load times, clear service presentation, and friction-free inquiry funnels that convert visitors into paying clients.',
    slug: 'web-development',
    icon: Globe2,
    badge: 'Core Service',
    highlights: ['Fast load speeds', 'Clear service catalogs', 'Conversion-focused UX', 'Brand alignment'],
  },
  {
    title: 'Custom Web Applications',
    short:
      'Interactive, cloud-ready web applications built with modern frontend frameworks and robust backend architecture. Designed to digitize customer portals, employee workflows, and unique business processes that off-the-shelf software cannot accommodate.',
    slug: 'web-development',
    icon: Code2,
    badge: 'Custom Architecture',
    highlights: ['Role-based access', 'Secure authentication', 'Workflow engines', 'Cloud hosting'],
  },
  {
    title: 'E-commerce Websites',
    short:
      'Secure, high-converting digital storefronts tailored for retail, wholesale, and direct-to-consumer businesses. Features structured product catalogs, payment gateway integration, smooth checkout flows, and inventory synchronization.',
    slug: 'custom-software-development',
    icon: ShoppingBag,
    badge: 'Online Sales',
    highlights: ['Payment gateway setup', 'Product catalog management', 'Mobile checkout', 'Order tracking'],
  },
  {
    title: 'Responsive Website Design',
    short:
      'Mobile-first, adaptable web experiences that look and function flawlessly across smartphones, tablets, laptops, and wide screens. Ensures local customers enjoy an intuitive, frictionless browsing experience regardless of device.',
    slug: 'web-development',
    icon: Layers,
    badge: 'Mobile-First',
    highlights: ['Multi-device testing', 'Touch-friendly navigation', 'Optimized typography', 'Adaptive layouts'],
  },
  {
    title: 'Website Redesign',
    short:
      'Complete architectural and visual modernization for outdated websites that are slow, difficult to navigate, or unaligned with your current business goals. Upgrades speed, design aesthetics, SEO structure, and customer conversion pathways.',
    slug: 'web-development',
    icon: Zap,
    badge: 'Modernization',
    highlights: ['Speed optimization', 'Modern design refresh', 'Clean information architecture', 'SEO preservation'],
  },
  {
    title: 'Landing Pages',
    short:
      'High-impact, conversion-focused landing pages engineered specifically for digital marketing campaigns, product launches, or specific service offerings. Built with compelling layouts, clear value messaging, and optimized call-to-action triggers.',
    slug: 'web-development',
    icon: Sparkles,
    badge: 'High Conversion',
    highlights: ['Focused single-action design', 'Rapid loading time', 'A/B-ready structure', 'Direct CRM capture'],
  },
  {
    title: 'Website Maintenance',
    short:
      'Proactive technical support, security patches, performance optimization, content updates, and server monitoring. Keeps your website secure, fast, and continuously operational without taking your focus away from running your business.',
    slug: 'cloud-solutions',
    icon: ShieldCheck,
    badge: 'Ongoing Support',
    highlights: ['Uptime monitoring', 'Security updates', 'Routine data backups', 'Priority technical help'],
  },
]

/* ============================================================================
 * Custom Software Capabilities (Section 3)
 * ========================================================================= */
const SOFTWARE_CAPABILITIES = [
  {
    title: 'Custom Business Applications',
    description: 'Software tailored to your exact operational workflows, eliminating spreadsheet clutter and fragmented tools.',
    icon: Code2,
    serviceSlug: 'custom-software-development',
  },
  {
    title: 'REST APIs & Integrations',
    description: 'Secure, predictable interfaces that connect your internal systems, third-party payment gateways, and partner tools.',
    icon: Server,
    serviceSlug: 'custom-software-development',
  },
  {
    title: 'Admin Dashboards',
    description: 'Centralized control centers providing management teams with instant visibility over daily operations and activities.',
    icon: BarChart3,
    serviceSlug: 'dashboard-development',
  },
  {
    title: 'CRM Systems',
    description: 'Organized lead tracking, customer history, communication pipelines, and follow-up reminders tailored to your sales process.',
    icon: Users,
    serviceSlug: 'custom-software-development',
  },
  {
    title: 'ERP Solutions',
    description: 'Integrated modules for inventory, billing, vendor tracking, and resource management designed to scale as you expand.',
    icon: Workflow,
    serviceSlug: 'custom-software-development',
  },
  {
    title: 'Database-Driven Applications',
    description: 'Robust PostgreSQL and MySQL databases structured for integrity, relational queries, high throughput, and security.',
    icon: Database,
    serviceSlug: 'database-solutions',
  },
  {
    title: 'Authentication & Access Systems',
    description: 'Multi-tiered role-based access control (RBAC), secure sessions, and audit logging to protect sensitive company data.',
    icon: ShieldCheck,
    serviceSlug: 'custom-software-development',
  },
  {
    title: 'Cloud Deployment & DevOps',
    description: 'Containerized deployments with Docker, automated CI/CD pipelines, SSL encryption, and high-availability hosting.',
    icon: Layers,
    serviceSlug: 'cloud-solutions',
  },
  {
    title: 'Reporting Dashboards',
    description: 'Real-time business intelligence and automated exportable reports to support informed, data-driven decisions.',
    icon: BarChart3,
    serviceSlug: 'dashboard-development',
  },
]

/* ============================================================================
 * Business Automation Workflows (Section 4)
 * ========================================================================= */
const AUTOMATION_EXAMPLES = [
  {
    title: 'Enquiry Management',
    description:
      'Centralize leads arriving from websites, WhatsApp, and email into an organized queue so no customer request is ever overlooked or lost.',
    icon: MessageSquare,
  },
  {
    title: 'Customer Follow-ups',
    description:
      'Set automated reminder sequences, status updates, and milestone notifications to keep clients engaged without manual staff intervention.',
    icon: Clock,
  },
  {
    title: 'Appointment Workflows',
    description:
      'Self-serve consultation booking with automated calendar confirmations, reminder alerts, and rescheduling links that drastically cut down no-shows.',
    icon: Calendar,
  },
  {
    title: 'Invoice Generation',
    description:
      'Trigger automatic bill generation upon milestone completion, deliver digital receipts to clients, and log transaction data without manual re-entry.',
    icon: FileSpreadsheet,
  },
  {
    title: 'Lead Management',
    description:
      'Automatically assign inbound leads to specific sales representatives based on service interest, region, or urgency with immediate notifications.',
    icon: Users,
  },
  {
    title: 'Reporting Dashboards',
    description:
      'Consolidate operational metrics from different departments into automated daily or weekly executive summary reports delivered directly to management.',
    icon: BarChart3,
  },
  {
    title: 'Administrative Tasks',
    description:
      'Eliminate repetitive copy-pasting of customer records between forms, spreadsheets, and messaging tools through direct system-level synchronization.',
    icon: Workflow,
  },
]

/* ============================================================================
 * Who We Help in Vasai-Virar (Section 5)
 * ========================================================================= */
const LOCAL_SECTORS = [
  {
    category: 'Event Halls & Banquets',
    icon: Building2,
    howWeHelp:
      'Showcase hall amenities, photo galleries, package pricing, real-time date availability checkers, and direct event inquiry forms to secure bookings faster.',
  },
  {
    category: 'Interior Designers & Architects',
    icon: Sparkles,
    howWeHelp:
      'High-resolution portfolio showcases, interactive before-and-after project comparisons, consultation booking funnels, and digital proposal review portals.',
  },
  {
    category: 'Real Estate Businesses',
    icon: Building2,
    howWeHelp:
      'Structured property listing directories, interactive location maps, project amenity overviews, inquiry capture funnels, and automated buyer follow-ups.',
  },
  {
    category: 'Tiles & Marble Businesses',
    icon: Layers,
    howWeHelp:
      'Digital product catalogs with finish/dimension filters, sample request workflows, wholesale inquiry capture, and custom quote calculation tools.',
  },
  {
    category: 'Automotive Businesses',
    icon: Wrench,
    howWeHelp:
      'Online vehicle service booking, spare parts inventory lookups, customer repair job tracking, and automated service maintenance reminder alerts.',
  },
  {
    category: 'Professional Services (CA, Legal, Consultants)',
    icon: Briefcase,
    howWeHelp:
      'Credibility-first corporate websites, secure client document exchange portals, appointment scheduling tools, and service package calculators.',
  },
  {
    category: 'Retail & Commercial Businesses',
    icon: Store,
    howWeHelp:
      'Local online catalogs, WhatsApp-integrated order flows, customer loyalty tracking, and localized inventory visibility for walk-in and online buyers.',
  },
  {
    category: 'Local Service Businesses (Contractors, Logistics, Repair)',
    icon: Wrench,
    howWeHelp:
      'Transparent service menus, instant quote request forms, regional service area highlights, customer testimonials, and direct phone/WhatsApp calling.',
  },
  {
    category: 'Startups & Tech Ventures',
    icon: Rocket,
    howWeHelp:
      'Rapid prototype and MVP development, modern full-stack web applications, scalable database schemas, and API architectures ready for venture scaling.',
  },
  {
    category: 'Small & Medium Businesses (SMEs)',
    icon: Users,
    howWeHelp:
      'Custom internal ERP/CRM tools, automated billing pipelines, employee management portals, and unified operations dashboards that replace chaotic spreadsheets.',
  },
]

/* ============================================================================
 * Why Choose a Local Tech Partner (Section 6)
 * ========================================================================= */
const WHY_LOCAL_REASONS = [
  {
    title: 'Direct, In-Person Communication',
    description:
      'Meet directly with the developers and software engineers building your solution. Avoid bureaucratic agency account managers and miscommunicated requirements.',
    icon: Users,
  },
  {
    title: 'Understanding of Local Business Needs',
    description:
      'We understand the commercial realities, customer expectations, and operational rhythms of businesses across Vasai, Virar, and the Mumbai Metropolitan Region.',
    icon: MapPin,
  },
  {
    title: 'Faster Discussion & Agile Turnaround',
    description:
      'Rapid feedback loops mean questions are answered quickly, scope adjustments are handled smoothly, and project delivery progresses without long delays.',
    icon: Zap,
  },
  {
    title: 'Customized to How You Actually Work',
    description:
      'We do not force your company into rigid, pre-made templates. We architect software and websites around your genuine operational and sales workflows.',
    icon: Code2,
  },
  {
    title: 'Direct Support & Genuine Accountability',
    description:
      'Having a local technology partner means you have a real team you can contact directly whenever you need updates, security patches, or technical assistance.',
    icon: ShieldCheck,
  },
  {
    title: 'Scalable Engineering Foundations',
    description:
      'We build with clean code, modern frontend frameworks, and robust relational databases, ensuring your website or software can scale as your business grows.',
    icon: Layers,
  },
  {
    title: 'Practical Budgets for Growing Companies',
    description:
      'Clear, transparent pricing structures tailored for small and medium businesses, giving you high-end software capabilities without enterprise overhead.',
    icon: Check,
  },
]

/* ============================================================================
 * Technologies Used by Synergy Brix (Section 7)
 * ========================================================================= */
const TECH_STACK = [
  { name: 'React', category: 'Frontend', desc: 'Modern, component-driven interactive user interfaces.' },
  { name: 'Java', category: 'Backend', desc: 'Enterprise-grade, type-safe backend systems and services.' },
  { name: 'Spring Boot', category: 'Backend Framework', desc: 'High-performance microservices, security, and REST APIs.' },
  { name: 'Node.js', category: 'Runtime', desc: 'Fast, asynchronous server-side runtime and API services.' },
  { name: 'REST APIs', category: 'Architecture', desc: 'Clean, secure endpoints for system connectivity and integration.' },
  { name: 'PostgreSQL', category: 'Relational Database', desc: 'Reliable, ACID-compliant database for complex data structures.' },
  { name: 'MySQL', category: 'Database', desc: 'Widely supported, high-speed relational data storage.' },
  { name: 'Cloud Deployment', category: 'Infrastructure', desc: 'Docker containerization, CI/CD pipelines, and cloud hosting.' },
  { name: 'Modern Frontend', category: 'UI Engineering', desc: 'TypeScript, semantic HTML5, Vanilla CSS, and responsive layouts.' },
]

/* ============================================================================
 * From Website to Business System (Section 8)
 * ========================================================================= */
const PROGRESSION_STEPS = [
  {
    number: '01',
    title: 'Website',
    subtitle: 'Digital Foundation',
    description: 'A modern, responsive website that builds strong brand credibility and establishes your online presence.',
  },
  {
    number: '02',
    title: 'Lead Capture',
    subtitle: 'Inquiry Funnels',
    description: 'Structured contact forms, WhatsApp triggers, and conversion pathways that capture potential buyer intent.',
  },
  {
    number: '03',
    title: 'Database',
    subtitle: 'Data Centralization',
    description: 'A secure, structured database replacing scattered notebooks and spreadsheets with unified customer data.',
  },
  {
    number: '04',
    title: 'Admin Dashboard',
    subtitle: 'Operational Oversight',
    description: 'A protected web dashboard for business owners to view, manage, and assign incoming customer requests.',
  },
  {
    number: '05',
    title: 'Automation',
    subtitle: 'Friction Removal',
    description: 'Automated confirmation emails, follow-up reminders, and status alerts triggered by customer actions.',
  },
  {
    number: '06',
    title: 'CRM / ERP',
    subtitle: 'Integrated Management',
    description: 'Comprehensive business software connecting customer relationships, inventory, billing, and staff tasks.',
  },
  {
    number: '07',
    title: 'Business Reporting',
    subtitle: 'Strategic Visibility',
    description: 'Real-time analytics and automated KPI reporting that provide clear signals for growth and optimization.',
  },
]

/* ============================================================================
 * Service Areas (Section 9)
 * ========================================================================= */
const SERVICE_AREAS = [
  { name: 'Vasai', description: 'Central commercial hubs, retail streets, and local enterprise operations.' },
  { name: 'Vasai East', description: 'Industrial zones including Waliv, Gokhivare, Sativali, and Fatherwadi.' },
  { name: 'Vasai West', description: 'Core residential & business sectors including Navghar, Ambadi Road, Stella, and Babhai.' },
  { name: 'Virar', description: 'Virar East and West, Bolinj, Global City, and growing commercial corridors.' },
  { name: 'Nalasopara', description: 'Nalasopara East, West, Achole, Tulinj, and surrounding commercial markets.' },
  { name: 'Naigaon', description: 'Naigaon East, West, Juchandra, and emerging business developments.' },
  { name: 'Vasai-Virar Region', description: 'The comprehensive municipal corporation area and neighboring business districts.' },
]

/* ============================================================================
 * FAQs (Section 10)
 * ========================================================================= */
const VASAI_FAQS = [
  {
    q: 'Does Synergy Brix build websites for businesses in Vasai?',
    a: 'Yes. Synergy Brix is based in Vasai West and works directly with businesses across Vasai, Virar, Nalasopara, Naigaon, and the wider Mumbai Metropolitan Region to design and develop modern, responsive, and high-performance websites.',
  },
  {
    q: 'What type of websites does Synergy Brix develop?',
    a: 'We build professional corporate websites, custom web applications, e-commerce storefronts, business portfolios, marketing landing pages, and customer portals. Every website is built from the ground up to match the specific commercial requirements of your business.',
  },
  {
    q: 'Can Synergy Brix build custom business software?',
    a: 'Yes. Beyond standard websites, we engineer bespoke software solutions including custom business management platforms, admin dashboards, database-driven applications, CRM tools, ERP modules, and REST APIs designed around your real operational workflows.',
  },
  {
    q: 'Can you automate business processes?',
    a: 'Yes. We build automation workflows that handle customer inquiry routing, automated email/WhatsApp follow-ups, appointment scheduling, digital invoice generation, and cross-system data synchronization to eliminate manual administrative bottlenecks.',
  },
  {
    q: 'Do you provide website maintenance?',
    a: 'Yes. We offer reliable website maintenance services covering regular software updates, security monitoring, uptime tracking, performance optimization, content updates, and routine backups to ensure your digital assets stay secure and fast.',
  },
  {
    q: 'Can you build a CRM or admin dashboard?',
    a: 'Yes. We specialize in developing intuitive admin dashboards and custom CRM systems that give business owners and management teams clear, real-time visibility over inquiries, sales pipelines, customer interactions, and operational metrics.',
  },
  {
    q: 'Do you work with small businesses in Vasai-Virar?',
    a: 'Yes. We actively work with small and medium businesses, local retail shops, professional service firms, and early-stage startups across Vasai-Virar, providing practical, scalable technology solutions that respect real-world business budgets.',
  },
]

/* ============================================================================
 * JSON-LD Schema Generator
 * ========================================================================= */
function getVasaiLandingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Website Development Company in Vasai',
            item: `${SITE_URL}/website-development-company-in-vasai`,
          },
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/website-development-company-in-vasai#localbusiness`,
        name: 'Synergy Brix',
        url: `${SITE_URL}/website-development-company-in-vasai`,
        logo: `${SITE_URL}/logo.png`,
        image: `${SITE_URL}/logo.png`,
        description:
          'Synergy Brix is a website and software development company serving businesses in Vasai-Virar with modern websites, web applications, business automation, CRM, APIs and custom software solutions.',
        telephone: '+91-79724-15528',
        email: 'synergy.brix@gmail.com',
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Gonsalves Property, Near Alphonso Church, Behind Stella Petrol Pump',
          addressLocality: 'Vasai West',
          addressRegion: 'Maharashtra',
          postalCode: '401202',
          addressCountry: 'India',
        },
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Vasai' },
          { '@type': 'AdministrativeArea', name: 'Vasai West' },
          { '@type': 'AdministrativeArea', name: 'Vasai East' },
          { '@type': 'AdministrativeArea', name: 'Virar' },
          { '@type': 'AdministrativeArea', name: 'Nalasopara' },
          { '@type': 'AdministrativeArea', name: 'Naigaon' },
          { '@type': 'AdministrativeArea', name: 'Vasai-Virar' },
          { '@type': 'AdministrativeArea', name: 'Mumbai' },
        ],
        sameAs: [
          'https://www.linkedin.com/in/synergy-brix-721726433/',
          'https://www.instagram.com/synergy.brix',
          'https://wa.me/917972415528',
        ],
      },
      {
        '@type': 'Service',
        '@id': `${SITE_URL}/website-development-company-in-vasai#service`,
        name: 'Website & Software Development Services in Vasai',
        provider: { '@id': `${SITE_URL}/website-development-company-in-vasai#localbusiness` },
        description:
          'Full-stack website development, custom web applications, business automation, CRM systems, and cloud software solutions for businesses in Vasai-Virar.',
        url: `${SITE_URL}/website-development-company-in-vasai`,
        areaServed: 'Vasai-Virar',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Website & Software Development Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Business Website Development' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Web Applications' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'E-commerce Websites' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Responsive Website Design' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Website Redesign' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Landing Pages' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Website Maintenance' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Software Development' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Business Process Automation' } },
          ],
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: VASAI_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  }
}

/* ============================================================================
 * Main Component
 * ========================================================================= */
export default function VasaiLandingPage({ onOpenProjectModal }: VasaiLandingPageProps) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0)

  usePageMeta({
    title: 'Website Development Company in Vasai | Synergy Brix',
    description:
      'Synergy Brix is a website and software development company serving businesses in Vasai-Virar with modern websites, web applications, business automation, CRM, APIs and custom software solutions.',
    canonical: `${SITE_URL}/website-development-company-in-vasai`,
    robots: 'index, follow',
    jsonLd: getVasaiLandingJsonLd(),
  })

  const handleStartProject = () => {
    if (onOpenProjectModal) {
      onOpenProjectModal()
    } else {
      window.location.href = '/contact'
    }
  }

  const scrollToServices = () => {
    const el = document.getElementById('services-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-ink-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* =========================================================================
       * HERO SECTION
       * ========================================================================= */}
      <section className="surface-canvas relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:min-h-screen lg:pt-44 lg:pb-28">
        <div className="mesh-bg absolute inset-0" />
        <BgText className="-top-8 left-1/2 -translate-x-1/2 select-none">Vasai</BgText>

        <div className="pointer-events-none absolute -left-28 top-32 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl" />

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
              {/* Local Indicator Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-200 backdrop-blur-md">
                <MapPin size={13} className="text-emerald-300" />
                <span>Operating in Vasai-Virar • Technology Partner</span>
              </div>

              {/* H1 Tag (Required for SEO) */}
              <h1 className="sr-only">Website Development Company in Vasai</h1>

              {/* Visual Main Headline */}
              <h2 className="mt-6 text-[clamp(2.4rem,5.5vw,4.75rem)] font-semibold leading-[1.02] tracking-tightest text-white">
                Website &amp; Software Development for Businesses in{' '}
                <span className="font-serif-display italic text-emerald-200/90">Vasai</span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Synergy Brix helps businesses in Vasai and Vasai-Virar build modern websites, web applications and custom software
                solutions that improve their digital presence and business operations.
              </p>

              {/* Hero CTA buttons */}
              <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <Magnetic>
                  <button
                    type="button"
                    onClick={handleStartProject}
                    className="btn-primary btn-base relative inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold shadow-lg shadow-emerald-500/20"
                  >
                    Start a Project
                    <ArrowRight size={16} className="arrow-shift" />
                  </button>
                </Magnetic>
                <Magnetic>
                  <button
                    type="button"
                    onClick={scrollToServices}
                    className="btn-secondary btn-base relative inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold"
                  >
                    View Our Services
                  </button>
                </Magnetic>
              </div>

              {/* Local quick highlights */}
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-white/8 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Direct Local Collaboration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Clean Engineering (React, Java, APIs)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Transparent Budgets</span>
                </div>
              </div>
            </div>

            {/* Interactive Local Technology Card Visual */}
            <PointerParallax strength={14} className="relative">
              <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300">
                      <Code2 size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Synergy Brix</div>
                      <div className="text-[10px] font-mono text-emerald-300/80">Vasai West, Maharashtra</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Local Office
                  </span>
                </div>

                <div className="mt-6 space-y-3.5">
                  <div className="rounded-2xl border border-white/6 bg-white/2 p-3.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-300/90">Websites</span>
                      <span>Fast &amp; Responsive</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-200">Modern corporate websites, landing pages &amp; portfolios</p>
                  </div>

                  <div className="rounded-2xl border border-white/6 bg-white/2 p-3.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-300/90">Custom Software</span>
                      <span>Web Apps &amp; CRM</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-200">Custom business software, portals &amp; administrative dashboards</p>
                  </div>

                  <div className="rounded-2xl border border-white/6 bg-white/2 p-3.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-300/90">Automation</span>
                      <span>Operational Efficiency</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-200">Enquiry workflows, billing triggers &amp; customer notifications</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/8 text-xs">
                  <span className="text-slate-400">Ready to discuss your project?</span>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 font-semibold text-emerald-300 hover:text-emerald-200 transition"
                  >
                    Contact Team <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </PointerParallax>
          </div>
        </div>
      </section>

      {/* =========================================================================
       * SECTION 1: About Synergy Brix
       * ========================================================================= */}
      <section className="relative overflow-hidden bg-ink-900 py-20 lg:py-28 border-t border-white/6">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
            <div>
              <SectionIndex index="01" label="About Synergy Brix" />
              <h2 className="mt-6 text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-5xl">
                A technology partner rooted in{' '}
                <span className="font-serif-display italic text-emerald-200/90">Vasai-Virar.</span>
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-400">
                Synergy Brix is a software and technology company based and operating in the Vasai-Virar region. We partner with
                local businesses, organizations, and growing enterprises to build reliable websites and custom software solutions.
              </p>
              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300 hover:text-emerald-200 transition"
                >
                  Learn more about our team <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/8">
                <h3 className="text-xl font-semibold text-white">Practical Business Solutions Over Generic Templates</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Many businesses in Vasai-Virar either settle for slow, generic website templates that fail to attract customers or
                  struggle with disconnected tools and manual spreadsheets. Synergy Brix focuses on practical business solutions
                  engineered around how your work actually happens.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-white/8 text-sm">
                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-200">Modern websites and web applications</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-200">Secure REST APIs &amp; system integrations</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-200">Custom CRM &amp; ERP systems</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-200">Business dashboards &amp; workflow automation</span>
                  </div>
                </div>
              </div>

              {/* Verified Office Information Card */}
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/5 p-6 sm:p-7">
                <div className="flex items-center gap-2.5 text-emerald-300 font-mono text-xs uppercase tracking-wider">
                  <MapPin size={16} /> Official Location
                </div>
                <address className="mt-3 not-italic text-sm leading-6 text-slate-300">
                  <strong className="text-white">Synergy Brix</strong>
                  <br />
                  Gonsalves Property, Near Alphonso Church, Behind Stella Petrol Pump
                  <br />
                  Vasai West, Maharashtra – 401202, India
                </address>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-3 border-t border-emerald-400/15">
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} className="text-emerald-300" /> +91 79724 15528
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} className="text-emerald-300" /> synergy.brix@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
       * SECTION 2: Website Development Services in Vasai
       * ========================================================================= */}
      <section id="services-section" className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
        <div className="dotted-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <SectionIndex index="02" label="Our Services" />
            <h2 className="mt-6 text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-5xl">
              Website Development Services in{' '}
              <span className="font-serif-display italic text-emerald-200/90">Vasai.</span>
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              High-quality web design and engineering designed to deliver measurable business outcomes. We build fast, clean, and
              responsive websites that represent your brand properly and convert local visitors.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WEBSITE_SERVICES.map((svc, i) => {
              const Icon = svc.icon
              return (
                <motion.div
                  key={svc.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
                  className="card-lift group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-6 sm:p-7 hover:border-emerald-400/30"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 transition group-hover:scale-105 group-hover:border-emerald-400/40">
                        <Icon size={20} />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-300/80 rounded-full bg-white/4 px-2.5 py-1 border border-white/6">
                        {svc.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-white group-hover:text-emerald-200 transition">
                      {svc.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">{svc.short}</p>

                    <div className="mt-5 space-y-1.5 pt-4 border-t border-white/6">
                      {svc.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 text-xs text-slate-400">
                          <Check size={12} className="text-emerald-400 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/6">
                    <Link
                      to={`/services/${svc.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300 hover:text-emerald-200 transition group-hover:translate-x-0.5"
                    >
                      Explore capability <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:border-emerald-400/40 hover:text-white transition"
            >
              Browse all software &amp; technology services <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
       * SECTION 3: Custom Software Development in Vasai
       * ========================================================================= */}
      <section className="relative overflow-hidden bg-ink-900 py-24 lg:py-32 border-t border-white/6">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <SectionIndex index="03" label="Beyond Websites" />
              <h2 className="mt-6 text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-5xl">
                Custom Software Development in{' '}
                <span className="font-serif-display italic text-emerald-200/90">Vasai.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-400">
              When standard website templates or off-the-shelf software packages are too restrictive for your daily operations, we
              build bespoke software systems designed around your business workflows.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SOFTWARE_CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon
              return (
                <div
                  key={cap.title}
                  className="card-lift group rounded-2xl border border-white/8 bg-white/3 p-6 transition duration-300 hover:border-emerald-400/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300">
                      <Icon size={18} />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white group-hover:text-emerald-200 transition">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-slate-300">{cap.description}</p>
                  <div className="mt-4 pt-3 border-t border-white/6">
                    <Link
                      to={`/services/${cap.serviceSlug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 hover:text-emerald-200 transition"
                    >
                      Learn more <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Business Owner Benefit Callout */}
          <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-white/2 to-transparent p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
              <div>
                <h4 className="text-lg font-semibold text-white">Why build custom software instead of paying monthly SaaS?</h4>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Off-the-shelf subscription tools often charge per user, lock your data in proprietary formats, and force your team
                  to adapt to someone else&apos;s workflow. Custom software gives your business total data ownership, tailored
                  efficiency, and no compounding monthly license fees.
                </p>
              </div>
              <div className="flex justify-start lg:justify-end">
                <button
                  type="button"
                  onClick={handleStartProject}
                  className="btn-primary btn-base inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold"
                >
                  Discuss Custom Software <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
       * SECTION 4: Business Automation for Vasai Businesses
       * ========================================================================= */}
      <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
        <div className="dotted-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div>
              <SectionIndex index="04" label="Process Efficiency" />
              <h2 className="mt-6 text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-5xl">
                Business Automation for{' '}
                <span className="font-serif-display italic text-emerald-200/90">Vasai Businesses.</span>
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-400">
                Manual data entry, missed follow-ups, and repetitive clerical tasks drain valuable hours every week. We build
                automated digital workflows that connect your systems, save staff time, and prevent costly human oversights.
              </p>

              <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-5">
                <div className="font-mono text-xs uppercase tracking-wider text-emerald-300">Practical Automation</div>
                <p className="mt-2 text-xs leading-6 text-slate-300">
                  Automation is about removing friction from day-to-day work so you and your team can focus on client relationships,
                  sales growth, and business delivery.
                </p>
              </div>

              <div className="mt-6">
                <Link
                  to="/services/business-automation"
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300 hover:text-emerald-200 transition"
                >
                  Explore business automation solutions <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {AUTOMATION_EXAMPLES.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="card-lift rounded-2xl border border-white/8 bg-white/3 p-5 transition duration-300 hover:border-emerald-400/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
                        <Icon size={16} />
                      </div>
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="mt-3 text-xs leading-6 text-slate-300">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
       * SECTION 5: Who We Help in Vasai-Virar
       * ========================================================================= */}
      <section className="relative overflow-hidden bg-ink-900 py-24 lg:py-32 border-t border-white/6">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <SectionIndex index="05" label="Local Industries" />
            <h2 className="mt-6 text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-5xl">
              Who We Help in{' '}
              <span className="font-serif-display italic text-emerald-200/90">Vasai-Virar.</span>
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Every industry operates differently. We design websites, web portals, and software systems that reflect the exact
              operational and customer interaction patterns of local commercial sectors.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {LOCAL_SECTORS.map((sector) => {
              const Icon = sector.icon
              return (
                <div
                  key={sector.category}
                  className="card-lift group flex flex-col justify-between rounded-2xl border border-white/8 bg-white/3 p-5 transition hover:border-emerald-400/30"
                >
                  <div>
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 transition group-hover:scale-105">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white group-hover:text-emerald-200 transition">
                      {sector.category}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-slate-300">{sector.howWeHelp}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/6 flex items-center gap-1.5 text-[11px] text-emerald-300/90">
                    <Check size={12} className="text-emerald-400" />
                    <span>Tailored solution</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/industries"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              See all industry capabilities <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
       * SECTION 6: Why Businesses in Vasai Choose a Local Technology Partner
       * ========================================================================= */}
      <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
        <div className="dotted-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div>
              <SectionIndex index="06" label="Why Work Locally" />
              <h2 className="mt-6 text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-5xl">
                Why Businesses in Vasai Choose a{' '}
                <span className="font-serif-display italic text-emerald-200/90">Local Technology Partner.</span>
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-400">
                Working with a local technology team means transparent conversations, faster turnaround, and genuine
                accountability. You speak directly with the engineers building your product.
              </p>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleStartProject}
                  className="btn-primary btn-base inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
                >
                  Schedule a Discussion <ArrowRight size={15} />
                </button>
              </div>
            </div>

            <div className="space-y-3.5">
              {WHY_LOCAL_REASONS.map((reason, i) => {
                const Icon = reason.icon
                return (
                  <div
                    key={reason.title}
                    className="card-lift rounded-2xl border border-white/8 bg-white/3 p-5 sm:p-6 transition hover:border-emerald-400/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-white">{reason.title}</h3>
                          <span className="font-mono text-[10px] text-slate-500">0{i + 1}</span>
                        </div>
                        <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-300">{reason.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
       * SECTION 7: Our Technology & Development Capabilities
       * ========================================================================= */}
      <section className="relative overflow-hidden bg-ink-900 py-24 lg:py-32 border-t border-white/6">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <SectionIndex index="07" label="Technology Stack" />
            <h2 className="mt-6 text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-5xl">
              Our Technology &amp; Development{' '}
              <span className="font-serif-display italic text-emerald-200/90">Capabilities.</span>
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              We engineer our systems using proven, modern, and production-tested technologies that ensure security, speed, and
              long-term maintainability.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="card-lift rounded-2xl border border-white/8 bg-white/3 p-5 transition hover:border-emerald-400/30"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{tech.name}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/80 rounded-full bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-400/20">
                    {tech.category}
                  </span>
                </div>
                <p className="mt-2.5 text-xs leading-6 text-slate-300">{tech.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/technologies"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              Learn more about our technology approach <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
       * SECTION 8: From Website to Business System (Progression Timeline)
       * ========================================================================= */}
      <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
        <div className="dotted-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <SectionIndex index="08" label="Growth Pathway" />
            <h2 className="mt-6 text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-5xl">
              From Website to{' '}
              <span className="font-serif-display italic text-emerald-200/90">Business System.</span>
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Technology should grow alongside your company. We help businesses progress step-by-step from an initial web presence
              to a fully automated digital operations system.
            </p>
          </div>

          {/* Visually Attractive Timeline Grid */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 relative">
            {PROGRESSION_STEPS.map((step, idx) => (
              <div
                key={step.number}
                className="card-lift relative flex flex-col justify-between rounded-2xl border border-white/8 bg-white/3 p-5 transition hover:border-emerald-400/30"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-emerald-300">{step.number}</span>
                    {idx < PROGRESSION_STEPS.length - 1 && (
                      <span className="hidden xl:inline text-slate-600 font-mono">↓</span>
                    )}
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-white">{step.title}</h3>
                  <div className="text-[11px] font-mono text-emerald-300/80 uppercase tracking-wider mt-0.5">
                    {step.subtitle}
                  </div>
                  <p className="mt-2.5 text-xs leading-5 text-slate-300">{step.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/6 flex items-center gap-1 text-[10px] font-mono text-slate-500">
                  <span>Stage {step.number}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-400">
              Start at whatever stage makes sense for your business today, and expand as your operational needs evolve.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
       * SECTION 9: Serving Vasai-Virar and Nearby Business Areas
       * ========================================================================= */}
      <section className="relative overflow-hidden bg-ink-900 py-24 lg:py-32 border-t border-white/6">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <SectionIndex index="09" label="Coverage & Service Area" />
            <h2 className="mt-6 text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-5xl">
              Serving Vasai-Virar and{' '}
              <span className="font-serif-display italic text-emerald-200/90">Nearby Business Areas.</span>
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Our engineering team is based in Vasai West and collaborates with commercial clients throughout the region.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SERVICE_AREAS.map((area) => (
              <div
                key={area.name}
                className="card-lift rounded-2xl border border-white/8 bg-white/3 p-5 transition hover:border-emerald-400/30"
              >
                <div className="flex items-center gap-2 text-emerald-300">
                  <MapPin size={16} />
                  <h3 className="text-base font-semibold text-white">{area.name}</h3>
                </div>
                <p className="mt-2.5 text-xs leading-6 text-slate-300">{area.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-white/8 bg-white/2 p-5 text-xs text-slate-400 leading-relaxed text-center max-w-2xl mx-auto">
            Whether you operate in retail, industrial manufacturing, hospitality, real estate, or professional services across
            Vasai-Virar, our team is available for in-person meetings and direct technical discussions.
          </div>
        </div>
      </section>

      {/* =========================================================================
       * SECTION 10: Frequently Asked Questions
       * ========================================================================= */}
      <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
        <div className="dotted-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <SectionIndex index="10" label="FAQ" />
              <h2 className="mt-6 text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-5xl">
                Frequently Asked{' '}
                <span className="font-serif-display italic text-emerald-200/90">Questions.</span>
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-400">
                Clear answers to common questions about our website development, custom software, and automation services in Vasai.
              </p>
              <div className="mt-8">
                <Link
                  to="/faq"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition"
                >
                  View general company FAQ <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div>
              <ul className="border-t border-white/8">
                {VASAI_FAQS.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx
                  return (
                    <li key={faq.q} className="border-b border-white/8">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        className="group flex w-full items-start justify-between gap-6 py-5 text-left transition"
                      >
                        <span className="text-base font-medium text-white group-hover:text-emerald-200 transition sm:text-lg">
                          {faq.q}
                        </span>
                        <span
                          className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-emerald-300 transition-all duration-300 ${
                            isOpen ? 'rotate-180 border-emerald-400/40 bg-emerald-500/10' : 'group-hover:border-emerald-400/30'
                          }`}
                        >
                          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-slate-300">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
       * SECTION 11: Start Your Website or Software Project (Final CTA)
       * ========================================================================= */}
      <section className="relative overflow-hidden border-t border-white/6 bg-ink-950 text-white py-20 lg:py-28">
        <div className="cta-grid absolute inset-0 opacity-50" />
        <BgText className="-top-12 left-1/2 -translate-x-1/2">Build</BgText>
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-teal-400/15 blur-[100px]" />

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <div className="eyebrow">Start Your Project</div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-5xl">
              Start Your Website or Software{' '}
              <span className="font-serif-display italic text-emerald-200/90">Project.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base sm:text-lg leading-8 text-slate-300">
              Have an idea for a website, web application or business automation system?
              <br />
              Talk to Synergy Brix about your requirements and explore a practical technology solution for your business.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-300" /> Vasai West, Maharashtra
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={14} className="text-emerald-300" /> +91 79724 15528
              </span>
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-emerald-300" /> synergy.brix@gmail.com
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 sm:flex-row lg:justify-end">
            <Magnetic>
              <button
                type="button"
                onClick={handleStartProject}
                className="btn-primary btn-base relative inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold shadow-xl shadow-emerald-500/25"
              >
                Discuss Your Project
                <ArrowRight size={16} className="arrow-shift" />
              </button>
            </Magnetic>
            <Magnetic>
              <Link
                to="/contact"
                className="btn-secondary btn-base relative inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold"
              >
                Contact Page
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  )
}
