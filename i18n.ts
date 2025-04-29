import { getRequestConfig } from 'next-intl/server';

export const locales = ['fr', 'en', 'de'];

export default getRequestConfig(async ({ locale }) => {
  // Kiểm tra xem locale có hợp lệ không
  if (!locale || !locales.includes(locale)) {
    console.error('Invalid locale:', locale); // In ra lỗi nếu locale không hợp lệ
    return { messages: {} }; // Trả về thông điệp rỗng nếu locale không hợp lệ
  }

  const messages = await import(`./messages/${locale}.json`).then(module => module.default);
  return { messages };
});
