import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, MotionConfig, useMotionValue, useMotionTemplate, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Check,
  Sparkles,
  Code2,
  Mail,
  Phone,
  MapPin,
  Cloud,
  Database,
  BarChart3,
  Workflow,
  Globe2,
  Boxes,
  Compass,
  Rocket,
  Headphones,
  Plus,
  Minus,
  Building2,
  Quote,
  ExternalLink,
} from 'lucide-react'
import { FaLinkedinIn, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import {
  blogPosts,
  caseStudies,
  companyValues,
  footerLinks,
  faqs,
  homeProblems,
  homeSolutions,
  industries,
  pageMeta,
  services,
  solutions,
} from './data/siteData'
import { SITE_URL } from './config/siteUrl'
import { usePageMeta } from './hooks/usePageMeta'
import {
  PointerParallax,
  HowWeWork,
  WhyChoose,
  TechnologyStack,
  FloatingContactButton,
  HeroFloatingCards,
  RevealText,
  Magnetic,
  Marquee,
  Cursor,
  BgText,
  SectionIndex,
} from './components/premium'

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfULk7ZMRSZ9krewdbd1elEYa8jLu0qmj3051MAKiYAqxCHcw/viewform?usp=header'

const ALL_NAV = [
  { label: 'Home', id: 'home', to: '/#home' },
  { label: 'Services', id: 'services', to: '/#services' },
  { label: 'Solutions', id: 'solutions', to: '/solutions' },
  { label: 'Projects', id: 'projects', to: '/#projects' },
  { label: 'About', id: 'about', to: '/about' },
  { label: 'Contact', id: 'contact', to: '/#contact' },
]

/* ============================================================================
 * App shell
 * ========================================================================= */

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </MotionConfig>
  )
}

