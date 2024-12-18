import { BaseSyntheticEvent, FocusEventHandler, KeyboardEventHandler } from 'react'
import Input, { InputVariantFocus, InputVariant } from '@components/Input'
import ButtonSquare from '@components/ButtonSquare'
import SVGZoomAll from '@public/svg/viewzoom.svg'
import SVGClose from '@public/svg/x.svg'
import clsx from 'clsx'

export enum SearchVariant {
  none = InputVariant.none,
  gray = InputVariant.gray,
}

export enum SearchVariantFocus {
  none = InputVariantFocus.none,
  blue = InputVariantFocus.blue
}

export type SearchProps = {
  className?: string
  rounded?: boolean
  bordered?: boolean
  autoFocus?: boolean
  placeholder?: string
  defaultValue?: string
  value?: string
  variant?: SearchVariant
  variantFocus?: SearchVariantFocus
  onChange?: (e: BaseSyntheticEvent) => void
  onKeyUp?: KeyboardEventHandler
  onFocus?: FocusEventHandler
  onBlur?: FocusEventHandler,
  onClear?: () => void
}

export default function Search(
  {
    className = '',
    rounded,
    bordered,
    autoFocus = false,
    variant = SearchVariant.gray,
    variantFocus = SearchVariantFocus.blue,
    placeholder,
    value,
    defaultValue,
    onChange,
    onKeyUp,
    onFocus,
    onBlur,
    onClear
  }: SearchProps
) {
  return (
    <div
      className={clsx('flex', {
        [className]: className
      })}
    >
      <label
        className={clsx('flex items-center w-full overflow-hidden border', {
          ['focus-within:border-blue-500']: variantFocus === SearchVariantFocus.blue,
          ['bg-gray-800 text-gray-300']: variant === SearchVariant.gray,
          ['border-transparent']: !bordered,
          ['border-gray-500/50']: bordered,
          ['rounded']: rounded,
        })}
      >
        <SVGZoomAll
          width={24}
          height={24}
          className="text-gray-700 ml-2 min-w-6"
        />

        <Input
          value={value}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyUp={onKeyUp}
          onChange={onChange}
          autoFocus={autoFocus}
          placeholder={placeholder}
          defaultValue={defaultValue}
          variant={InputVariant[variant]}
          variantFocus={InputVariantFocus.none}
        />

        {value &&
          <ButtonSquare
            size={24}
            icon={SVGClose}
            onClick={onClear}
            className="mr-1 min-w-6"
          />
        }
      </label>
    </div>
  )
}
