import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fallbackLng, languages } from './i18n/settings'
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'always' // hoặc 'as-needed'
})

export const config = {
  matcher: [
    // Enable a navbar to display the current locale
    '/',
    '/(fr|en|de)/:path*',
    '/((?!api|_next|.*\\..*).*)' // Áp dụng cho tất cả các route
  ]
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // Kiểm tra xem path có chứa locale không
  const pathnameHasLocale = languages
    .filter(locale => locale !== fallbackLng)  // Loại trừ ngôn ngữ mặc định
    .some(
      (locale) => pathname.startsWith(`/${locale}`) || pathname === `/${locale}`
    )

  // Nếu không có locale (trừ ngôn ngữ mặc định), thêm locale khác
  if (!pathnameHasLocale) {
    // Nếu đang ở root và không phải ngôn ngữ mặc định, giữ nguyên
    if (pathname === '/') {
      return NextResponse.next()
    }

    // Kiểm tra nếu đang ở ngôn ngữ mặc định
    if (pathname.startsWith(`/${fallbackLng}/`)) {
      // Chuyển hướng loại bỏ locale mặc định
      return NextResponse.redirect(
        new URL(pathname.replace(`/${fallbackLng}`, ''), req.url)
      )
    }
  }

  return NextResponse.next()
}
