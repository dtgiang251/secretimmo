import React from 'react';
import { dir } from 'i18next';
import { languages } from '../../i18n/settings';
import { Metadata } from 'next';

export default function LocaleLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode; 
  params: { lng: string } 
}) {
  return (
    <html lang={params.lng} dir={dir(params.lng)}>
      <body>
        {children}
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: { lng: string } 
}): Promise<Metadata> {
  return {
    title: `Your Site - ${params.lng}`,
    description: 'Your site description'
  };
}
