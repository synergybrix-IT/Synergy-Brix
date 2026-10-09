import { blogPosts, caseStudies, faqs, serviceFaqs, services, vasaiFaqs } from '../src/data/siteData.ts'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Work', href: '/work' },
  { label: 'Industries', href: '/industries' },
  { label: 'Process', href: '/process' },
  { label: 'Technologies', href: '/technologies' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Vasai Web Development', href: '/website-development-company-in-vasai' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
]

const SERVICE_LINKS = [
  { label: 'Custom Software Development', href: '/services/custom-software-development' },
  { label: 'Web Application Development', href: '/services/web-development' },
  { label: 'Business Automation', href: '/services/business-automation' },
  { label: 'Dashboard Development', href: '/services/dashboard-development' },
  { label: 'SaaS Development', href: '/services/saas-development' },
  { label: 'Cloud Solutions', href: '/services/cloud-solutions' },
  { label: 'Database Solutions', href: '/services/database-solutions' },
]

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function nav() {
  const items = NAV_LINKS.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')
  return `<nav aria-label="Main navigation"><ul>${items}</ul></nav>`
}

function footer() {
  const items = NAV_LINKS.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')
  return `<footer><nav aria-label="Footer navigation"><ul>${items}</ul></nav><p>&copy; Synergy Brix. All rights reserved.</p></footer>`
}

export function buildSeoBody(path: string, title: string, description: string): string {
  const content = buildPageContent(path, title, description)
  return `${nav()}<main>${content}</main>${footer()}`
}

function buildPageContent(path: string, title: string, description: string): string {
  if (path === '/') return buildHome()
  if (path === '/services') return buildServicesIndex()
  if (path.startsWith('/services/')) return buildServiceDetail(path)
  if (path === '/solutions') return buildSolutions()
  if (path === '/industries') return buildIndustries()
  if (path === '/work') return buildWork()
  if (path.startsWith('/work/')) return buildCaseStudy(path)
  if (path === '/process') return buildProcess()
  if (path === '/technologies') return buildTechnologies()
  if (path === '/insights') return buildInsights()
  if (path.startsWith('/insights/')) return buildInsightDetail(path)
  if (path === '/website-development-company-in-vasai') return buildVasaiLanding()
  if (path === '/about') return buildAbout()
  if (path === '/contact') return buildContact()
  if (path === '/faq') return buildFAQ()
  if (path === '/privacy') return buildPrivacy()
  if (path === '/terms') return buildTerms()
  if (path === '/404') return `<h1>Page Not Found</h1><p>The page you requested does not exist or may have moved.</p><a href="/">Return to Synergy Brix</a>`
  return buildGeneric(title, description)
}

