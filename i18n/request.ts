import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import { notFound } from 'next/navigation';

const locales = ['en', 'de', 'fr', 'pt'];

export default getRequestConfig(async ({ requestLocale }) => {

 
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  if (!locales.includes(locale)) {
    notFound();
  }
  
  const generalMessages = (await import(`../messages/${locale}/general.json`)).default;
  const contactMessages = (await import(`../messages/${locale}/contact.json`)).default;
  const financeMessages = (await import(`../messages/${locale}/finance.json`)).default;
  const blogMessages = (await import(`../messages/${locale}/blog.json`)).default;
  const homeMessages = (await import(`../messages/${locale}/home.json`)).default;
  const ratesMessages = (await import(`../messages/${locale}/rates.json`)).default;
  const servicesMessages = (await import(`../messages/${locale}/services.json`)).default;
  const valuationMessages = (await import(`../messages/${locale}/valuation.json`)).default;
  const newsMessages = (await import(`../messages/${locale}/news.json`)).default;
  const soldMessages = (await import(`../messages/${locale}/sold.json`)).default;
  const filterMessages = (await import(`../messages/${locale}/filter.json`)).default;
  const apiMessages = (await import(`../messages/${locale}/api.json`)).default;
  const detailsMessages = (await import(`../messages/${locale}/details.json`)).default;
  const emailMessages = (await import(`../messages/${locale}/email.json`)).default;
  const seoMessages = (await import(`../messages/${locale}/seo.json`)).default;


 return {
   locale,
   messages: {
    ...generalMessages,
    ...contactMessages,
    ...financeMessages,
    ...blogMessages,
    ...homeMessages,
    ...ratesMessages,
    ...servicesMessages,
    ...valuationMessages,
    ...soldMessages,
    ...filterMessages,
    ...apiMessages,
    ...detailsMessages,
    ...emailMessages,
    ...seoMessages,
    ...newsMessages,
   }
 };
});