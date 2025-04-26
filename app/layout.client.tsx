'use client'

import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Inter, Poppins } from 'next/font/google'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProviders } from './theme-providers'



const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} scroll-smooth`}
    >
      <head />
      <body className="bg-white text-black antialiased dark:bg-gray-950 dark:text-white">
        <I18nextProvider i18n={i18n}>
          <ThemeProviders>
            <Header />
            <main className="mb-auto">{children}</main>
            <Footer />
          </ThemeProviders>
        </I18nextProvider>
      </body>
    </html>
  )
}