function buildVasaiLanding(): string {
  const questions = vasaiFaqs
    .map((faq) => `<section><h3>${esc(faq.q)}</h3><p>${esc(faq.a)}</p></section>`)
    .join('')
  return [
    `<nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; Website Development Company in Vasai</nav>`,
    `<h1>Website Development Company in Vasai</h1>`,
    `<p><strong>Website &amp; Software Development for Businesses in Vasai</strong></p>`,
    `<p>Synergy Brix helps businesses in Vasai and Vasai-Virar build modern websites, web applications and custom software solutions that improve their digital presence and business operations.</p>`,
    `<p><a href="/contact">Start a Project</a> | <a href="/services">View Our Services</a></p>`,

    `<section>`,
    `<h2>About Synergy Brix</h2>`,
    `<p>Synergy Brix is a software and technology company based and operating in the Vasai-Virar region. We serve local businesses, organizations, and growing enterprises with dependable, business-first technology solutions. We build high-performance websites and custom software engineered around actual workflows rather than generic templates. We focus on practical business solutions that eliminate manual friction, modernize digital presence, and create long-term operational value. Our capabilities include web applications, secure REST APIs, real-time dashboards, CRM and ERP systems, database architecture, and intelligent workflow automation.</p>`,
    `</section>`,

    `<section>`,
    `<h2>Website Development Services in Vasai</h2>`,
    `<ul>`,
    `<li><h3>Business Website Development</h3><p>Professional corporate websites designed to establish strong credibility and communicate your value proposition clearly. Engineered for fast load times, clear service presentation, and friction-free inquiry funnels that convert visitors into paying clients.</p></li>`,
    `<li><h3>Custom Web Applications</h3><p>Interactive, cloud-ready web applications built with modern frontend frameworks and robust backend architecture. Designed to digitize customer portals, employee workflows, and unique business processes that off-the-shelf software cannot accommodate.</p></li>`,
    `<li><h3>E-commerce Websites</h3><p>Secure, high-converting digital storefronts tailored for retail, wholesale, and direct-to-consumer businesses. Features structured product catalogs, payment gateway integration, smooth checkout flows, and inventory synchronization.</p></li>`,
    `<li><h3>Responsive Website Design</h3><p>Mobile-first, adaptable web experiences that look and function flawlessly across smartphones, tablets, laptops, and wide screens. Ensures local customers enjoy an intuitive, frictionless browsing experience regardless of device.</p></li>`,
    `<li><h3>Website Redesign</h3><p>Complete architectural and visual modernization for outdated websites that are slow, difficult to navigate, or unaligned with your current business goals. Upgrades speed, design aesthetics, SEO structure, and customer conversion pathways.</p></li>`,
    `<li><h3>Landing Pages</h3><p>High-impact, conversion-focused landing pages engineered specifically for digital marketing campaigns, product launches, or specific service offerings. Built with compelling layouts, clear value messaging, and optimized call-to-action triggers.</p></li>`,
    `<li><h3>Website Maintenance</h3><p>Proactive technical support, security patches, performance optimization, content updates, and server monitoring. Keeps your website secure, fast, and continuously operational without taking your focus away from running your business.</p></li>`,
    `</ul>`,
    `</section>`,

    `<section>`,
    `<h2>Custom Software Development in Vasai</h2>`,
    `<p>When standard website templates or off-the-shelf software packages are too restrictive for your daily operations, Synergy Brix builds bespoke software systems designed around your business workflows.</p>`,
    `<ul>`,
    `<li><strong>Custom Business Applications:</strong> Software tailored to your exact operational workflows, eliminating spreadsheet clutter and fragmented tools.</li>`,
    `<li><strong>REST APIs &amp; Integrations:</strong> Secure, predictable interfaces that connect your internal systems, third-party payment gateways, and partner tools.</li>`,
    `<li><strong>Admin Dashboards:</strong> Centralized control centers providing management teams with instant visibility over daily operations and activities.</li>`,
    `<li><strong>CRM Systems:</strong> Organized lead tracking, customer history, communication pipelines, and follow-up reminders tailored to your sales process.</li>`,
    `<li><strong>ERP Solutions:</strong> Integrated modules for inventory, billing, vendor tracking, and resource management designed to scale as you expand.</li>`,
    `<li><strong>Database-Driven Applications:</strong> Robust PostgreSQL and MySQL databases structured for integrity, relational queries, high throughput, and security.</li>`,
    `<li><strong>Authentication Systems:</strong> Multi-tiered role-based access control (RBAC), secure sessions, and audit logging to protect sensitive company data.</li>`,
    `<li><strong>Cloud Deployment:</strong> Containerized deployments with Docker, automated CI/CD pipelines, SSL encryption, and high-availability hosting.</li>`,
    `<li><strong>Reporting Dashboards:</strong> Real-time business intelligence and automated exportable reports to support informed, data-driven decisions.</li>`,
    `</ul>`,
    `</section>`,

    `<section>`,
    `<h2>Business Automation for Vasai Businesses</h2>`,
    `<p>Manual data entry, missed follow-ups, and repetitive clerical tasks drain valuable hours every week. We build automated digital workflows that connect your systems, save staff time, and prevent costly human oversights.</p>`,
    `<ul>`,
    `<li><strong>Enquiry Management:</strong> Centralize leads arriving from websites, WhatsApp, and email into an organized queue so no customer request is lost.</li>`,
    `<li><strong>Customer Follow-ups:</strong> Set automated reminder sequences, status updates, and milestone notifications to keep clients engaged without manual staff intervention.</li>`,
    `<li><strong>Appointment Workflows:</strong> Self-serve consultation booking with automated calendar confirmations, reminder alerts, and rescheduling links that drastically cut down no-shows.</li>`,
    `<li><strong>Invoice Generation:</strong> Trigger automatic bill generation upon milestone completion, deliver digital receipts to clients, and log transaction data without manual re-entry.</li>`,
    `<li><strong>Lead Management:</strong> Automatically assign inbound leads to specific sales representatives based on service interest, region, or urgency with immediate notifications.</li>`,
    `<li><strong>Reporting Dashboards:</strong> Consolidate operational metrics from different departments into automated daily or weekly executive summary reports delivered directly to management.</li>`,
    `<li><strong>Repetitive Administrative Processes:</strong> Eliminate repetitive copy-pasting of customer records between forms, spreadsheets, and messaging tools through direct system-level synchronization.</li>`,
    `</ul>`,
    `</section>`,

    `<section>`,
    `<h2>Who We Help in Vasai-Virar</h2>`,
    `<p>We design websites, web portals, and software systems that reflect the exact operational and customer interaction patterns of local commercial sectors:</p>`,
    `<ul>`,
    `<li><strong>Event Halls &amp; Banquets:</strong> Showcase hall amenities, photo galleries, package pricing, real-time date availability checkers, and direct event inquiry forms to secure bookings faster.</li>`,
    `<li><strong>Interior Designers &amp; Architects:</strong> High-resolution portfolio showcases, interactive before-and-after project comparisons, consultation booking funnels, and digital proposal review portals.</li>`,
    `<li><strong>Real Estate Businesses:</strong> Structured property listing directories, interactive location maps, project amenity overviews, inquiry capture funnels, and automated buyer follow-ups.</li>`,
    `<li><strong>Tiles &amp; Marble Businesses:</strong> Digital product catalogs with finish/dimension filters, sample request workflows, wholesale inquiry capture, and custom quote calculation tools.</li>`,
    `<li><strong>Automotive Businesses:</strong> Online vehicle service booking, spare parts inventory lookups, customer repair job tracking, and automated service maintenance reminder alerts.</li>`,
    `<li><strong>Professional Services:</strong> Credibility-first corporate websites, secure client document exchange portals, appointment scheduling tools, and service package calculators.</li>`,
    `<li><strong>Retail Businesses:</strong> Local online catalogs, WhatsApp-integrated order flows, customer loyalty tracking, and localized inventory visibility for walk-in and online buyers.</li>`,
    `<li><strong>Local Service Businesses:</strong> Transparent service menus, instant quote request forms, regional service area highlights, customer testimonials, and direct phone/WhatsApp calling.</li>`,
    `<li><strong>Startups:</strong> Rapid prototype and MVP development, modern full-stack web applications, scalable database schemas, and API architectures ready for venture scaling.</li>`,
    `<li><strong>Small and Medium Businesses (SMEs):</strong> Custom internal ERP/CRM tools, automated billing pipelines, employee management portals, and unified operations dashboards that replace chaotic spreadsheets.</li>`,
    `</ul>`,
    `</section>`,

    `<section>`,
    `<h2>Why Businesses in Vasai Choose a Local Technology Partner</h2>`,
    `<ul>`,
    `<li><strong>Easier Communication:</strong> Meet directly with the developers and software engineers building your solution. Avoid bureaucratic agency account managers and miscommunicated requirements.</li>`,
    `<li><strong>Understanding of Local Business Requirements:</strong> We understand the commercial realities, customer expectations, and operational rhythms of businesses across Vasai, Virar, and the Mumbai Metropolitan Region.</li>`,
    `<li><strong>Faster Discussions:</strong> Rapid feedback loops mean questions are answered quickly, scope adjustments are handled smoothly, and project delivery progresses without long delays.</li>`,
    `<li><strong>Customized Solutions:</strong> We do not force your company into rigid, pre-made templates. We architect software and websites around your genuine operational and sales workflows.</li>`,
    `<li><strong>Direct Support:</strong> Having a local technology partner means you have a real team you can contact directly whenever you need updates, security patches, or technical assistance.</li>`,
    `<li><strong>Scalable Technology:</strong> We build with clean code, modern frontend frameworks, and robust relational databases, ensuring your website or software can scale as your business grows.</li>`,
    `<li><strong>Practical Budgets for Small and Growing Businesses:</strong> Clear, transparent pricing structures tailored for small and medium businesses, giving you high-end software capabilities without enterprise overhead.</li>`,
    `</ul>`,
    `</section>`,

    `<section>`,
    `<h2>Our Technology &amp; Development Capabilities</h2>`,
    `<p>We engineer systems using proven, production-tested technologies:</p>`,
    `<ul>`,
    `<li><strong>React:</strong> Modern, component-driven interactive user interfaces.</li>`,
    `<li><strong>Java &amp; Spring Boot:</strong> Enterprise-grade backend services, high-performance microservices, and secure REST APIs.</li>`,
    `<li><strong>Node.js:</strong> Fast, asynchronous server-side runtime and API services.</li>`,
    `<li><strong>REST APIs:</strong> Clean, secure endpoints for system connectivity and integration.</li>`,
    `<li><strong>PostgreSQL &amp; MySQL:</strong> Reliable, ACID-compliant relational databases for structured data integrity.</li>`,
    `<li><strong>Cloud Deployment:</strong> Containerized deployments with Docker, CI/CD automation, SSL security, and scalable cloud hosting.</li>`,
    `<li><strong>Modern Frontend Development:</strong> TypeScript, responsive mobile layouts, and modern web architecture.</li>`,
    `</ul>`,
    `</section>`,

    `<section>`,
    `<h2>From Website to Business System</h2>`,
    `<ol>`,
    `<li><strong>01. Website:</strong> A modern, responsive website that builds strong brand credibility and establishes your online presence.</li>`,
    `<li><strong>02. Lead Capture:</strong> Structured contact forms, WhatsApp triggers, and conversion pathways that capture potential buyer intent.</li>`,
    `<li><strong>03. Database:</strong> A secure, structured database replacing scattered notebooks and spreadsheets with unified customer data.</li>`,
    `<li><strong>04. Admin Dashboard:</strong> A protected web dashboard for business owners to view, manage, and assign incoming customer requests.</li>`,
    `<li><strong>05. Automation:</strong> Automated confirmation emails, follow-up reminders, and status alerts triggered by customer actions.</li>`,
    `<li><strong>06. CRM / ERP:</strong> Comprehensive business software connecting customer relationships, inventory, billing, and staff tasks.</li>`,
    `<li><strong>07. Business Reporting:</strong> Real-time analytics and automated KPI reporting that provide clear signals for growth and optimization.</li>`,
    `</ol>`,
    `</section>`,

    `<section>`,
    `<h2>Serving Vasai-Virar and Nearby Business Areas</h2>`,
    `<p>Our engineering team is based in Vasai West and collaborates with commercial clients throughout the region, including:</p>`,
    `<ul>`,
    `<li><strong>Vasai:</strong> Central commercial hubs, retail streets, and local enterprise operations.</li>`,
    `<li><strong>Vasai East:</strong> Industrial zones including Waliv, Gokhivare, Sativali, and Fatherwadi.</li>`,
    `<li><strong>Vasai West:</strong> Core residential &amp; business sectors including Navghar, Ambadi Road, Stella, and Babhai.</li>`,
    `<li><strong>Virar:</strong> Virar East and West, Bolinj, Global City, and growing commercial corridors.</li>`,
    `<li><strong>Nalasopara:</strong> Nalasopara East, West, Achole, Tulinj, and surrounding commercial markets.</li>`,
    `<li><strong>Naigaon:</strong> Naigaon East, West, Juchandra, and emerging business developments.</li>`,
    `<li><strong>Vasai-Virar:</strong> The comprehensive municipal corporation area and neighboring business districts.</li>`,
    `</ul>`,
    `</section>`,

    `<section><h2>Frequently Asked Questions</h2>${questions}</section>`,

    `<section>`,
    `<h2>Start Your Website or Software Project</h2>`,
    `<p>Have an idea for a website, web application or business automation system? Talk to Synergy Brix about your requirements and explore a practical technology solution for your business.</p>`,
    `<p><a href="/contact">Discuss Your Project</a></p>`,
    `<address>Synergy Brix, Gonsalves Property, Near Alphonso Church, Behind Stella Petrol Pump, Vasai West, Maharashtra 401202 | Phone: +91 79724 15528 | Email: synergy.brix@gmail.com</address>`,
    `</section>`,
  ].join('')
}