function AppShell() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      window.setTimeout(
        () => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'auto', block: 'start' }),
        0,
      )
      return
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.hash, location.pathname])

  return (
    <>
      <Cursor />
      <Preloader />
      <ScrollProgress />
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:slug" element={<CaseStudyPage />} />
              <Route path="/process" element={<ProcessPage />} />
              <Route path="/technologies" element={<TechnologiesPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/insights/:slug" element={<InsightDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy" element={<LegalPage type="privacy" />} />
              <Route path="/terms" element={<LegalPage type="terms" />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingContactButton />
      <FloatingContactWidget />
    </>
  )
}

/* ============================================================================
 * Navbar — premium floating, transparent → floating container
 * ========================================================================= */

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setIsServicesOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  useEffect(() => {
    const update = () => setIsCompact(window.scrollY > 40)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') return
    const sections = ALL_NAV
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.05, 0.25, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [location.pathname])

  const goToSection = (id: string) => {
    setActiveSection(id)
    setIsOpen(false)
    setIsServicesOpen(false)
    if (location.pathname !== '/') {
      navigate(`/#${id}`)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          y: 0,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 right-0 top-0 z-50 flex justify-center"
        style={{ pointerEvents: 'none' }}
      >
        <motion.div
          initial={false}
          animate={{
            width: isCompact ? 'min(94%, 1100px)' : 'min(96%, 1280px)',
            paddingTop: isCompact ? 10 : 18,
            paddingBottom: isCompact ? 10 : 18,
            backgroundColor: isCompact ? 'rgba(6, 8, 11, 0.72)' : 'rgba(6, 8, 11, 0)',
            borderColor: isCompact ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)',
            backdropFilter: isCompact ? 'blur(18px) saturate(150%)' : 'blur(0px)',
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-between rounded-full border px-5 sm:px-7"
          style={{ pointerEvents: 'auto' }}
        >
          <Link to="/#home" data-cursor="hover" aria-label="Synergy Brix home" className="group flex items-center gap-2.5">
            <BrandLogo />
            <div className="leading-none">
              <div className="text-[0.95rem] font-semibold tracking-tight text-white">Synergy Brix</div>
              <div className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-emerald-300/70">
                <span className="status-pulse mr-1.5 align-middle" />
                online
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {ALL_NAV.map((item) =>
              item.id === 'services' ? (
                <div key={item.id} className="relative">
                  <button
                    type="button"
                    aria-expanded={isServicesOpen}
                    aria-haspopup="menu"
                    onClick={() => setIsServicesOpen((open) => !open)}
                    data-cursor="hover"
                    className={`nav-underline flex items-center gap-1 text-[0.85rem] font-medium transition-colors ${location.pathname === '/' && activeSection === item.id ? 'text-emerald-300' : 'text-slate-300 hover:text-white'
                      }`}
                    data-active={(location.pathname === '/' && activeSection === item.id) || undefined}
                  >
                    {item.label}
                    <ChevronDown size={13} className={`transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="glass-panel absolute left-1/2 top-full mt-3 w-80 -translate-x-1/2 overflow-hidden rounded-2xl p-1.5 shadow-panel"
                      role="menu"
                    >
                      <Link
                        to="/#services"
                        onClick={() => setIsServicesOpen(false)}
                        className="mb-1 flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-500/8 px-3 py-2.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/14"
                        role="menuitem"
                      >
                        All services
                        <ArrowUpRight size={14} />
                      </Link>
                      {services.map((service) => (
                        <Link
                          key={service.slug}
                          to={`/services/${service.slug}`}
                          onClick={() => setIsServicesOpen(false)}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/4 hover:text-white"
                          role="menuitem"
                        >
                          {service.title}
                          <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100" />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToSection(item.id)}
                  data-cursor="hover"
                  className={`nav-underline text-[0.85rem] font-medium transition-colors ${location.pathname === '/' && activeSection === item.id
                    ? 'text-emerald-300'
                    : location.pathname.startsWith(item.to) && item.to !== '/'
                      ? 'text-emerald-300'
                      : 'text-slate-300 hover:text-white'
                    }`}
                  data-active={
                    (location.pathname === '/' && activeSection === item.id) ||
                    (item.to !== '/' && location.pathname.startsWith(item.to)) ||
                    undefined
                  }
                >
                  {item.label}
                </button>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <Magnetic>
                <LinkButton href={GOOGLE_FORM_URL} variant="primary" external icon={<ArrowRight size={15} />}>
                  Start a Project
                </LinkButton>
              </Magnetic>
            </div>
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/3 text-slate-200 transition hover:border-white/20 hover:bg-white/6 lg:hidden"
              aria-expanded={isOpen}
              aria-label="Open menu"
              onClick={() => setIsOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <span className="relative block h-3.5 w-4">
                <motion.span
                  className="absolute left-0 right-0 top-0 h-px bg-current"
                  animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  className="absolute left-0 right-0 bottom-0 h-px bg-current"
                  animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </span>
            </button>
          </div>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col overflow-y-auto px-6 pb-12 pt-28">
              <motion.nav
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
                className="space-y-2"
              >
                {ALL_NAV.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => goToSection(item.id)}
                      className="flex w-full items-end justify-between border-b border-white/6 py-5 text-left"
                    >
                      <span className="text-3xl font-semibold tracking-tightest text-white">{item.label}</span>
                      <ArrowUpRight className="text-slate-500" />
                    </button>
                  </motion.div>
                ))}
              </motion.nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.5 } }}
                className="mt-8"
              >
                <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-300/80">Services</h4>
                <div className="mt-3 grid grid-cols-1 gap-1">
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/4 hover:text-white"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.5 } }}
                className="mt-auto pt-10"
              >
                <LinkButton href={GOOGLE_FORM_URL} variant="primary" fullWidth external icon={<ArrowRight size={16} />}>
                  Start a Project
                </LinkButton>
                <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
                  <a href="mailto:synergy.brix@gmail.com" className="hover:text-white">synergy.brix@gmail.com</a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ============================================================================
 * Footer
 * ========================================================================= */

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 pt-24 text-slate-300">
      <div className="cta-grid absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-emerald-500/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-teal-500/10 blur-[120px]" />
      <Container className="relative">
        <div className="grid gap-14 pb-16 lg:grid-cols-[1.3fr_1fr_1.3fr]">
          <div>
            <Link to="/#home" className="group inline-flex items-center gap-3">
              <BrandLogo />
              <div className="leading-none">
                <div className="text-[1.05rem] font-semibold tracking-tight text-white">Synergy Brix</div>
                <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-emerald-300/70">Engineering for outcomes</div>
              </div>
            </Link>
            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
              Synergy Brix helps businesses modernize operations, build custom software, and engineer scalable digital systems around how work actually happens.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-300/80">Navigate</h3>
            <ul className="mt-5 flex flex-row flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-300">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} data-cursor="hover" className="group relative inline-flex items-center gap-1.5 transition hover:text-white">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100" />
                    <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-emerald-300 transition-all duration-500 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-300/80">Connect</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2.5"><Mail size={15} className="text-emerald-300" /> synergy.brix@gmail.com</li>

              <li className="flex items-center gap-2.5"><MapPin size={15} className="text-emerald-300" /> India • Remote-ready</li>
            </ul>
            <div className="mt-6 flex gap-3">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel={social.label === 'WhatsApp' ? 'noopener noreferrer' : 'noreferrer'}
                  data-cursor="hover"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-500/8 hover:text-emerald-200"
                  aria-label={social.label}
                >
                  {social.label.toLowerCase().includes('linkedin') ? (
                    <FaLinkedinIn size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  ) : social.label.toLowerCase().includes('whatsapp') ? (
                    <FaWhatsapp size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  ) : (
                    <FaInstagram size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="section-divider" />

        <div className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <div className="text-sm text-slate-500">© 2026 Synergy Brix. All rights reserved.</div>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link to="/privacy" className="hover:text-slate-300">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300">Terms</Link>
            <span className="hidden sm:inline">Built with discipline.</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}

/* ============================================================================
 * Home Page
 * ========================================================================= */

const HERO_PILLARS = ['Custom software', 'Automation', 'APIs', 'Cloud', 'Dashboards']

function HomeJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Synergy Brix',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.png`,
        },
        description:
          'Synergy Brix is a technology and software development company building custom web applications, software solutions, AI-powered tools, business automation, and scalable digital products.',
        sameAs: ['https://www.linkedin.com/in/synergy-brix-721726433/', 'https://www.instagram.com/synergy.brix'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'Synergy Brix',
        url: SITE_URL,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

function HomePage() {
  usePageMeta(pageMeta.home)

  return (
    <>
      <Hero />
      <HomeJsonLd />
      <Marquee
        items={[
          'Custom Software',
          'Web Applications',
          'APIs & Integrations',
          'Business Automation',
          'Dashboards & Reporting',
          'SaaS Platforms',
          'Cloud Architecture',
          'Database Systems',
        ]}
        className="border-y border-white/6 bg-ink-950 py-5"
      />
      <WhyChoose />
      <ServicesSpotlight />
      <ProblemsSection />
      <SolutionsBento />
      <IndustriesSection />
      <ProjectsSection />
      <HowWeWork />
      <TechnologyStack />
      <AboutValuesSection />
      <FAQPreview />
      <CTASection
        title="Have an idea worth building?"
        description="Let's turn it into a powerful digital solution."
        primaryLabel="Start Your Project"
        secondaryLabel="Talk to Us"
        primaryHref={GOOGLE_FORM_URL}
        secondaryHref={GOOGLE_FORM_URL}
      />
    </>
  )
}

/* ----- Hero ----- */

const architectureNodes = [
  { label: 'Web Apps', icon: Globe2, position: 'node-web' },
  { label: 'APIs', icon: Boxes, position: 'node-api' },
  { label: 'Automation', icon: Workflow, position: 'node-automation' },
  { label: 'Cloud', icon: Cloud, position: 'node-cloud' },
  { label: 'Database', icon: Database, position: 'node-database' },
  { label: 'Analytics', icon: BarChart3, position: 'node-analytics' },
]

function ArchitectureVisual() {
  return (
    <div className="architecture-visual" aria-label="Synergy Brix digital system architecture">
      <div className="architecture-grid" />
      <div className="architecture-aurora architecture-aurora-one" />
      <div className="architecture-aurora architecture-aurora-two" />
      <svg className="architecture-links" viewBox="0 0 600 520" role="img" aria-label="Connections from Synergy Brix to business technology systems">
        <defs>
          <linearGradient id="architecture-line" x1="0" x2="1">
            <stop stopColor="#34d399" stopOpacity=".12" />
            <stop offset=".5" stopColor="#6ee7b7" stopOpacity=".85" />
            <stop offset="1" stopColor="#34d399" stopOpacity=".12" />
          </linearGradient>
        </defs>
        {[
          'M286 239 C235 194 185 152 130 116',
          'M316 239 C366 191 414 148 474 116',
          'M270 273 C205 286 146 308 98 326',
          'M330 273 C389 296 437 319 489 348',
          'M284 285 C264 342 232 394 200 435',
          'M320 285 C356 340 395 393 435 430',
        ].map((path) => (
          <path key={path} className="architecture-link" d={path} />
        ))}
        <circle className="architecture-particle particle-web" cx="286" cy="239" r="3" />
        <circle className="architecture-particle particle-api" cx="316" cy="239" r="3" />
        <circle className="architecture-particle particle-automation" cx="270" cy="273" r="3" />
        <circle className="architecture-particle particle-cloud" cx="330" cy="273" r="3" />
        <circle className="architecture-particle particle-database" cx="284" cy="285" r="3" />
        <circle className="architecture-particle particle-analytics" cx="320" cy="285" r="3" />
      </svg>

      <div className="architecture-core">
        <div className="architecture-core-orbit" />
        <div className="architecture-core-inner">
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-emerald-200/80">Connected by</span>
          <span className="mt-1 block text-lg font-semibold tracking-[-0.04em] text-white">Synergy Brix</span>
          <span className="mt-2 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-emerald-300">
            <span className="status-pulse h-1.5 w-1.5 rounded-full bg-emerald-300" /> System core
          </span>
        </div>
      </div>

      {architectureNodes.map(({ label, icon: Icon, position }) => (
        <div key={label} className={`architecture-node ${position}`}>
          <div className="architecture-node-icon">
            <Icon size={18} strokeWidth={1.8} />
          </div>
          <span>{label}</span>
        </div>
      ))}
      <div className="architecture-caption">
        <span className="status-pulse h-1.5 w-1.5 rounded-full bg-emerald-300" /> Business systems, connected with intent
      </div>
    </div>
  )
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -70])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const cursorGlowX = useMotionValue(50)
  const cursorGlowY = useMotionValue(40)
  const reduce = useReducedMotionSafe()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      cursorGlowX.set(x)
      cursorGlowY.set(y)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [cursorGlowX, cursorGlowY, reduce])

  return (
    <section
      id="home"
      ref={ref}
      className="surface-canvas relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:min-h-screen lg:pt-44 lg:pb-28"
    >
      <div className="mesh-bg absolute inset-0" />
      <BgText className="-top-8 left-1/2 -translate-x-1/2 select-none">Synergy</BgText>

      {/* Cursor glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${cursorGlowX}% ${cursorGlowY}%, rgba(52, 211, 153, 0.12), transparent 50%)`,
        }}
      />
      {/* Ambient blobs with scroll parallax */}
      <motion.div style={{ y: y1 }} className="animate-blob-1 pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <motion.div style={{ y: y2 }} className="animate-blob-2 pointer-events-none absolute right-0 top-44 h-80 w-80 rounded-full bg-teal-400/12 blur-3xl" />
      <motion.div style={{ y: y3 }} className="animate-blob-1 pointer-events-none absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

      <Container className="relative">
        <motion.div ref={containerRef} style={{ opacity }} className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="flex flex-wrap items-center gap-3"
            >
              <HeroBrandMark />
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-white/4 px-3 py-1.5 text-[0.78rem] font-medium text-emerald-100 backdrop-blur-sm">
                <Sparkles size={12} className="text-emerald-300" />
                Technology built for real business needs
              </span>
            </motion.div>

            <h1 className="mt-7 max-w-3xl text-[clamp(2.6rem,6vw,5.25rem)] font-semibold leading-[0.98] tracking-tightest text-white">
              <RevealText as="span" delay={0.05} className="block">Synergy Brix</RevealText>
              <span className="block">
                <RevealText as="span" delay={0.18} className="text-white">Web, Software</RevealText>
              </span>
              <span className="block">
                <RevealText as="span" delay={0.32} className="text-emerald-200/90 font-serif-display italic">&amp; AI Development</RevealText>
              </span>
            </h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
              className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8"
            >
              Custom software, business automation, web applications, and digital systems — designed around the way your business actually works.
            </motion.p>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } } }}
              className="mt-4 max-w-xl text-sm leading-6 text-slate-400"
            >
              Synergy Brix is a technology and software development company specializing in custom web applications, software solutions, AI-powered tools, business automation, and scalable digital products.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Magnetic>
                <LinkButton href={GOOGLE_FORM_URL} variant="primary" external icon={<ArrowRight size={16} className="arrow-shift" />}>
                  Start a Project
                </LinkButton>
              </Magnetic>
              <Magnetic>
                <LinkButton href="/#services" variant="secondary">
                  Explore Our Services
                </LinkButton>
              </Magnetic>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="mt-10 flex flex-wrap gap-2 text-sm"
            >
              {HERO_PILLARS.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/8 bg-white/3 px-3.5 py-1.5 text-slate-300 backdrop-blur-sm transition hover:border-emerald-400/30 hover:bg-emerald-500/6 hover:text-emerald-200"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <PointerParallax strength={18} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative"
            >
              <ArchitectureVisual />
            </motion.div>
            <HeroFloatingCards />
          </PointerParallax>
        </motion.div>

        <ScrollIndicator />
      </Container>
    </section>
  )
}

/* ----- Services Spotlight (sticky scroll interaction) ----- */

function ServicesSpotlight() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const idx = Number((visible.target as HTMLElement).dataset.idx)
          if (!Number.isNaN(idx)) setActiveIdx(idx)
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0.05, 0.2, 0.5] },
    )
    itemRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const active = services[activeIdx]

  return (
    <section id="services" ref={sectionRef} className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
      <div className="dotted-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -right-40 top-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
      <Container className="relative">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <SectionIndex index="02" label="Services" />
            <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tightest text-white sm:text-5xl lg:text-6xl">
              What we build, <span className="font-serif-display italic text-emerald-200/90">end to end.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
              Focused software capabilities for businesses that need reliable, scalable, and well-engineered digital systems.
            </p>
          </div>
          <LinkButton href="/#services" variant="secondary" icon={<ArrowUpRight size={15} />}>
            All services
          </LinkButton>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Sticky detail panel */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel relative overflow-hidden rounded-3xl p-8 lg:p-10"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-300/80">
                    Service · {String(activeIdx + 1).padStart(2, '0')}/{String(services.length).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[0.7rem] text-slate-500">{active.slug}</span>
                </div>
                <h3 className="mt-6 text-3xl font-semibold tracking-tightest text-white sm:text-4xl">{active.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-300">{active.short}</p>
                <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-500/5 p-4">
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-emerald-300/80">Business problem</div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{active.problem}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {active.technology.slice(0, 4).map((tech) => (
                    <span key={tech} className="rounded-full border border-white/8 bg-white/3 px-3 py-1 text-xs text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <LinkButton href={`/services/${active.slug}`} variant="primary" icon={<ArrowRight size={15} className="arrow-shift" />}>
                    Explore service
                  </LinkButton>
                  <span className="text-xs text-slate-500">Scroll to see all</span>
                </div>
                {/* Decorative gradient */}
                <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Scrolling list */}
          <ul className="relative">
            <div className="absolute left-0 top-0 bottom-0 hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />
            {services.map((service, i) => {
              const isActive = i === activeIdx
              return (
                <li
                  key={service.slug}
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  data-idx={i}
                  className="relative border-b border-white/6"
                >
                  <div className={`relative grid grid-cols-[auto_1fr_auto] items-start gap-5 py-9 transition-all duration-500 lg:pl-10 ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-90'}`}>
                    <div className="font-mono text-[0.75rem] tracking-[0.18em] text-emerald-300/80 pt-1.5">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-semibold tracking-tightest sm:text-3xl ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {service.title}
                      </h3>
                      <p className="mt-2 max-w-lg text-sm leading-7 text-slate-400">{service.short}</p>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="mt-4 flex flex-wrap gap-2 lg:hidden"
                        >
                          {service.technology.slice(0, 4).map((tech) => (
                            <span key={tech} className="rounded-full border border-white/8 bg-white/3 px-3 py-1 text-xs text-slate-300">
                              {tech}
                            </span>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    <div className="pt-2 text-slate-500 transition-all duration-500 group-hover:text-emerald-300">
                      {isActive ? <ArrowRight size={20} className="text-emerald-300" /> : <Plus size={18} />}
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="service-active-bar"
                        className="absolute -left-px top-9 hidden h-[calc(100%-4.5rem)] w-px bg-gradient-to-b from-emerald-400 via-emerald-300 to-transparent lg:block"
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}

/* ----- Problems ----- */

function ProblemsSection() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 lg:py-32">
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-60" />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionIndex index="03" label="Business value" />
            <h2 className="mt-6 text-4xl font-semibold tracking-tightest text-white sm:text-5xl">
              Problems <span className="font-serif-display italic text-emerald-200/90">we solve.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
              We don't add technology for the sake of it. We solve real business challenges by removing friction and improving operations.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {homeProblems.map((problem, i) => (
              <motion.div
                key={problem.question}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="card-lift group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-5"
                data-cursor="hover"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-300 transition group-hover:scale-110">
                    <Check size={14} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">{problem.question}</h3>
                    <div className="mt-3 flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-emerald-300/80">
                      <ArrowRight size={11} /> Technology solution
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-slate-300">{problem.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ----- Solutions bento ----- */

function SolutionsBento() {
  return (
    <section id="solutions" className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
      <div className="dotted-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-teal-500/10 blur-[100px]" />
      <Container className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionIndex index="04" label="Solutions" />
            <h2 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tightest text-white sm:text-5xl lg:text-6xl">
              Business systems that <span className="font-serif-display italic text-emerald-200/90">create momentum.</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-slate-400 lg:text-right">
            We design digital tools around the outcomes businesses need: smoother operations, better reporting, and scalable internal capability.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {homeSolutions.map((solution, i) => (
            <motion.div
              key={solution}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.06 }}
              data-cursor="hover"
              className="card-lift group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-4 text-sm font-medium text-slate-200"
            >
              <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-emerald-300/70">0{i + 1}</div>
              <div className="mt-3">{solution}</div>
              <ArrowUpRight size={14} className="mt-4 text-slate-600 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald-300" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ----- Industries ----- */

const INDUSTRY_ICONS: Record<string, typeof Globe2> = {
  Manufacturing: Workflow,
  Engineering: Compass,
  Healthcare: Check,
  Education: Sparkles,
  Logistics: Boxes,
  Retail: BarChart3,
  'Professional Services': Headphones,
  'Real Estate': Building2,
  'Startups & SMEs': Rocket,
}

function IndustriesSection() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 lg:py-32">
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-50" />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-end">
          <div>
            <SectionIndex index="05" label="Industries" />
            <h2 className="mt-6 text-4xl font-semibold tracking-tightest text-white sm:text-5xl">
              Built for the way <span className="font-serif-display italic text-emerald-200/90">you work.</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-slate-400">
            We help organizations solve operational pain points with flexible digital systems suited to their domain.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => {
            const Icon = INDUSTRY_ICONS[industry.title] || Compass
            return (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
                data-cursor="hover"
                className="card-lift group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-500/8 text-emerald-300 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:border-emerald-400/40">
                    <Icon size={18} />
                  </div>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">{industry.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{industry.summary}</p>
                <div className="mt-5 flex items-center gap-2 text-xs text-slate-500 transition group-hover:text-emerald-300">
                  <span>Domain support</span>
                  <ArrowRight size={12} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

/* ----- Projects (home showcase) ----- */

function ProjectsSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = caseStudies[activeIdx]

  return (
    <section id="projects" className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
      <div className="dotted-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-emerald-500/8 blur-[140px]" />
      <Container className="relative">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionIndex index="06" label="Our Work" />
            <h2 className="mt-6 max-w-xl text-4xl font-semibold tracking-tightest text-white sm:text-5xl lg:text-6xl">
              Built for <span className="font-serif-display italic text-emerald-200/90">real businesses.</span>
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-400">
              A selection of client work designed to create a clearer, more confident digital presence.
            </p>
          </div>
          <LinkButton href="/work" variant="secondary" icon={<ArrowUpRight size={15} />}>
            All projects
          </LinkButton>
        </div>

        {/* Tab selectors */}
        <div className="mt-10 flex flex-wrap gap-3">
          {caseStudies.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setActiveIdx(i)}
              data-cursor="hover"
              className={`rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide transition-all duration-300 ${
                i === activeIdx
                  ? 'border-emerald-400/60 bg-emerald-500/12 text-emerald-300'
                  : 'border-white/10 bg-white/3 text-slate-400 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Main panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 grid gap-0 overflow-hidden rounded-2xl border border-white/8 bg-ink-900 lg:grid-cols-[1fr_0.9fr]"
          >
            {/* Left — browser mockup */}
            <div className="relative flex flex-col overflow-hidden border-b border-white/8 lg:border-b-0 lg:border-r">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-2 border-b border-white/8 bg-ink-800 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                <div className="ml-2 flex flex-1 items-center gap-2 rounded-md border border-white/10 bg-ink-950 px-3 py-1">
                  <Globe2 size={10} className="shrink-0 text-slate-500" />
                  <span className="truncate font-mono text-[0.6rem] text-slate-500">{active.displayUrl ?? active.liveUrl}</span>
                </div>
              </div>
              {/* Iframe embed */}
              <div className="relative h-72 w-full overflow-hidden sm:h-80 lg:h-[420px]">
                {active.liveUrl ? (
                  <iframe
                    src={active.liveUrl}
                    title={active.title}
                    className="h-[150%] w-[150%] origin-top-left scale-[0.667] border-0"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-600 text-sm">Preview unavailable</div>
                )}
                {/* gradient fade bottom */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-ink-900 to-transparent" />
              </div>
            </div>

            {/* Right — project details */}
            <div className="flex flex-col justify-between gap-6 p-7 lg:p-9">
              {/* Badges */}
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-emerald-300">
                    {active.label}
                  </span>
                  {active.categoryBadge && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-slate-400">
                      {active.categoryBadge}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-2xl font-semibold tracking-tightest text-white sm:text-3xl">
                  {active.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{active.overview}</p>

                {/* Tags */}
                {active.tags && active.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {active.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTAs */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {active.liveUrl && (
                    <a
                      href={active.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400"
                    >
                      View Live Website <ExternalLink size={12} />
                    </a>
                  )}
                  <Link
                    to={`/work/${active.slug}`}
                    data-cursor="hover"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 transition hover:text-white"
                  >
                    View case study <ArrowRight size={13} className="arrow-shift" />
                  </Link>
                </div>
              </div>

              {/* Client feedback */}
              {active.feedback && (
                <div className="rounded-xl border border-emerald-400/15 bg-emerald-500/5 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Quote size={13} className="text-emerald-400" />
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-emerald-300/80">
                      Client Feedback
                    </span>
                  </div>
                  <p className="text-sm italic leading-6 text-slate-300">{active.feedback}</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  )
}

/* ----- About values (editorial list) ----- */

function AboutValuesSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
      <div className="cta-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-500/8 blur-[100px]" />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionIndex index="08" label="About Synergy Brix" />
            <h2 className="mt-6 text-4xl font-semibold tracking-tightest text-white sm:text-5xl">
              Structured for <span className="font-serif-display italic text-emerald-200/90">long-term</span> value.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
              SYNERGYBRIX helps growing businesses make technology simpler, smarter, and more accessible through practical digital solutions.
            </p>
            <div className="mt-7">
              <LinkButton href="/about" variant="secondary" icon={<ArrowRight size={15} className="arrow-shift" />}>
                More About Us
              </LinkButton>
            </div>
          </div>
          <ul className="relative grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {companyValues.map((value, i) => (
              <motion.li
                key={value}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-4 border-b border-white/6 py-5"
              >
                <span className="font-mono text-[0.7rem] tracking-[0.18em] text-emerald-300/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium text-slate-200 transition group-hover:text-white">{value}</span>
                <ArrowUpRight size={14} className="ml-auto text-slate-600 transition group-hover:text-emerald-300" />
              </motion.li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

/* ----- FAQ preview ----- */

function FAQPreview() {
  const [openIdx, setOpenIdx] = useState(0)
  const previewFaqs = faqs.slice(0, 5)
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
      <div className="dotted-grid pointer-events-none absolute inset-0 opacity-30" />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionIndex index="09" label="FAQ" />
            <h2 className="mt-6 text-4xl font-semibold tracking-tightest text-white sm:text-5xl">
              Questions, <span className="font-serif-display italic text-emerald-200/90">answered.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
              Common answers about software development, integration, automation, cloud deployment, maintenance, and project planning.
            </p>
            <LinkButton href="/faq" variant="secondary" className="mt-8" icon={<ArrowUpRight size={15} />}>
              All questions
            </LinkButton>
          </div>
          <div>
            <ul className="border-t border-white/8">
              {previewFaqs.map((faq, i) => {
                const isOpen = openIdx === i
                return (
                  <li key={faq.question} className="border-b border-white/8">
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? -1 : i)}
                      data-cursor="hover"
                      className="group flex w-full items-start justify-between gap-6 py-5 text-left"
                    >
                      <span className="text-base font-medium text-white sm:text-lg">{faq.question}</span>
                      <span className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-emerald-300 transition-all duration-500 ${isOpen ? 'rotate-180 border-emerald-400/40 bg-emerald-500/10' : 'group-hover:border-emerald-400/30'}`}>
                        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-6 pr-12 text-sm leading-7 text-slate-300">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ============================================================================
 * Pages
 * ========================================================================= */

function AboutPage() {
  usePageMeta(pageMeta.about)
  const founders = [
    {
      name: 'Nikhil Asuri',
      role: 'Co-Founder & CEO',
    },
    {
      name: 'Atharva Patil',
      role: 'Co-Founder & Co-CTO',
    },
    {
      name: 'Vedant Patil',
      role: 'Co-Founder & Co-CTO',
    },
  ]

  return (
    <div className="bg-ink-950">
      <PageHero
        eyebrow="01 — About"
        title={
          <>
            Technology that <span className="font-serif-display italic text-emerald-200/90">works</span> for your business.
          </>
        }
        subtitle="SYNERGYBRIX is a technology company founded by three young IT professionals with a shared vision — to make business technology simpler, smarter, and more accessible for growing businesses."
        description="We work with SMEs and mid-sized businesses to build practical digital solutions that help them manage their operations, customers, employees, data, and workflows more efficiently."
      />

      <Container className="py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-start">
          <div>
            <SectionIndex index="02" label="What we do" />
            <h2 className="mt-6 text-4xl font-semibold tracking-tightest text-white sm:text-5xl">
              Practical technology for <span className="font-serif-display italic text-emerald-200/90">real work.</span>
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-slate-300 sm:text-lg">
            <p>
              From CRM and inventory management to workflow automation, analytics, customer portals, document management, and scheduling systems, we focus on creating technology that solves real business problems rather than adding unnecessary complexity.
            </p>
            <p className="font-medium text-emerald-200">Built by three minds. Driven by one vision.</p>
          </div>
        </div>

        <div className="mt-24">
          <SectionIndex index="03" label="The founding team" />
          <h2 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tightest text-white sm:text-5xl">
            Complementary strengths. <span className="font-serif-display italic text-emerald-200/90">One direction.</span>
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {founders.map((founder, index) => (
              <motion.article
                key={founder.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="card-lift rounded-3xl border border-white/8 bg-white/3 p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 font-serif-display text-2xl text-emerald-200">
                  {founder.name[0]}
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-white">{founder.name}</h3>
                <p className="mt-1 text-sm font-medium text-emerald-200">{founder.role}</p>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-24 grid gap-5 lg:grid-cols-2">
          <InfoPanel
            title="Why SYNERGYBRIX?"
            text="We believe technology shouldn't be complicated just because the business is growing. We take the time to understand how a business actually operates, identify where time and resources are being lost, and create technology that fits the way the business works."
          />
          <InfoPanel title="Our approach" text="Understand → Build → Implement → Improve. We're starting lean, working closely with our clients, and building SYNERGYBRIX with a long-term vision — to become a trusted technology partner for businesses looking to digitize, automate, and grow." />
          <InfoPanel title="Our Vision" text="To empower growing businesses with technology that makes everyday operations simpler, smarter, and more efficient." />
          <InfoPanel title="Our Mission" text="To build practical, scalable, and affordable technology solutions that solve real business problems and create measurable value for our clients." />
        </div>

        <p className="mt-20 text-center font-serif-display text-3xl italic text-emerald-200/90 sm:text-4xl">
          SYNERGYBRIX — Where business needs meet technology.
        </p>
      </Container>
    </div>
  )
}

function ServicesPage() {
  usePageMeta(pageMeta.services)
  return (
    <div className="bg-ink-950">
      <PageHero
        eyebrow="02 — Services"
        title={
          <>
            Technology that <span className="font-serif-display italic text-emerald-200/90">moves</span> your business forward.
          </>
        }
        subtitle="Technology capabilities designed to solve real business challenges and support long-term growth."
        description="We help organizations modernize operations, build custom software, connect systems, and create practical digital tools that scale with the business."
      />
      <Container className="pb-24 lg:pb-32">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>
      </Container>
      <CTASection
        title="Have a business problem worth solving?"
        description="Tell us what you need to improve, connect, or build. We'll help shape a practical way forward."
        primaryLabel="Start a Project"
        secondaryLabel="Talk to Us"
        primaryHref={GOOGLE_FORM_URL}
        secondaryHref={GOOGLE_FORM_URL}
      />
    </div>
  )
}

function ServiceDetailPage() {
  const { slug } = useParams()
  const service = services.find((item) => item.slug === slug)

  usePageMeta({
    title: service ? `${service.title} | Synergy Brix` : 'Page Not Found | Synergy Brix',
    description: service ? service.short : 'The page you requested could not be found.',
    canonical: service ? `${SITE_URL}/services/${service.slug}` : `${SITE_URL}/404`,
  })

  if (!service) return <NotFoundPage />

  return (
    <div className="bg-ink-950">
      <PageHero
        eyebrow={`Service · ${slug}`}
        title={service.title}
        subtitle={service.short}
        breadcrumbs={[{ label: 'Services', to: '/#services' }, { label: service.title }]}
      />
      <Container className="pb-24 lg:pb-32">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel rounded-3xl p-8 lg:p-10">
            <SectionColumn title="Business problem" body={service.problem} />
            <SectionColumn title="Our solution" body={service.solution} />
            <div>
              <h3 className="text-lg font-semibold text-white">What we provide</h3>
              <ul className="mt-4 space-y-2 text-slate-300">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-6">
                    <Check className="mt-1 text-emerald-300" size={14} /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-8">
              <h3 className="text-lg font-semibold text-white">Technology approach</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.technology.map((tech) => (
                  <span key={tech} className="rounded-full border border-white/8 bg-white/3 px-3 py-1.5 text-sm text-slate-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 via-emerald-500/8 to-transparent p-8">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
              <h4 className="text-xl font-semibold text-white">Ready to move forward?</h4>
              <p className="mt-2 text-sm leading-6 text-emerald-100">We can help shape the right technology approach for your goals.</p>
              <LinkButton href={GOOGLE_FORM_URL} variant="primary" external className="mt-6" icon={<ArrowRight size={15} className="arrow-shift" />}>
                {service.cta}
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

function SolutionsPage() {
  usePageMeta(pageMeta.solutions)
  return (
    <div className="bg-ink-950">
      <PageHero
        eyebrow="03 — Solutions"
        title={
          <>Outcomes that <span className="font-serif-display italic text-emerald-200/90">compound.</span></>
        }
        subtitle="Business-oriented systems designed to improve visibility, efficiency, and control."
        description="We build digital solutions around business outcomes — streamlining operations, connecting teams, and making the right information accessible."
      />
      <Container className="pb-24 lg:pb-32">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {solutions.map((solution, i) => (
            <motion.div
              key={solution.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              data-cursor="hover"
              className="card-lift group relative-sweep relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-300/80">Solution</span>
                <ArrowUpRight size={16} className="text-slate-500 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald-300" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{solution.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{solution.summary}</p>
              <div className="mt-5 space-y-4">
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-emerald-300/80">Business problem</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{solution.problem}</p>
                </div>
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-emerald-300/80">Potential solution</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{solution.approach}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  )
}

function IndustriesPage() {
  usePageMeta(pageMeta.industries)
  return (
    <div className="bg-ink-950">
      <PageHero
        eyebrow="04 — Industries"
        title={
          <>Real environments, <span className="font-serif-display italic text-emerald-200/90">real systems.</span></>
        }
        subtitle="Flexible technology support for businesses operating in complex environments."
        description="We design software and systems that reflect the realities of each industry, from operational workflows to customer interactions and reporting needs."
      />
      <Container className="pb-24 lg:pb-32">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((industry, i) => {
            const Icon = INDUSTRY_ICONS[industry.title] || Compass
            return (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                data-cursor="hover"
                className="card-lift group relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-500/8 text-emerald-300 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                    <Icon size={18} />
                  </div>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">{industry.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{industry.summary}</p>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}

function WorkPage() {
  usePageMeta(pageMeta.work)
  return (
    <div className="bg-ink-950">
      <PageHero
        eyebrow="05 — Work"
        title={
          <>Selected <span className="font-serif-display italic text-emerald-200/90">work.</span></>
        }
        subtitle="Real client projects designed to create impactful digital experiences."
        description="Two live websites built for real businesses — from logistics platforms to wellness coaching brands."
      />
      <Container className="pb-24 lg:pb-32">
        <div>
          {caseStudies.map((project, i) => (
            <Link
              key={project.slug}
              to={`/work/${project.slug}`}
              data-cursor="view"
              data-cursor-label="View"
              className="work-row group block"
            >
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 sm:gap-10">
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-300/80">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">{project.label}</div>
                  <h3 className="work-title mt-2 text-2xl font-semibold tracking-tightest text-white sm:text-4xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{project.overview}</p>
                </div>
                <div className="work-arrow grid h-12 w-12 place-items-center rounded-full border border-white/8 bg-white/3 text-slate-300 transition group-hover:border-emerald-400/40 group-hover:bg-emerald-500/8 group-hover:text-emerald-300">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  )
}

function CaseStudyPage() {
  const { slug } = useParams()
  const item = caseStudies.find((entry) => entry.slug === slug)
  usePageMeta({
    title: item ? `${item.title} | Synergy Brix` : 'Not Found | Synergy Brix',
    description: item ? item.overview : 'The page you requested does not exist or may have moved.',
    canonical: item ? `${SITE_URL}/work/${item.slug}` : `${SITE_URL}/404`,
  })
  if (!item) return <NotFoundPage />

  return (
    <div className="bg-ink-950">
      <PageHero
        eyebrow={item.label}
        title={item.title}
        subtitle={item.overview}
        breadcrumbs={[{ label: 'Work', to: '/work' }, { label: item.title }]}
      />
      <Container className="pb-24 lg:pb-32">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-panel rounded-3xl p-8">
            <SectionColumn title="Overview" body={item.overview} />
            <SectionColumn title="Challenge" body={item.challenge} />
            <SectionColumn title="Approach" body={item.approach} />
          </div>
          <div className="glass-panel rounded-3xl p-8">
            <SectionColumn title="Solution" body={item.solution} />
            <SectionColumn title="Technology" body={item.technology.join(', ')} />
            <SectionColumn title="Architecture" body={item.architecture} />
            <SectionColumn title="Outcome" body={item.outcome} />
            {item.liveUrl && (
              <div className="mt-6">
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400"
                >
                  View Live Website <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

function ProcessPage() {
  usePageMeta(pageMeta.process)
  return (
    <div className="bg-ink-950">
      <PageHero
        eyebrow="06 — Process"
        title={
          <>A clear, <span className="font-serif-display italic text-emerald-200/90">business-aligned</span> process.</>
        }
        subtitle="A clear, business-aligned development process."
        description="We follow a structured delivery model that keeps technical quality, communication, and business understanding aligned throughout the project lifecycle."
      />
      <Container className="pb-24 lg:pb-32">
        <div className="grid gap-5 lg:grid-cols-2">
          {[
            { number: '01', title: 'Discover', description: 'Understand requirements and business objectives.' },
            { number: '02', title: 'Plan', description: 'Define scope, architecture, technology, and milestones.' },
            { number: '03', title: 'Design', description: 'Create user flows, interfaces, and system structure.' },
            { number: '04', title: 'Develop', description: 'Build clean and maintainable software.' },
            { number: '05', title: 'Test', description: 'Validate functionality, usability, security, and reliability.' },
            { number: '06', title: 'Deploy', description: 'Launch the solution and provide ongoing support.' },
          ].map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.06 }}
              data-cursor="hover"
              className="card-lift group relative flex items-start gap-5 rounded-2xl border border-white/8 bg-white/3 p-6"
            >
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-emerald-300/80">
                {step.number}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  )
}

function TechnologiesPage() {
  usePageMeta(pageMeta.technologies)
  const groups = [
    { title: 'Frontend', items: ['React', 'TypeScript', 'HTML', 'CSS', 'JavaScript'] },
    { title: 'Backend', items: ['Java', 'Spring Boot', 'REST APIs'] },
    { title: 'Databases', items: ['PostgreSQL', 'MySQL'] },
    { title: 'APIs', items: ['REST API Design', 'API Integration', 'System Connectivity'] },
    { title: 'Security', items: ['Authentication', 'Authorization', 'JWT', 'Role-Based Access Control'] },
    { title: 'Cloud', items: ['Docker', 'Cloud Deployment', 'CI/CD-ready architecture'] },
    { title: 'DevOps', items: ['Version Control', 'Environment readiness', 'Deployment support', 'Monitoring preparation'] },
  ]
  return (
    <div className="bg-ink-950">
      <PageHero
        eyebrow="07 — Technologies"
        title={
          <>Choosing tech to <span className="font-serif-display italic text-emerald-200/90">fit the business.</span></>
        }
        subtitle="Choosing technology to fit the business, not the other way around."
        description="We choose technologies based on project requirements, scalability, maintainability, and business goals."
      />
      <Container className="pb-24 lg:pb-32">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
              data-cursor="hover"
              className="card-lift relative-sweep rounded-3xl border border-white/8 bg-white/3 p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-300/80">{group.title}</h3>
                <span className="font-mono text-[0.7rem] text-slate-500">0{i + 1}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-full border border-white/8 bg-white/3 px-3 py-1.5 text-sm text-slate-200">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  )
}

function InsightsPage() {
  usePageMeta(pageMeta.insights)
  return (
    <div className="bg-ink-950">
      <PageHero
        eyebrow="08 — Insights"
        title={
          <>Practical <span className="font-serif-display italic text-emerald-200/90">perspectives.</span></>
        }
        subtitle="Ideas and practical perspectives on software, systems, and business technology."
        description="Explore short articles on software development, APIs, business automation, cloud planning, digital transformation, and better technology decisions."
      />
      <Container className="pb-24 lg:pb-32">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </Container>
    </div>
  )
}

function InsightDetailPage() {
  const { slug } = useParams()
  const post = blogPosts.find((item) => item.slug === slug)
  usePageMeta({
    title: post ? `${post.title} | Synergy Brix` : 'Page Not Found | Synergy Brix',
    description: post ? post.excerpt : 'The insight you are looking for could not be found.',
    canonical: post ? `${SITE_URL}/insights/${post.slug}` : `${SITE_URL}/404`,
  })
  if (!post) return <NotFoundPage />
  return (
    <div className="bg-ink-950">
      <PageHero
        eyebrow={post.category}
        title={post.title}
        subtitle={`${post.date} · ${post.readTime}`}
        breadcrumbs={[{ label: 'Insights', to: '/insights' }, { label: post.title }]}
      />
      <Container className="pb-24 lg:pb-32">
        <article className="mx-auto max-w-3xl glass-panel rounded-3xl p-8 sm:p-12">
          <p className="text-sm leading-8 text-slate-300 sm:text-lg sm:leading-9">
            {post.content.map((paragraph) => (
              <span key={paragraph} className="block">{paragraph}</span>
            ))}
          </p>
        </article>
      </Container>
    </div>
  )
}

function ContactPage() {
  usePageMeta(pageMeta.contact)
  return (
    <section className="surface-canvas relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-28">
      <div className="mesh-bg absolute inset-0" />
      <BgText className="top-20 left-1/2 -translate-x-1/2">Contact</BgText>
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-emerald-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-teal-500/12 blur-[120px]" />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} className="relative">
          <motion.div variants={fadeIn} className="eyebrow">
            <span className="status-pulse" /> Let&apos;s start a project
          </motion.div>
          <h1 className="mt-6 max-w-2xl text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.0] tracking-tightest text-white">
            <RevealText as="span" delay={0.05} className="block">Let&apos;s build</RevealText>
            <RevealText as="span" delay={0.18} className="block">something that</RevealText>
            <RevealText as="span" delay={0.32} className="font-serif-display italic text-emerald-200/90">matters.</RevealText>
          </h1>
          <motion.p variants={fadeIn} className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Tell us about your goals, challenge, or opportunity. Share a few details and we&apos;ll get back to you with the right next steps.
          </motion.p>
          <motion.div variants={fadeIn} className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Magnetic>
              <LinkButton href={GOOGLE_FORM_URL} variant="primary" external icon={<ArrowRight size={16} className="arrow-shift" />}>
                Start a Project
              </LinkButton>
            </Magnetic>
            <span className="text-sm text-slate-500">Opens our project enquiry form in a new tab</span>
          </motion.div>
          <motion.div variants={fadeIn} className="mt-12 grid gap-3 sm:grid-cols-2">
            <ContactInfoCard icon={<Mail size={16} />} label="Email" value="synergy.brix@gmail.com" href="mailto:synergy.brix@gmail.com" />
            <ContactInfoCard icon={<MapPin size={16} />} label="Location" value="India • Remote-ready" />
            <ContactInfoCard icon={<FaLinkedinIn size={14} />} label="LinkedIn" value="Connect on LinkedIn" href="https://www.linkedin.com/in/synergy-brix-721726433/" />
            <ContactInfoCard icon={<FaInstagram size={14} />} label="Instagram" value="Follow on Instagram" href="https://www.instagram.com/synergy.brix" />
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.94, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="relative">
          <ContactNetwork />
        </motion.div>
      </Container>
    </section>
  )
}

const fadeIn = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }

function ContactInfoCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-500/10 text-emerald-200">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-emerald-200/80">{label}</span>
        <span className="text-sm font-medium text-white">{value}</span>
      </span>
    </>
  )
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        data-cursor="hover"
        className="card-lift group flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-4 transition duration-300 hover:border-emerald-300/30 hover:bg-white/5"
      >
        {content}
      </a>
    )
  }
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-4">
      {content}
    </div>
  )
}

const contactNetworkNodes = [
  { label: 'Discovery', icon: Compass, position: 'contact-node-discovery' },
  { label: 'Strategy', icon: Sparkles, position: 'contact-node-strategy' },
  { label: 'Engineering', icon: Code2, position: 'contact-node-engineering' },
  { label: 'Launch', icon: Rocket, position: 'contact-node-launch' },
  { label: 'Email', icon: Mail, position: 'contact-node-email' },
  { label: 'Support', icon: Headphones, position: 'contact-node-support' },
]

const contactNetworkPaths = [
  'M240 220 C195 180 150 140 105 105',
  'M260 220 C310 180 360 140 405 105',
  'M225 250 C170 270 125 300 90 320',
  'M275 250 C335 285 380 320 425 345',
  'M235 265 C215 320 185 370 160 410',
  'M265 265 C300 320 340 370 370 410',
]

const contactNetworkParticles = [
  { x: 240, y: 220 },
  { x: 260, y: 220 },
  { x: 225, y: 250 },
  { x: 275, y: 250 },
  { x: 235, y: 265 },
  { x: 265, y: 265 },
]

function ContactNetwork() {
  return (
    <div className="architecture-visual" aria-label="Synergy Brix project connection network">
      <div className="architecture-grid" />
      <div className="architecture-aurora architecture-aurora-one" />
      <div className="architecture-aurora architecture-aurora-two" />
      <svg className="architecture-links" viewBox="0 0 500 460" role="img" aria-label="Connections between your goals and Synergy Brix capabilities">
        <defs>
          <linearGradient id="contact-network-line" x1="0" x2="1">
            <stop stopColor="#34d399" stopOpacity=".12" />
            <stop offset=".5" stopColor="#6ee7b7" stopOpacity=".85" />
            <stop offset="1" stopColor="#34d399" stopOpacity=".12" />
          </linearGradient>
        </defs>
        {contactNetworkPaths.map((path) => (
          <path key={path} className="architecture-link" d={path} />
        ))}
        {contactNetworkParticles.map((p, index) => (
          <circle key={index} className={`architecture-particle contact-particle-${index}`} cx={p.x} cy={p.y} r={3} />
        ))}
      </svg>
      <div className="architecture-core">
        <div className="architecture-core-orbit" />
        <div className="architecture-core-inner">
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-emerald-200/80">Connect with</span>
          <span className="mt-1 block text-base font-semibold tracking-[-0.04em] text-white">Synergy Brix</span>
          <span className="mt-2 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-emerald-300">
            <span className="status-pulse h-1.5 w-1.5 rounded-full bg-emerald-300" /> Project hub
          </span>
        </div>
      </div>
      {contactNetworkNodes.map(({ label, icon: Icon, position }) => (
        <div key={label} className={`architecture-node ${position}`}>
          <div className="architecture-node-icon">
            <Icon size={15} strokeWidth={1.8} />
          </div>
          <span>{label}</span>
        </div>
      ))}
      <div className="architecture-caption">
        <span className="status-pulse h-1.5 w-1.5 rounded-full bg-emerald-300" /> Discovery · Strategy · Build · Launch
      </div>
    </div>
  )
}

function FAQPage() {
  usePageMeta(pageMeta.faq)
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <div className="bg-ink-950">
      <PageHero
        eyebrow="09 — FAQ"
        title={
          <>Questions, <span className="font-serif-display italic text-emerald-200/90">answered.</span></>
        }
        subtitle="Questions companies often ask before starting a project."
        description="Common answers about software development, integration, automation, cloud deployment, maintenance, and project planning."
      />
      <Container className="pb-24 lg:pb-32">
        <ul className="border-t border-white/8">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i
            return (
              <li key={faq.question} className="border-b border-white/8">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  data-cursor="hover"
                  className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="text-base font-medium text-white sm:text-lg">{faq.question}</span>
                  <span className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-emerald-300 transition-all duration-500 ${isOpen ? 'rotate-180 border-emerald-400/40 bg-emerald-500/10' : 'group-hover:border-emerald-400/30'}`}>
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-3xl pb-6 pr-12 text-sm leading-7 text-slate-300">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </Container>
    </div>
  )
}

function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const content = {
    privacy: {
      title: 'Privacy Policy',
      description:
        'This privacy policy is a placeholder for future legal review and should be customized to the final company operating model and jurisdiction.',
    },
    terms: {
      title: 'Terms & Conditions',
      description:
        'These terms and conditions are a placeholder for legal review and should be refined to reflect the actual service offering, scope of work, and commercial terms.',
    },
  }[type]

  usePageMeta({
    title: `${content.title} | Synergy Brix`,
    description: content.description,
    canonical: `${SITE_URL}/${type === 'privacy' ? 'privacy' : 'terms'}`,
  })

  return (
    <div className="bg-ink-950">
      <PageHero eyebrow="Legal" title={content.title} subtitle="Legal placeholder content for future review." description={content.description} />
      <Container className="pb-24 lg:pb-32">
        <div className="glass-panel mx-auto max-w-3xl rounded-3xl p-8 sm:p-12">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-300/80">Last Updated: August 2026</div>
          <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">
            This document is a placeholder and should be reviewed by legal counsel before publication.
          </p>
          <div className="mt-8 rounded-2xl border border-amber-400/25 bg-amber-400/8 p-4 text-sm text-amber-200">
            Legal review required before final publication.
          </div>
        </div>
      </Container>
    </div>
  )
}

function NotFoundPage() {
  usePageMeta({
    title: 'Page Not Found | Synergy Brix',
    description: 'The page you requested does not exist or may have moved.',
    canonical: `${SITE_URL}/404`,
    robots: 'noindex, nofollow',
  })
  return (
    <div className="bg-ink-950">
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
        <div className="mesh-bg absolute inset-0" />
        <BgText className="top-32 left-1/2 -translate-x-1/2">404</BgText>
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow mx-auto w-fit">Lost in the build</div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tightest text-white sm:text-6xl">
              This page is <span className="font-serif-display italic text-emerald-200/90">off-grid.</span>
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
              The page you requested does not exist or may have moved. Return to the homepage and continue exploring.
            </p>
            <div className="mt-8 flex justify-center">
              <Magnetic>
                <LinkButton href="/#home" variant="primary" icon={<ArrowRight size={16} className="arrow-shift" />}>
                  Back to Home
                </LinkButton>
              </Magnetic>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

/* ============================================================================
 * Supporting components
 * ========================================================================= */

function PageHero({
  eyebrow,
  title,
  subtitle,
  description,
  breadcrumbs,
}: {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
  description?: string
  breadcrumbs?: { label: string; to?: string }[]
}) {
  return (
    <section className="surface-canvas relative overflow-hidden pt-32 pb-14 lg:pt-44 lg:pb-20">
      <div className="mesh-bg absolute inset-0" />
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-emerald-500/12 blur-[120px]" />
      <Container className="relative">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            {breadcrumbs.map((item, index) => (
              <div key={item.label} className="flex items-center gap-2">
                {index > 0 && <span className="text-slate-600">/</span>}
                {item.to ? (
                  <Link to={item.to} className="hover:text-white">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-300">{item.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}
        <div className="max-w-4xl">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="mt-5 text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.0] tracking-tightest text-white">
            {title}
          </h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">{subtitle}</p>}
          {description && <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">{description}</p>}
        </div>
      </Container>
    </section>
  )
}

function InfoPanel({ title, text }: { title: string; text: string }) {
  return (
    <div data-cursor="hover" className="card-lift group rounded-3xl border border-white/8 bg-white/3 p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
    </div>
  )
}

function SectionColumn({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-300">{body}</p>
    </div>
  )
}

function CTASection({
  title,
  description,
  primaryLabel,
  secondaryLabel,
  primaryHref,
  secondaryHref,
}: {
  title: string
  description: string
  primaryLabel: string
  secondaryLabel: string
  primaryHref: string
  secondaryHref: string
}) {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/6 bg-ink-950 text-white">
      <div className="cta-grid absolute inset-0 opacity-50" />
      <BgText className="-top-12 left-1/2 -translate-x-1/2">Start</BgText>
      <motion.div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-500/22 blur-[100px]" animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-teal-400/16 blur-[100px]" animate={{ x: [0, -30, 0], y: [0, -20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      <Container className="relative grid gap-10 py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:py-28">
        <div>
          <div className="eyebrow">Let&apos;s talk</div>
          <h2 className="mt-5 text-4xl font-semibold tracking-tightest text-white sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Magnetic>
            <LinkButton href={primaryHref} variant="primary" external icon={<ArrowRight size={16} className="arrow-shift" />}>
              {primaryLabel}
            </LinkButton>
          </Magnetic>
          <Magnetic>
            <LinkButton href={secondaryHref} variant="secondary" external>
              {secondaryLabel}
            </LinkButton>
          </Magnetic>
        </div>
      </Container>
    </section>
  )
}

function ServiceCard({ service, index = 0 }: { service: (typeof services)[number]; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      data-cursor="hover"
    >
      <Link
        to={`/services/${service.slug}`}
        className="card-lift group relative-sweep relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-6"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-300/80">Service · {String(index + 1).padStart(2, '0')}</span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">{service.technology[0]}</span>
        </div>
        <h3 className="mt-6 text-xl font-semibold tracking-tight text-white transition group-hover:text-emerald-200">{service.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">{service.short}</p>
        <div className="mt-4 rounded-xl border border-white/6 bg-white/3 p-3">
          <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-emerald-300/80">Problem</div>
          <p className="mt-1 text-xs leading-6 text-slate-400">{service.problem}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {service.technology.slice(0, 3).map((tech) => (
            <span key={tech} className="rounded-full border border-white/8 bg-white/3 px-2.5 py-1 text-[0.7rem] text-slate-300">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-200">
          Explore service
          <span className="arrow-shift inline-flex">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

function BlogCard({ post, index = 0 }: { post: (typeof blogPosts)[number]; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06 }}
    >
      <Link
        to={`/insights/${post.slug}`}
        data-cursor="view"
        data-cursor-label="Read"
        className="card-lift group relative-sweep relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-6"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-emerald-300/80">{post.category}</span>
          <span className="font-mono text-[0.65rem] text-slate-500">{post.readTime}</span>
        </div>
        <h3 className="mt-5 text-lg font-semibold leading-snug text-white transition group-hover:text-emerald-200">{post.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-6 text-xs text-slate-500">
          <span>{post.date}</span>
          <span className="flex items-center gap-1.5 text-emerald-300 transition group-hover:translate-x-1">
            Read <ArrowUpRight size={12} />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

function LinkButton({
  href,
  children,
  variant = 'primary',
  className = '',
  icon,
  fullWidth = false,
  external = false,
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'primary-light' | 'secondary-light' | 'outline-paper'
  className?: string
  icon?: React.ReactNode
  fullWidth?: boolean
  external?: boolean
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    'primary-light': 'btn-primary-light',
    'secondary-light': 'btn-secondary-light',
    'outline-paper': 'btn-outline-paper',
  }[variant]

  const inner = (
    <>
      <span className="relative inline-flex items-center gap-2">
        {children}
        {icon}
      </span>
    </>
  )

  if (external || isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="hover"
        className={`btn-base ${variantClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {inner}
      </a>
    )
  }
  return (
    <Link to={href} data-cursor="hover" className={`btn-base ${variantClass} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {inner}
    </Link>
  )
}

function isExternalHref(href: string) {
  return /^(https?:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
}

function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-white/15 transition ${className}`}
      aria-label="Synergy Brix logo"
    >
      <img src="/logo.png" alt="Synergy Brix logo mark" className="h-full w-full object-contain" />
    </div>
  )
}

function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

/* ============================================================================
 * Global UI: Preloader, Scroll progress, hero orbs, scroll indicator
 * ========================================================================= */

function Preloader() {
  const [hidden, setHidden] = useState(() => sessionStorage.getItem('sb_preloaded') === '1')

  useEffect(() => {
    if (hidden) return
    const timer = window.setTimeout(() => {
      setHidden(true)
      sessionStorage.setItem('sb_preloaded', '1')
    }, 1100)
    return () => window.clearTimeout(timer)
  }, [hidden])

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),transparent_60%)]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.06, 1],
                  boxShadow: [
                    '0 0 0px rgba(16,185,129,0)',
                    '0 0 40px rgba(16,185,129,0.6)',
                    '0 0 0px rgba(16,185,129,0)',
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2"
              >
                <img src="/logo.png" alt="" className="h-full w-full object-contain" />
              </motion.div>
              <motion.span
                className="absolute -inset-2 rounded-3xl border border-emerald-400/40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.2, 0.6, 0], scale: [0.8, 1.25, 1.5] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
              />
            </div>
            <span className="mt-5 font-mono text-sm font-medium tracking-[0.3em] text-emerald-200/80">SYNERGY BRIX</span>
            <div className="mt-4 h-0.5 w-32 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full w-1/2 bg-emerald-400"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500"
    />
  )
}

function HeroBrandMark() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-9 w-9 shrink-0"
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 shadow-[0_0_24px_rgba(16,185,129,0.35)] ring-1 ring-white/20"
      >
        <img src="/logo.png" alt="" className="h-full w-full object-contain" />
      </motion.div>
      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
    </motion.div>
  )
}

function ScrollIndicator() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 lg:block" aria-hidden="true">
      <motion.a
        href="#services"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="pointer-events-auto flex flex-col items-center gap-2 text-slate-500 transition-colors hover:text-emerald-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-label="Scroll to services"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em]">Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/15 p-1">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1.5 w-1.5 rounded-full bg-emerald-400"
          />
        </span>
      </motion.a>
    </div>
  )
}

/* ============================================================================
 * Hook helpers
 * ========================================================================= */

function useReducedMotionSafe() {
  return useReducedMotion()
}

function FloatingContactWidget() {
  const [phoneOpen, setPhoneOpen] = useState(false)
  const phoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!phoneOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (phoneRef.current && !phoneRef.current.contains(e.target as Node)) {
        setPhoneOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhoneOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [phoneOpen])

  return (
    <div className="fixed right-4 bottom-[max(18px,env(safe-area-inset-bottom))] z-50 flex flex-col gap-3 sm:right-6 sm:bottom-20">
      <a
        href="https://wa.me/917972415528"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Synergy Brix on WhatsApp"
        className="touch-manipulation group inline-flex h-12 w-12 sm:h-[52px] sm:w-[52px] items-center justify-center rounded-full border border-emerald-400/30 bg-ink-900/90 text-emerald-300 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/60 hover:bg-ink-800 hover:text-emerald-200 hover:shadow-[0_0_18px_rgba(16,185,129,0.25)]"
      >
        <FaWhatsapp size={22} className="transition-transform duration-300 group-hover:scale-110" />
      </a>

      <div className="relative" ref={phoneRef}>
        <button
          type="button"
          aria-label="Call Synergy Brix"
          onClick={() => setPhoneOpen((v) => !v)}
          className="touch-manipulation group inline-flex h-12 w-12 sm:h-[52px] sm:w-[52px] items-center justify-center rounded-full border border-white/10 bg-ink-900/90 text-slate-300 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-ink-800 hover:text-emerald-200 hover:shadow-[0_0_14px_rgba(16,185,129,0.18)]"
        >
          <Phone size={20} className="transition-transform duration-300 group-hover:scale-110" />
        </button>

        <AnimatePresence>
          {phoneOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-[68px] right-0 w-[calc(100vw-40px)] max-w-[220px] rounded-2xl border border-white/10 bg-ink-900/95 p-4 shadow-xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-300/80">Call Synergy Brix</h4>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setPhoneOpen(false)}
                  className="text-slate-400 transition hover:text-white"
                >
                  ×
                </button>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">Have a project in mind? Talk to the Synergy Brix team.</p>
              <p className="mt-3 font-mono text-sm text-white">+91 79724 15528</p>
              <a
                href="tel:+917972415528"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
                aria-label="Call Synergy Brix at +91 79724 15528"
              >
                Call Now
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
