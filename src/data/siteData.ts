import { SITE_URL } from '../config/siteUrl'

export type NavItem = {
  label: string
  to: string
  children?: { label: string; to: string }[]
}

export type Service = {
  slug: string
  title: string
  short: string
  problem: string
  solution: string
  features: string[]
  technology: string[]
  cta: string
}

export type Solution = {
  slug: string
  title: string
  summary: string
  problem: string
  approach: string
  relatedServiceSlug?: string
  relatedServiceTitle?: string
}

export type Industry = {
  title: string
  summary: string
}

export type CaseStudy = {
  slug: string
  title: string
  label: string
  categoryBadge?: string
  liveUrl?: string
  displayUrl?: string
  overview: string
  challenge: string
  approach: string
  solution: string
  technology: string[]
  architecture: string
  outcome: string
  tags?: string[]
  feedback?: string
}

export type BlogPost = {
  slug: string
  title: string
  category: string
  excerpt: string
  readTime: string
  date: string
  content: string[]
  relatedServiceSlug?: string
  relatedServiceTitle?: string
}

export const navItems: NavItem[] = [
  { label: 'Home', to: '/#home' },
  {
    label: 'Services',
    to: '/#services',
    children: [
      { label: 'Custom Software Development', to: '/services/custom-software-development' },
      { label: 'Web Application Development', to: '/services/web-development' },
      { label: 'Business Automation', to: '/services/business-automation' },
      { label: 'Dashboard Development', to: '/services/dashboard-development' },
      { label: 'SaaS Development', to: '/services/saas-development' },
      { label: 'Cloud Solutions', to: '/services/cloud-solutions' },
      { label: 'Database Solutions', to: '/services/database-solutions' },
    ],
  },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
]

export const services: Service[] = [
  {
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    short: 'From idea to implementation, we build custom software designed specifically for your business.',
    problem: 'Off-the-shelf software often fails to fit the way your business actually works.',
    solution: 'We design and develop custom software tailored to your unique requirements, workflows, and operational needs—built to scale as your business grows.',
    features: ['Requirements Discovery & Planning', 'Custom Software Development', 'Workflow Automation', 'Scalable System Architecture', 'Ongoing Maintenance & Support'],
    technology: ['React', 'TypeScript', 'Java', 'Spring Boot', 'PostgreSQL'],
    cta: 'Discuss a custom solution',
  },
  {
    slug: 'web-development',
    title: 'Web Application Development',
    short: 'Fast, secure, and scalable web platforms built for your business.',
    problem: 'Disconnected systems and inefficient web tools can slow operations and create poor user experiences.',
    solution: 'We build secure, scalable web applications tailored to your workflows and designed to grow with your business.',
    features: ['Responsive & Intuitive UI', 'Role-Based Access Control', 'Secure User Management', 'Performance Optimization', 'Scalable Architecture'],
    technology: ['React', 'TypeScript', 'HTML', 'CSS', 'REST APIs'],
    cta: 'Plan a web app',
  },
  {
    slug: 'business-automation',
    title: 'Business Automation',
    short: 'Reduce friction with workflows that connect data, timing, and actions.',
    problem: 'Manual handoffs slow teams and create avoidable operational risk.',
    solution: 'We automate repeatable processes to save time and improve consistency across your business.',
    features: ['Workflow automation', 'Notifications', 'Document processing', 'Task orchestration', 'Data sync'],
    technology: ['Java', 'REST APIs', 'Cron jobs', 'Cloud services', 'Reporting'],
    cta: 'Automate business workflows',
  },
  {
    slug: 'dashboard-development',
    title: 'Dashboard Development',
    short: 'Turn complex business data into clear, actionable insights.',
    problem: 'Scattered data makes it difficult to monitor performance and make informed decisions.',
    solution: 'We create centralized dashboards that transform fragmented data into clear, actionable insights.',
    features: ['Data Integration & Aggregation', 'Custom KPIs & Metrics', 'Interactive Data Visualizations', 'Automated Reporting', 'Role-based Dashboards', 'Real-Time Insights'],
    technology: ['React', 'TypeScript', 'Data Visualization', 'REST APIs', 'Security Patterns'],
    cta: 'Design a dashboard',
  },
  {
    slug: 'saas-development',
    title: 'SaaS Development',
    short: 'Scalable SaaS products built for growth, performance, and long-term success.',
    problem: 'Building a SaaS product requires more than just features—it needs a scalable foundation that can support growth.',
    solution: 'We build flexible, scalable SaaS platforms designed to evolve with your users, product, and business.',
    features: ['Multi-Tenant Architecture', 'User Authentication & Onboarding', 'Subscription & Billing Integration', 'Performance Monitoring', 'Scalable Product Structure', 'Ongoing Maintenance & Support'],
    technology: ['React', 'TypeScript', 'Java', 'Spring Boot', 'Cloud deployment'],
    cta: 'Discuss a SaaS product',
  },
  {
    slug: 'cloud-solutions',
    title: 'Cloud Solutions',
    short: 'Deployment strategies that support reliability, scalability, and simplicity.',
    problem: 'Without the right cloud strategy, applications can become costly, difficult to manage, and unreliable as they scale.',
    solution: 'We build scalable cloud infrastructure for reliable performance and growth.',
    features: ['Cloud Architecture & Planning', 'Containerization', 'CI/CD Implementation', 'Cloud Deployment & Migration', 'Performance Optimization', 'Infrastructure Monitoring'],
    technology: ['Docker', 'Cloud deployment', 'CI/CD', 'Container orchestration', 'Monitoring'],
    cta: 'Plan cloud deployment',
  },
  {
    slug: 'database-solutions',
    title: 'Database Solutions',
    short: 'Robust database solutions built for performance, reliability, and scale.',
    problem: 'Poor database design can lead to slow performance, inconsistent data, and systems that are difficult to scale.',
    solution: 'We design scalable, reliable databases that keep your data structured, secure, and accessible.',
    features: ['Database Architecture & Schema Design', 'Data Modeling', 'Query & Performance Optimization', 'Database Migration', 'Data Integrity & Security'],
    technology: ['PostgreSQL', 'MySQL', 'Database design', 'SQL', 'System integration'],
    cta: 'Improve your data foundation',
  },
]

