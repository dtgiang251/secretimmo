import React from 'react';
import { dir } from 'i18next';
import { languages } from '../../i18n/settings';

// Thêm từ khóa async cho layout
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  //const lng = params.lng;
  
  return (
    <div>
      {children}
    </div>
  );
}

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}