function buildGeneric(title: string, description: string): string {
  return `<h1>${esc(title)}</h1><p>${esc(description)}</p>`
}

function buildHome(): string {
  const serviceLinks = services.map(
    (service) => `<li><a href="/services/${service.slug}"><h3>${esc(service.title)}</h3></a><p>${esc(service.short)}</p></li>`,
  ).join('')
  return [
    `<h1>Synergy Brix — Software Development &amp; Technology Solutions</h1>`,
    `<p><strong>Synergy Brix is a software and digital solutions company based in Vasai West, Maharashtra.</strong> We build business websites, custom web applications, APIs, workflow automation, dashboards, SaaS products, and database-backed tools around the way an organization works.</p>`,
    `<p>Our team works with businesses in Vasai-Virar, Mumbai, and beyond. Projects begin by understanding the business goal and existing process, then agreeing on scope, implementation, testing, and deployment. Explore our <a href="/services">software development services</a>, <a href="/work">selected project work</a>, or <a href="/about">company and team information</a>.</p>`,
    `<section><h2>Our Services</h2><ul>${serviceLinks}</ul><a href="/services">View all services</a></section>`,
    `<section><h2>Business Solutions</h2><p>Business Management, CRM, Inventory Management, Customer Portals, Workflow Automation, Reporting Dashboards, Employee Management, Document Management, Scheduling, Internal Tools.</p><a href="/solutions">Explore solutions</a></section>`,
    `<section><h2>Why Synergy Brix</h2><ul><li>Business-first approach</li><li>Clean engineering</li><li>Scalable architecture</li><li>Security-conscious development</li><li>Transparent communication</li><li>Custom solutions</li><li>Long-term support</li></ul></section>`,
    `<section><h2>Industries We Support</h2><p>Manufacturing, Engineering, Healthcare, Education, Logistics, Retail, Professional Services, Real Estate, Startups &amp; SMEs.</p><a href="/industries">See industry solutions</a></section>`,
    `<section><h2>Start a Project</h2><p>Have a business problem worth solving? Tell us what you need to improve, connect, or build.</p><a href="/contact">Contact us</a></section>`,
  ].join('')
}