export const solutions: Solution[] = [
  {
    slug: 'business-management',
    title: 'Business Management',
    summary: 'Operational workflows that unify teams, processes, and visibility.',
    problem: 'Business teams often work across disconnected spreadsheets, forms, and legacy tools.',
    approach: 'We map core workflows and build an intelligent system around them with role-based controls and reporting.',
    relatedServiceSlug: 'custom-software-development',
    relatedServiceTitle: 'Custom Software Development',
  },
  {
    slug: 'crm',
    title: 'CRM',
    summary: 'Customer relationship tools that bring pipeline, communication, and follow-up together.',
    problem: 'Without a common record of customer activity, teams lose context and momentum.',
    approach: 'We design structured customer records, lead tracking, and process automation around your sales and service model.',
    relatedServiceSlug: 'custom-software-development',
    relatedServiceTitle: 'Custom Software Development',
  },
  {
    slug: 'inventory-management',
    title: 'Inventory Management',
    summary: 'Accurate stock oversight with demand visibility and process control.',
    problem: 'Inventory errors create lost sales, delays, and inaccurate financial reporting.',
    approach: 'We implement inventory workflows, stock monitoring, movement tracking, and reporting that support operational clarity.',
    relatedServiceSlug: 'database-solutions',
    relatedServiceTitle: 'Database Solutions',
  },
  {
    slug: 'employee-management',
    title: 'Employee Management',
    summary: 'People and operations data centralized for better planning and visibility.',
    problem: 'HR and operational data often remain fragmented across multiple systems.',
    approach: 'We build systems to manage employee information, onboarding, attendance, and role-based access with consistency.',
    relatedServiceSlug: 'web-development',
    relatedServiceTitle: 'Web Application Development',
  },
  {
    slug: 'customer-portals',
    title: 'Customer Portals',
    summary: 'Self-serve access that improves service delivery and data visibility.',
    problem: 'Customers need fast access to information without unnecessary internal overhead.',
    approach: 'We build secure portals for requests, updates, tracking, and document access tailored to your service model.',
    relatedServiceSlug: 'web-development',
    relatedServiceTitle: 'Web Application Development',
  },
  {
    slug: 'workflow-automation',
    title: 'Workflow Automation',
    summary: 'Automated business processes that remove repetitive manual work.',
    problem: 'Manual steps between systems create delays, errors, and staff burnout.',
    approach: 'We automate tasks, alerts, approvals, and handoffs across systems to improve speed and quality.',
    relatedServiceSlug: 'business-automation',
    relatedServiceTitle: 'Business Automation',
  },
  {
    slug: 'analytics-reporting',
    title: 'Analytics & Reporting',
    summary: 'Sensible business reporting built to support smarter decisions.',
    problem: 'Reporting is often inconsistent, delayed, or hidden inside manual spreadsheets.',
    approach: 'We create metrics dashboards and reporting flows that make performance visible and actionable.',
    relatedServiceSlug: 'dashboard-development',
    relatedServiceTitle: 'Dashboard Development',
  },
  {
    slug: 'document-management',
    title: 'Document Management',
    summary: 'Organized digital records and document workflows with governance in mind.',
    problem: 'Critical information becomes difficult to track, review, and retrieve.',
    approach: 'We structure document repositories, version control, access policies, and process automation around your compliance needs.',
    relatedServiceSlug: 'database-solutions',
    relatedServiceTitle: 'Database Solutions',
  },
  {
    slug: 'scheduling',
    title: 'Scheduling',
    summary: 'Operational scheduling systems that reduce overlaps and improve planning.',
    problem: 'Teams lose time to scheduling conflicts and inconsistent coordination.',
    approach: 'We create scheduling solutions with resource planning, calendars, and automation tailored to your operational patterns.',
    relatedServiceSlug: 'business-automation',
    relatedServiceTitle: 'Business Automation',
  },
  {
    slug: 'internal-tools',
    title: 'Internal Tools',
    summary: 'Practical internal systems that improve team speed and accountability.',
    problem: 'Simple operational tasks often rely on brittle spreadsheets or disconnected tools.',
    approach: 'We build purpose-built internal tools that reflect the way your team really works and remove administrative drain.',
    relatedServiceSlug: 'custom-software-development',
    relatedServiceTitle: 'Custom Software Development',
  },
]

