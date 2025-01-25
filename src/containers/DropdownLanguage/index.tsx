import Dropdown, { DropdownVariant } from '@components/Dropdown'
import { LanguageEnums } from '@i18n/constants'
import { getPathname } from '@i18n/routing'
import clsx from "clsx";

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
  const localeDropdownList = [
    { id: LanguageEnums.EN, name: 'English', href: getPathname({ href: '/', locale: LanguageEnums.EN }) },
    { id: LanguageEnums.RU, name: 'Русский', href: getPathname({ href: '/', locale: LanguageEnums.RU }) },
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
