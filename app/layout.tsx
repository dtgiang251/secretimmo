import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { Inter } from 'next/font/google';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})



const locales = ['en', 'de', 'fr'] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport = {
  viewport: {
    initialScale: 1,
    width: 'device-width',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const isDevelopment = process.env.NEXT_ENV === 'dev';
const isProd = process.env.NEXT_ENV === 'prod';


export const metadata = {
  ...(isDevelopment && { robots: 'noindex, nofollow' }),
  ...(isProd && { robots: 'index, follow' }),
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: typeof locales[number] };
}





export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${inter.variable} font-sans`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
