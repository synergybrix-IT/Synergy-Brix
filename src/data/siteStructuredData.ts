import { SITE_URL } from '../config/siteUrl.ts'

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Synergy Brix',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
  },
  description:
    'Synergy Brix is a technology and software development company building custom web applications, software solutions, business automation, and scalable digital products.',
  email: 'synergy.brix@gmail.com',
  sameAs: [
    'https://www.linkedin.com/in/synergy-brix-721726433/',
    'https://www.instagram.com/synergy.brix',
    'https://wa.me/917972415528',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-79724-15528',
    email: 'synergy.brix@gmail.com',
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
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Vasai-Virar' },
    { '@type': 'AdministrativeArea', name: 'Mumbai Metropolitan Region' },
  ],
}

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Synergy Brix',
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
}

export const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
}
