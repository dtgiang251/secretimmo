"use client";

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import siteMetadata from "@/data/siteMetadata";
import Logo from "@/data/logo.svg";
import Link from 'next/link'
import i18n from '@/lib/i18n';
import { languages } from '@/i18n/settings';
import { usePathname, useRouter } from "next/navigation";
import Image from 'next/image'


const Header = () => {
  const { t } = useTranslation('header');
  const router = useRouter();
  const pathname = usePathname();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
      const newPathname = pathname.replace(/^\/(en|fr|de)/, '');
      
      if (lng === 'fr') {
          router.push(newPathname || '/');
      } else {
          router.push(`/${lng}${newPathname}`);
      }

      setLanguageMenuOpen(false);
  };


  let headerClass =
    "flex items-center w-full bg-white dark:bg-gray-950 justify-between relative z-20";
  if (siteMetadata.stickyNav) {
    headerClass += " sticky top-0 z-50";
  }

  return (
    <>
      <header className={headerClass}>
        <div className="container mx-auto pt-5 pb-5 flex justify-between items-center">
          <Link href="/" aria-label={siteMetadata.headerTitle}>
            <div className="flex items-center justify-between">
              <div className="mr-3">
                <Logo />
              </div>
            </div>
          </Link>
          <div className="flex items-center space-x-4 leading-4.5">

            <div className="header-contact header-border-right flex items-center gap-6 pt-3.5 pb-3.5 pr-6">
              <div className="flex font-bold items-center gap-1">
              <Image src={`static/icons/phone.svg`} alt={'phone'} width={18} height={18} />
                <a href={`tel:${siteMetadata.phone}`}>
                  <span>{siteMetadata.phone}</span>
                </a>
              </div>
              <div className="flex font-bold items-center gap-1">
                <Image src={`static/icons/mail.svg`} alt={'email'} width={18} height={18} />
                <a href={`mailto:${siteMetadata.email}`}>
                  <span>{siteMetadata.email}</span>
                </a>
              </div>
            </div>

            <div className="header-support header-border-right flex flex-col items-end pt-1.5 pb-1.5 pr-6">
              <span className="text-xs">{t('header_1')}</span>
              <strong className="text-sm leading-4.5">{t('header_2')}</strong>
            </div>

            <div className="relative">
              <button onClick={() => setLanguageMenuOpen(!languageMenuOpen)} className="languge-btn cursor-pointer w-8 h-8 rounded-4xl text-sm text-center text-white uppercase">
                {i18n.language}
              </button>
              {languageMenuOpen && (
                <div className="absolute left-0 mt-2 w-8">
                  {languages.map((lng) => (
                    <button key={lng} onClick={() => changeLanguage(lng)} className="languge-btn cursor-pointer w-8 h-8 rounded-4xl text-sm text-center text-white uppercase mb-1">
                      {lng}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