function buildServicesIndex(): string {
  const cards = services.map(
    (service) =>
      `<article><h3><a href="/services/${service.slug}">${esc(service.title)}</a></h3><p>${esc(service.short)}</p><a href="/services/${service.slug}">Explore service</a></article>`,
  ).join('')
  return [
    `<h1>Software Development &amp; Technology Services</h1>`,
    `<p>Technology capabilities designed to solve real business challenges and support long-term growth.</p>`,
    `<p>We help organizations modernize operations, build custom software, connect systems, and create practical digital tools that scale with the business.</p>`,
    `<section>${cards}</section>`,
    `<section><h2>Have a business problem worth solving?</h2><p>Tell us what you need to improve, connect, or build. We'll help shape a practical way forward.</p><a href="/contact">Start a Project</a></section>`,
  ].join('')
}

function buildServiceDetail(path: string): string {
  const slug = path.replace('/services/', '')
  const svc = services.find((service) => service.slug === slug)
  if (!svc) return buildGeneric(slug, '')
  const featureList = svc.features.map((feature) => `<li>${esc(feature)}</li>`).join('')
  const techList = svc.technology.map((technology) => `<li>${esc(technology)}</li>`).join('')
  const questions = serviceFaqs[svc.slug]
    .map((faq) => `<article><h3>${esc(faq.question)}</h3><p>${esc(faq.answer)}</p></article>`)
    .join('')
  const otherLinks = SERVICE_LINKS.filter((l) => l.href !== path)
    .map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`)
    .join('')
  return [
    `<nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <a href="/services">Services</a> &gt; ${esc(svc.title)}</nav>`,
    `<h1>${esc(svc.title)}</h1>`,
    `<p>${esc(svc.short)}</p>`,
    `<section><h2>What does ${esc(svc.title)} help a business do?</h2><p>${esc(svc.solution)}</p></section>`,
    `<section><h2>Which business problem does it address?</h2><p>${esc(svc.problem)}</p></section>`,
    `<section><h2>What does the service include?</h2><ul>${featureList}</ul></section>`,
    `<section><h2>How do we approach ${esc(svc.title.toLowerCase())}?</h2><p>We start by understanding the workflow and requirements, agree on a practical scope and technical approach, then design, build, test, and deploy the solution. The exact implementation depends on your existing systems and project needs.</p></section>`,
    `<section><h2>Questions about ${esc(svc.title.toLowerCase())}</h2>${questions}</section>`,
    `<section><h2>Technologies</h2><ul>${techList}</ul></section>`,
    `<section><h2>Other Services</h2><ul>${otherLinks}</ul></section>`,
    `<p>See our <a href="/process">project delivery process</a> and <a href="/work">selected project work</a>.</p>`,
    `<a href="/contact">${esc(svc.title === 'Custom Software Development' ? 'Discuss a custom solution' : 'Start a Project')}</a>`,
  ].join('')
}

function buildSolutions(): string {
  const items = [
    { title: 'Business Management', summary: 'Operational workflows that unify teams, processes, and visibility.' },
    { title: 'CRM', summary: 'Customer relationship tools that bring pipeline, communication, and follow-up together.' },
    { title: 'Inventory Management', summary: 'Accurate stock oversight with demand visibility and process control.' },
    { title: 'Employee Management', summary: 'People and operations data centralized for better planning and visibility.' },
    { title: 'Customer Portals', summary: 'Self-serve access that improves service delivery and data visibility.' },
    { title: 'Workflow Automation', summary: 'Automated business processes that remove repetitive manual work.' },
    { title: 'Analytics & Reporting', summary: 'Sensible business reporting built to support smarter decisions.' },
    { title: 'Document Management', summary: 'Organized digital records and document workflows with governance in mind.' },
    { title: 'Scheduling', summary: 'Operational scheduling systems that reduce overlaps and improve planning.' },
    { title: 'Internal Tools', summary: 'Practical internal systems that improve team speed and accountability.' },
  ]
  const list = items.map((i) => `<li><h3>${esc(i.title)}</h3><p>${esc(i.summary)}</p></li>`).join('')
  return [
    `<h1>Business Solutions &amp; Digital Systems</h1>`,
    `<p>Explore business solutions from Synergy Brix for operations, CRM, inventory, customer portals, automation, reporting, and internal tools.</p>`,
    `<ul>${list}</ul>`,
  ].join('')
}

function buildIndustries(): string {
  const items = [
    'Manufacturing', 'Engineering', 'Healthcare', 'Education', 'Logistics', 'Retail', 'Professional Services', 'Real Estate', 'Startups & SMEs',
  ]
  const list = items.map((i) => `<li>${esc(i)}</li>`).join('')
  return [
    `<h1>Industry Solutions &amp; Technology Support</h1>`,
    `<p>See how Synergy Brix supports manufacturing, engineering, healthcare, education, logistics, retail, services, real estate, and startups.</p>`,
    `<ul>${list}</ul>`,
  ].join('')
}

function buildWork(): string {
  const projects = caseStudies
    .map(
      (project) =>
        `<li><a href="/work/${project.slug}"><h3>${esc(project.title)}</h3></a><p>${esc(project.overview)}</p></li>`,
    )
    .join('')
  return [
    `<h1>Client Work &amp; Case Studies</h1>`,
    `<p>Selected project showcases describe the client context, challenge, approach, and solution using available project information.</p>`,
    `<ul>${projects}</ul>`,
  ].join('')
}

function buildCaseStudy(path: string): string {
  const slug = path.replace('/work/', '')
  const project = caseStudies.find((item) => item.slug === slug)
  if (!project) return `<h1>Case study not found</h1>`
  return [
    `<nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <a href="/work">Work</a> &gt; ${esc(project.title)}</nav>`,
    `<h1>${esc(project.title)}</h1>`,
    `<p>${esc(project.overview)}</p>`,
    `<section><h2>Challenge</h2><p>${esc(project.challenge)}</p></section>`,
    `<section><h2>Approach</h2><p>${esc(project.approach)}</p></section>`,
    `<section><h2>Solution</h2><p>${esc(project.solution)}</p></section>`,
    `<section><h2>Technology</h2><p>${esc(project.technology.join(', '))}</p></section>`,
    `<section><h2>Architecture</h2><p>${esc(project.architecture)}</p></section>`,
    `<section><h2>Outcome</h2><p>${esc(project.outcome)}</p></section>`,
    project.liveUrl ? `<p><a href="${esc(project.liveUrl)}">View the live project website</a></p>` : '',
    `<p><a href="/work">Back to selected work</a> | <a href="/contact">Discuss a project</a></p>`,
  ].join('')
}

function buildProcess(): string {
  const steps = [
    { n: '01', t: 'Discover', d: 'Understand requirements and business objectives.' },
    { n: '02', t: 'Plan', d: 'Define scope, architecture, technology, and milestones.' },
    { n: '03', t: 'Design', d: 'Create user flows, interfaces, and system structure.' },
    { n: '04', t: 'Develop', d: 'Build clean and maintainable software.' },
    { n: '05', t: 'Test', d: 'Validate functionality, usability, security, and reliability.' },
    { n: '06', t: 'Deploy', d: 'Launch the solution and provide ongoing support.' },
  ]
  const list = steps.map((s) => `<li><strong>${s.n}. ${esc(s.t)}</strong> — ${esc(s.d)}</li>`).join('')
  return [
    `<h1>Software Development Process &amp; Delivery Model</h1>`,
    `<p>Learn how Synergy Brix approaches discovery, planning, design, development, testing, deployment, and ongoing support.</p>`,
    `<ol>${list}</ol>`,
  ].join('')
}

function buildTechnologies(): string {
  return [
    `<h1>Technology Stack &amp; Engineering Capabilities</h1>`,
    `<p>React, TypeScript, Java, Spring Boot, PostgreSQL, MySQL, Docker, Cloud deployment, CI/CD, REST APIs, HTML, CSS, Tailwind CSS.</p>`,
  ].join('')
}

function buildInsights(): string {
  const posts = [
    { title: 'Building technology around business processes', href: '/insights/building-technology-around-business-processes', excerpt: 'Successful software starts with a clear understanding of how work actually happens inside an organization.' },
    { title: 'What makes an API reliable', href: '/insights/what-makes-an-api-reliable', excerpt: 'Reliable APIs are not just technically sound—they are predictable, secure, and easy to integrate over time.' },
    { title: 'When dashboards drive better decisions', href: '/insights/when-dashboards-drive-better-decisions', excerpt: 'A good dashboard does not overwhelm teams—it highlights the right signals and supports practical action.' },
  ]
  const list = posts.map((p) => `<article><h3><a href="${p.href}">${esc(p.title)}</a></h3><p>${esc(p.excerpt)}</p></article>`).join('')
  return [
    `<h1>Software &amp; Technology Insights</h1>`,
    `<p>Explore practical articles on business software, automation, API design, and better technology decisions.</p>`,
    list,
  ].join('')
}

function buildInsightDetail(path: string): string {
  const slug = path.replace('/insights/', '')
  const post = blogPosts.find((item) => item.slug === slug)
  if (!post) return `<h1>Insight</h1>`
  const paras = post.content.map((p) => `<p>${esc(p)}</p>`).join('')
  const references = post.references?.length
    ? `<section><h2>Further reading</h2><ul>${post.references
        .map((reference) => `<li><a href="${esc(reference.url)}">${esc(reference.title)}</a></li>`)
        .join('')}</ul></section>`
    : ''
  const related = post.relatedServiceSlug && post.relatedServiceTitle
    ? `<section><h2>Related Capability</h2><p>Explore how Synergy Brix builds ${esc(post.relatedServiceTitle)} to support this work.</p><a href="/services/${post.relatedServiceSlug}">Explore ${esc(post.relatedServiceTitle)}</a></section>`
    : ''
  return [
    `<nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <a href="/insights">Insights</a> &gt; ${esc(post.title)}</nav>`,
    `<h1>${esc(post.title)}</h1>`,
    `<p>By <a href="/about">Synergy Brix</a></p>`,
    paras,
    references,
    related,
    `<p><a href="/insights">Back to all insights</a></p>`,
  ].join('')
}

function buildAbout(): string {
  return [
    `<h1>About Synergy Brix</h1>`,
    `<p>Synergy Brix is a technology and software development company founded by three IT professionals and based in Vasai West, Maharashtra. The team builds custom web applications, business software, automation, and digital products for growing businesses.</p>`,
    `<section><h2>Founding team</h2><ul><li>Nikhil Asuri — Co-Founder &amp; CEO</li><li>Atharva Patil — Co-Founder &amp; Co-CTO</li><li>Vedant Patil — Co-Founder &amp; Co-CTO</li></ul></section>`,
    `<p>We focus on understanding business workflows before selecting an implementation. Our work spans CRM and inventory tools, customer portals, dashboards, document workflows, APIs, and other purpose-built systems.</p>`,
    `<section><h2>Location and service area</h2><address>Gonsalves Property, Near Alphonso Church, Behind Stella Petrol Pump, Vasai West, Maharashtra 401202, India</address><p>Synergy Brix works with businesses in Vasai-Virar and Mumbai, as well as remote clients. <a href="/contact">Contact the team</a> or explore <a href="/website-development-company-in-vasai">website and software development in Vasai</a>.</p></section>`,
    `<section><h2>Our Values</h2><ul><li>Business-first approach</li><li>Clean engineering</li><li>Scalable architecture</li><li>Security-conscious development</li><li>Transparent communication</li><li>Custom solutions</li><li>Long-term support</li></ul></section>`,
  ].join('')
}

function buildContact(): string {
  return [
    `<h1>Contact Synergy Brix</h1>`,
    `<p>Contact Synergy Brix for custom software development, business automation, web applications, CRM, ERP, APIs and IT solutions in Mumbai and Vasai-Virar.</p>`,
    `<p>Get in touch to discuss your software project, automation idea, web application, or digital technology initiative. Share a few details and we will get back to you with the right next steps.</p>`,
    `<p>Email: <a href="mailto:synergy.brix@gmail.com">synergy.brix@gmail.com</a></p>`,
    `<p>Phone: <a href="tel:+917972415528">+91-79724-15528</a></p>`,
    `<section><h2>What We Can Help With</h2><ul><li><a href="/services/custom-software-development">Custom Software Development</a></li><li><a href="/services/web-development">Web Application Development</a></li><li><a href="/services/business-automation">Business Automation</a></li><li><a href="/services/dashboard-development">Dashboard Development</a></li><li><a href="/services/saas-development">SaaS Development</a></li><li><a href="/services/cloud-solutions">Cloud Solutions</a></li><li><a href="/services/database-solutions">Database Solutions</a></li></ul></section>`,
    `<section><h2>Business Solutions</h2><p>CRM, inventory management, customer portals, workflow automation, analytics, document management, scheduling, and internal tools.</p><a href="/solutions">Explore solutions</a></section>`,
    `<a href="/services">View our services</a>`,
  ].join('')
}

function buildFAQ(): string {
  const list = faqs
    .map((faq) => `<section><h2>${esc(faq.question)}</h2><p>${esc(faq.answer)}</p></section>`)
    .join('')
  return [
    `<h1>Frequently Asked Questions</h1>`,
    `<p>Find answers to common questions about custom software development, web applications, integrations, cloud hosting, automation, and project planning.</p>`,
    list,
  ].join('')
}

function buildPrivacy(): string {
  return [
    `<h1>Privacy Policy</h1>`,
    `<p>Privacy policy placeholder pending legal review by Synergy Brix.</p>`,
  ].join('')
}

function buildTerms(): string {
  return [
    `<h1>Terms &amp; Conditions</h1>`,
    `<p>Terms and conditions placeholder pending legal review by Synergy Brix.</p>`,
  ].join('')
}