export const industries: Industry[] = [
  { title: 'Manufacturing', summary: 'Production planning, inventory visibility, and operational automation for factories and supply networks.' },
  { title: 'Engineering', summary: 'Project coordination, technical workflows, and system integration for design and operations teams.' },
  { title: 'Healthcare', summary: 'Operational systems that support service workflows, records access, and process consistency.' },
  { title: 'Education', summary: 'Student, admin, and operational tools designed to improve efficiency and experience.' },
  { title: 'Logistics', summary: 'Route coordination, process automation, and tracking systems that support delivery operations.' },
  { title: 'Retail', summary: 'Business tools and customer-facing applications for transaction, stock, and service visibility.' },
  { title: 'Professional Services', summary: 'Delivery process management, client workflows, and internal productivity systems for service firms.' },
  { title: 'Real Estate', summary: 'Property processes, workflow tools, and dashboards tailored to operational and customer needs.' },
  { title: 'Startups & SMEs', summary: 'Scalable digital solutions that support growth without unnecessary complexity or overhead.' },
]

export const caseStudies: CaseStudy[] = [
  {
    slug: 'ssezi-returns',
    title: 'SSEZI Returns',
    label: 'Featured Project',
    categoryBadge: 'Logistics & Transportation',
    liveUrl: 'https://www.ssezireturns.com/',
    displayUrl: 'ssezireturns.com',
    overview: 'Designed and developed a modern digital platform for SSEZI Returns, a logistics and transportation business focused on customer returns, reverse pickups, fulfillment, distribution, and logistics solutions.',
    challenge: 'Managing reverse logistics, return pickups, and B2B vendor inquiries required a unified, authoritative digital presence that clearly explains multi-step pickup and inspection workflows.',
    approach: 'We mapped customer return cycles and fulfillment touchpoints, designing a streamlined interface that clarifies shipment tracking, operational capabilities, and contact points.',
    solution: 'A high-performance responsive web platform with intuitive service navigation, transparent workflow overviews, and direct enquiry pipelines for enterprise shippers.',
    technology: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Responsive Design'],
    architecture: 'Modern server-rendered frontend with optimized asset delivery, accessible component architecture, and responsive layouts.',
    outcome: 'Gave SSEZI Returns an enterprise-grade digital storefront that simplifies customer intake and boosts partner confidence.',
    tags: ['Website Development', 'Responsive Design'],
    feedback: '“The website gives SSEZI Returns a much more professional digital presence and makes it easier for our customers to understand our services and get in touch with us.”',
  },
  {
    slug: 'pratik-wellness',
    title: 'Pratik • Wellness Coach',
    label: 'Featured Project',
    categoryBadge: 'Health & Wellness',
    liveUrl: 'https://chipper-kangaroo-c51158.netlify.app/',
    displayUrl: 'chipper-kangaroo-c51158.netlify.app',
    overview: 'Designed and developed a modern wellness and lifestyle platform for Pratik, an Independent Herbalife Wellness Coach featuring personalized nutrition coaching, daily habit architecture, and 1-on-1 client support.',
    challenge: 'Conveying a calm, credible, and personalized coaching philosophy while organizing diverse offerings—nutrition plans, habit building, and community support—into an approachable client experience.',
    approach: 'Designed an editorial-style interface with earthy tones, clear program breakdowns, and interactive goal paths that inspire confidence and guide visitors toward booking consultations.',
    solution: 'An elegant, content-rich web experience with structured wellness offerings, transparent coaching principles, client stories, and immediate conversion funnels.',
    technology: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Editorial Typography'],
    architecture: 'Component-driven frontend optimized for smooth performance, mobile-first readability, and fast interactive touchpoints.',
    outcome: 'Equipped the coach with a signature digital space that educates prospective clients and significantly streamlines consultation bookings.',
    tags: ['Website Development', 'Responsive Design'],
    feedback: '“The platform gives my wellness coaching a calm, credible digital identity. Clients can easily understand my personalized approach and get in touch seamlessly.”',
  },
]

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-technology-around-business-processes',
    title: 'Building technology around business processes',
    category: 'Software Development',
    excerpt: 'Successful software starts with a clear understanding of how work actually happens inside an organization.',
    readTime: '5 min read',
    date: 'June 2026',
    content: [
      'Good software does not begin with code. It begins with business clarity. Before a feature is designed or a platform is developed, teams need to understand the real operational flow behind the work.',
      'This is especially important when businesses are dealing with fragmented systems, manual handoffs, or informal processes that only work because people are carrying them mentally. The right engineering approach is to map those realities first and then build digital systems around them.',
      'When the process is clear, the technology becomes easier to design, more reliable to implement, and more valuable to the business long term.',
    ],
    relatedServiceSlug: 'custom-software-development',
    relatedServiceTitle: 'Custom Software Development',
  },
  {
    slug: 'what-makes-an-api-reliable',
    title: 'What makes an API reliable',
    category: 'APIs',
    excerpt: 'Reliable APIs are not just technically sound—they are predictable, secure, and easy to integrate over time.',
    readTime: '6 min read',
    date: 'May 2026',
    content: [
      'A reliable API is built around clarity. It needs consistent contracts, predictable behavior, and a thoughtful approach to versioning and error handling.',
      'Security, observability, and maintainability are not afterthoughts. They are part of a strong API design strategy from the beginning.',
      'When organizations connect internal and external systems through well-designed interfaces, they reduce complexity and improve flexibility for future product growth.',
    ],
    relatedServiceSlug: 'web-development',
    relatedServiceTitle: 'Web Application Development',
  },
  {
    slug: 'when-dashboards-drive-better-decisions',
    title: 'When dashboards drive better decisions',
    category: 'Web Development',
    excerpt: 'A good dashboard does not overwhelm teams—it highlights the right signals and supports practical action.',
    readTime: '4 min read',
    date: 'April 2026',
    content: [
      'A dashboard should not be a dump of every available metric. Its purpose is to help teams understand what is happening quickly and take practical action without cognitive overload.',
      'Effective dashboards focus on actionable metrics, clear visual hierarchy, role-specific contexts, and automated reporting triggers.',
      'When organizations replace scattered spreadsheets with focused dashboards, decision speed and operational awareness improve noticeably.',
    ],
    relatedServiceSlug: 'dashboard-development',
    relatedServiceTitle: 'Dashboard Development',
  },
]

