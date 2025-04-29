import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';


export default createMiddleware(routing);

export const config = {
  matcher: [
    '/', 
    '/(de|en|fr)/:path*',
    '/:locales((?!_next/static|_next/image|favicon.ico|videos|icons|flags|Logo.png|csv|sitemap.xml|robots.txt|api/server-sitemap|server-sitemap.xml|downloads).+)', 
    '/:locale(en|de|fr|nl|lu)/api/:path*',
  ],
};
