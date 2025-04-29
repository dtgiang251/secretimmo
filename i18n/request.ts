import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { notFound } from 'next/navigation';

const locales = ['en', 'de', 'fr'];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages
  };
});
