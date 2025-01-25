import Dropdown, { DropdownVariant } from '@components/Dropdown'
import { getPathname, usePathname } from '@i18n/routing'
import { LanguageEnums } from '@i18n/constants'
import clsx from 'clsx'

export default function DropdownLanguage(
  {
    locale,
    className = ''
  }:
  {
    locale: LanguageEnums
    className?: string
  }
) {
  const path = usePathname()
  const localeDropdownList = [
    { id: LanguageEnums.EN, name: 'English', href: getPathname({ href: path, locale: LanguageEnums.EN }) },
    { id: LanguageEnums.RU, name: 'Русский', href: getPathname({ href: path, locale: LanguageEnums.RU }) },
  ]

  const localeDropdownValue = localeDropdownList.find(({ id }) => id === locale)

  return (
    <Dropdown
      caret
      selected={[locale]}
      className={clsx('py-1 px-2', {
        [className]: className,
      })}
      classNameMenu="w-28"
      items={localeDropdownList}
      variant={DropdownVariant.gray}
    >
      <span className="pr-2">
        {localeDropdownValue?.name || 'Language'}
      </span>
    </Dropdown>
  )
}
