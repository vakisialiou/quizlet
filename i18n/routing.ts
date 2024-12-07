import { locales, defaultLocale } from '@i18n/constants'
import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export * from '@i18n/constants'

export const routing = defineRouting({ locales, defaultLocale, localeCookie: true })

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
