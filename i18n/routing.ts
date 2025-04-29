import { createNavigation } from 'next-intl/navigation';
import { defineRouting, Pathnames } from 'next-intl/routing';


export const routing = defineRouting({
  locales: ['en', 'de', 'fr', 'pt'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeDetection: false,
  localeCookie: {
    maxAge: 60 * 60 * 1
  },
  pathnames: {
    '/': { en: '/', de: '/', fr: '/' },
    '/blog': {
      en: '/blog',
      de: '/blog',
      fr: '/blog',
      pt: '/blog',
    },
    '/contact': {
      en: '/contact',
      de: '/contact',
      fr: '/contact',
      pt: '/contact',
    },
    '/estimation': {
      en: '/estimation',
      de: '/estimation',
      fr: '/estimation',
      pt: '/estimation',
    },
    '/search': {
      en: '/search',
      de: '/search',
      fr: '/search',
      pt: '/search',
    },
    '/details/[id]': {
      en: '/details/[id]',
      de: '/details/[id]',
      fr: '/details/[id]',
      pt: '/details/[id]',
    },
    '/finance': {
      en: '/finance',
      de: '/finance',
      fr: '/finance',
      pt: '/finance',
    },
    '/news': {
      en: '/news',
      de: '/news',
      fr: '/news',
      pt: '/news',
    },
    '/our-rates': {
      en: '/our-rates',
      de: '/our-rates',
      fr: '/our-rates',
      pt: '/our-rates',
    },
    '/our-services': {
      en: '/our-services',
      de: '/our-services',
      fr: '/our-services',
      pt: '/our-services',
    },
    '/partners': {
      en: '/partners',
      de: '/partners',
      fr: '/partners',
      pt: '/partners',
    },
    '/sold': {
      en: '/sold',
      de: '/sold',
      fr: '/sold',
      pt: '/sold',
    },
    '/legal-notice': {
      en: '/legal-notice',
      de: '/legal-notice',
      fr: '/legal-notice',
      pt: '/legal-notice',
    },
    '/privacy-policy': {
      en: '/privacy-policy',
      de: '/privacy-policy',
      fr: '/privacy-policy',
      pt: '/privacy-policy',
    },
    '/blog/post/[slug]': {
      en: '/blog/post/[slug]',
      de: '/blog/post/[slug]',
      fr: '/blog/post/[slug]',
      pt: '/blog/post/[slug]',
    },
    '/[category]/[type]/[city]/[id]': {
      en: '/[category]/[type]/[city]/[id]',
      de: '/[category]/[type]/[city]/[id]',
      fr: '/[category]/[type]/[city]/[id]',
      pt: '/[category]/[type]/[city]/[id]',
    },
  }
});


export const pathnames = {
  '/': { en: '/', de: '/', fr: '/' },
  '/blog': {
    en: '/blog',
    de: '/blog',
    fr: '/blog',
  },
  '/contact': {
    en: '/contact',
    de: '/contact',
    fr: '/contact',
  },
  '/estimation': {
    en: '/estimation',
    de: '/estimation',
    fr: '/estimation',
  },
  '/search/[params]': {
    en: '/search',
    de: '/search',
    fr: '/search',
  },
  '/details/[id]': {
    en: '/details/[id]',
    de: '/details/[id]',
    fr: '/details/[id]',
  },
  '/finance': {
    en: '/finance',
    de: '/finance',
    fr: '/finance',
  },
  '/news': {
    en: '/news',
    de: '/news',
    fr: '/news',
  },
  '/our-rates': {
    en: '/our-rates',
    de: '/our-rates',
    fr: '/our-rates',
  },
  '/our-services': {
    en: '/our-services',
    de: '/our-services',
    fr: '/our-services',
  },
  '/partners': {
    en: '/partners',
    de: '/partners',
    fr: '/partners',
  },
  '/sold': {
    en: '/sold',
    de: '/sold',
    fr: '/sold',
  },
  '/legal-notice': {
    en: '/legal-notice',
    de: '/legal-notice',
    fr: '/legal-notice',
  },
  '/privacy-policy': {
    en: '/privacy-policy',
    de: '/privacy-policy',
    fr: '/privacy-policy',
  },
  '/blog/post/[slug]': {
    en: '/blog/post/[slug]',
    de: '/blog/post/[slug]',
    fr: '/blog/post/[slug]',
  },
  '/[category]/[type]/[city]/[id]': {
    en: '/[category]/[type]/[city]/[id]',
    de: '/[category]/[type]/[city]/[id]',
    fr: '/[category]/[type]/[city]/[id]',
    pt: '/[category]/[type]/[city]/[id]',
  },
} satisfies Pathnames<typeof routing.locales>;


export type Locale = (typeof routing.locales)[number];


export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
