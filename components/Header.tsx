"use client";

import { useState } from 'react'
import { useTranslations } from 'next-intl';
import siteMetadata from "@/data/siteMetadata";
import Link from 'next/link'
import { usePathname, useRouter } from "next/navigation";
import Image from 'next/image'


const Header = () => {
  const { t } = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    const router = useRouter();
    const { pathname, query } = router;
  
    // Tạo lại đường dẫn mới với locale mới
    const newPathname = pathname.replace(/^\/(en|fr|de)/, '');
  
    // Kiểm tra ngôn ngữ và chuyển đến URL tương ứng
    if (lng === 'fr') {
      router.push(newPathname || '/'); // Nếu ngôn ngữ là 'fr', chỉ cần điều hướng về trang chủ hoặc path gốc
    } else {
      router.push(`/${lng}${newPathname}`); // Thêm locale vào URL
    }
  
    // Đóng menu sau khi thay đổi ngôn ngữ
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
