import React from 'react';
import { dir } from 'i18next';
import { languages } from '../../i18n/settings';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: {
    lng: string;
  };
};

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  return (
    <div>
      {children}
    </div>
  );
}

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}