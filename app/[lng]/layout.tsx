// app/[lng]/layout.tsx

import React from 'react';
import { dir } from 'i18next';
import { languages } from '../../i18n/settings';
import { Metadata } from 'next';

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <html lang={params.lng}>
      <body>{children}</body>
    </html>
  );
}

export async function generateStaticParams() {
  return [
    { lng: 'en' },
    { lng: 'fr' },
    { lng: 'de' }
  ];
}