export const processSteps = [
  { number: '01', title: 'Discover', description: 'Understand requirements and business objectives.' },
  { number: '02', title: 'Plan', description: 'Define scope, architecture, technology, and milestones.' },
  { number: '03', title: 'Design', description: 'Create user flows, interfaces, and system structure.' },
  { number: '04', title: 'Develop', description: 'Build clean and maintainable software.' },
  { number: '05', title: 'Test', description: 'Validate functionality, usability, security, and reliability.' },
  { number: '06', title: 'Deploy', description: 'Launch the solution and provide ongoing support.' },
]

export const companyValues = [
  'Business-first approach',
  'Clean engineering',
  'Scalable architecture',
  'Security-conscious development',
  'Transparent communication',
  'Custom solutions',
  'Long-term support',
]

export const homeSolutions = [
  'Business Management Systems',
  'CRM Solutions',
  'Inventory Systems',
  'Customer Portals',
  'Workflow Automation',
  'Reporting Dashboards',
  'Employee Management',
  'Document Management',
  'Scheduling Systems',
  'Internal Business Tools',
]

export const homeProblems = [
  { question: 'Too much manual work?', answer: 'We can automate repetitive workflows.' },
  { question: 'Business data is scattered?', answer: 'We can centralize it into one system.' },
  { question: 'Using spreadsheets for everything?', answer: 'We can build a proper business application.' },
  { question: 'Existing systems do not communicate?', answer: 'We can integrate them through APIs.' },
  { question: 'Need better visibility?', answer: 'We can build dashboards and reporting systems.' },
]

