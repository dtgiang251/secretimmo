"use client";

import { useState } from 'react'
import { useTranslations } from 'next-intl';
import siteMetadata from "@/data/siteMetadata";
import Link from 'next/link'
import { usePathname, useRouter } from "next/navigation";
import Image from 'next/image'


const Header = () => {
  const t  = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);



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
                <Image src={`static/logo.svg`} alt={'address'} className="w-[186px] h-[36px] sm:w-auto sm:h-auto" width={186} height={36} />
              </div>
            </div>
          </Link>
          <div className="flex items-center space-x-4 leading-4.5">

            <div className="header-contact header-border-right flex items-center gap-6 pt-3.5 pb-3.5 pr-6">
              <a className="flex font-bold items-center gap-1" href={`tel:${siteMetadata.phone}`}>
                <Image src={`static/icons/phone.svg`} alt={'phone'} width={18} height={18} />
                <span className="hidden xl:block">{siteMetadata.phone}</span>
              </a>
              <a className="flex font-bold items-center gap-1" href={`mailto:${siteMetadata.email}`}>
                <Image src={`static/icons/mail.svg`} alt={'email'} width={18} height={18} />
                <span className="hidden xl:block">{siteMetadata.email}</span>
              </a>
            </div>

            <div className="header-support text-right header-border-right hidden md:flex flex-col items-end pt-1.5 pb-1.5 pr-6 max-w-[250px] xl:max-w-full">
              <span className="text-xs">{t('header_1')}</span>
              <strong className="text-sm leading-4.5">{t('header_2')}</strong>
            </div>

          

          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
