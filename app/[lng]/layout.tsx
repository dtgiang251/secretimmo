import { dir } from 'i18next'
import { languages, fallbackLng } from '../../i18n/settings'

export default function LocaleLayout({
  children,
  params: { lng }
}: {
  children: React.ReactNode
  params: { lng: string }
}) {
  return (
    <div lang={lng} dir={dir(lng)}>
      {children}
    </div>
  )
}