export const faqs = [
  {
    question: 'What types of software solutions do you build?',
    answer:
      'We design and develop custom web applications, internal tools, ERP modules, CRM solutions, inventory systems, APIs and integrations, SaaS platforms, and automated workflow solutions for growing businesses.',
  },
  {
    question: 'How do you handle integrations with our existing tools?',
    answer:
      'We design secure REST APIs, webhooks, and database synchronization pipelines that connect your existing third-party platforms, ERPs, databases, and operational software seamlessly.',
  },
  {
    question: 'What is your typical project process and timeline?',
    answer:
      'We follow a structured 6-step lifecycle: Discover, Plan, Design, Develop, Test, and Deploy. Timelines typically range from 2–4 weeks for focused tools to 8–12 weeks for complex custom platforms.',
  },
  {
    question: 'Do you provide ongoing support after launch?',
    answer:
      'Yes. We offer maintenance, monitoring, security updates, feature enhancements, and cloud infrastructure support to ensure long-term stability and performance.',
  },
]

export const footerLinks = {
  quickLinks: [
    { label: 'All Services', to: '/services' },
    { label: 'Business Solutions', to: '/solutions' },
    { label: 'Client Work', to: '/work' },
    { label: 'Industry Expertise', to: '/industries' },
    { label: 'Development Process', to: '/process' },
    { label: 'Technology Stack', to: '/technologies' },
    { label: 'Insights & Articles', to: '/insights' },
    { label: 'About Synergy Brix', to: '/about' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact Us', to: '/contact' },
  ],
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/synergy-brix-721726433/' },
    { label: 'Instagram', href: 'https://www.instagram.com/synergy.brix' },
    { label: 'WhatsApp', href: 'https://wa.me/917972415528' },
  ],
}

