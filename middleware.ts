import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fallbackLng, languages } from './i18n/settings'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)']
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
