import { defaultLocale, LanguageEnums, routing } from '@i18n/routing'

const HOST = 'https://quizerplay.com'

function generateCanonicalLink(locale: LanguageEnums, pathname: string | null): string {
  return pathname ? `${HOST}/${locale}/${pathname}` : `${HOST}/${locale}`
}

function generateAlternateLink(locale: LanguageEnums, pathname: string | null): string {
  return pathname ? `${HOST}/${locale}/${pathname}` : `${HOST}/${locale}`
}

type Alternates = {
  canonical: string,
  languages: {[lang: string]: string}
}

export function generateMetaAlternates(locale: LanguageEnums, pathname: string | null = null): Alternates {
  return {
    canonical: generateCanonicalLink(locale, pathname),
    languages: routing.locales.reduce((acc, lang) => {
      acc[lang] = generateAlternateLink(lang, pathname)
      if (lang === defaultLocale) {
        acc['x-default'] = generateAlternateLink(defaultLocale, pathname)
      }
      return acc
    }, {} as Record<string, string>),
  }
}