export const pageMeta = {
  home: {
    title: 'Synergy Brix | Software Development & Technology Solutions',
    description:
      'Synergy Brix is a technology and software development company building custom web applications, software solutions, AI-powered tools, business automation, and scalable digital products.',
    canonical: `${SITE_URL}/`,
  },
  about: {
    title: 'About Synergy Brix | Technology Partner for Modern Business',
    description:
      'Learn about Synergy Brix, our founding team, and how we build business-first software, automation, and scalable digital systems for growing companies.',
    canonical: `${SITE_URL}/about`,
  },
  services: {
    title: 'Software Development & Technology Services | Synergy Brix',
    description:
      'Discover Synergy Brix services including custom software development, web applications, APIs, business automation, dashboards, SaaS platforms, cloud architecture, and databases.',
    canonical: `${SITE_URL}/services`,
  },
  solutions: {
    title: 'Business Solutions & Digital Systems | Synergy Brix',
    description:
      'Explore business solutions from Synergy Brix for operations, CRM, inventory, customer portals, automation, reporting, and internal tools.',
    canonical: `${SITE_URL}/solutions`,
  },
  industries: {
    title: 'Industry Solutions & Technology Support | Synergy Brix',
    description:
      'See how Synergy Brix supports manufacturing, engineering, healthcare, education, logistics, retail, services, real estate, and startups.',
    canonical: `${SITE_URL}/industries`,
  },
  work: {
    title: 'Client Work & Case Studies | Synergy Brix',
    description:
      'Browse selected project showcases from Synergy Brix, including live client case studies for logistics platforms and wellness coaching brands.',
    canonical: `${SITE_URL}/work`,
  },
  process: {
    title: 'Software Development Process & Delivery Model | Synergy Brix',
    description:
      'Learn how Synergy Brix approaches discovery, planning, design, development, testing, deployment, and ongoing support for business software.',
    canonical: `${SITE_URL}/process`,
  },
  technologies: {
    title: 'Technology Stack & Engineering Capabilities | Synergy Brix',
    description:
      'Review Synergy Brix technology capabilities across React, TypeScript, Java, Spring Boot, PostgreSQL, Docker, cloud deployment, and REST APIs.',
    canonical: `${SITE_URL}/technologies`,
  },
  insights: {
    title: 'Software & Technology Insights | Synergy Brix',
    description:
      'Explore practical articles on business software, automation, API design, architecture, digital transformation, and better technology decisions.',
    canonical: `${SITE_URL}/insights`,
  },
  contact: {
    title: 'Contact Synergy Brix | Software & IT Solutions',
    description:
      'Contact Synergy Brix for custom software development, business automation, web applications, CRM, ERP, APIs and IT solutions in Mumbai and Vasai-Virar.',
    canonical: `${SITE_URL}/contact`,
  },
  faq: {
    title: 'Frequently Asked Questions (FAQ) | Synergy Brix',
    description:
      'Find answers to common questions about custom software development, web applications, integrations, cloud hosting, automation, and project planning.',
    canonical: `${SITE_URL}/faq`,
  },
  privacy: {
    title: 'Privacy Policy | Synergy Brix',
    description:
      'Read the Synergy Brix privacy policy detailing data handling practices, security commitments, and operational privacy guidelines.',
    canonical: `${SITE_URL}/privacy`,
  },
  terms: {
    title: 'Terms & Conditions | Synergy Brix',
    description:
      'Read the Synergy Brix terms and conditions regarding software development services, project scopes, intellectual property, and service agreements.',
    canonical: `${SITE_URL}/terms`,
  },
}

export const contactTypes = [
  'Custom Software',
  'Web Application',
  'Automation',
  'Dashboard',
  'SaaS Product',
  'Cloud Solution',
  'Other',
]

export const budgetRanges = ['Under ₹2L', '₹2L - ₹5L', '₹5L - ₹15L', '₹15L - ₹30L', '₹30L+']

export const timelines = ['ASAP', 'Within 1 month', 'Within 3 months', 'Within 6 months', 'Flexible']
