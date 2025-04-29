// app/[locale]/layout.tsx
import RootLayoutClient from './layout.client'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';


export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params?.locale || 'fr';  // Mặc định locale là 'fr' nếu không có locale
  
  const messages = await getMessages({ locale });  // Truyền locale vào getMessages để lấy thông điệp cho locale đó

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <RootLayoutClient>
          {children}  {/* Các trang con sẽ được hiển thị ở đây */}
          </RootLayoutClient>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

