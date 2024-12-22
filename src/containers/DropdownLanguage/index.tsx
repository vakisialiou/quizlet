import Dropdown, { DropdownVariant } from '@components/Dropdown'
import { LanguageEnums } from '@i18n/constants'
import { getPathname } from '@i18n/routing'

export default function DropdownLanguage(
  {
    locale
  }:
  {
    locale: LanguageEnums
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
      className="py-1 px-2"
      variant={DropdownVariant.gray}
      items={localeDropdownList}
    >
      <span className="pr-2">
        {localeDropdownValue?.name || 'Language'}
      </span>
    </Dropdown>
  )
}
