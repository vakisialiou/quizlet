import { BaseSyntheticEvent, FocusEventHandler, KeyboardEventHandler } from 'react'
import clsx from 'clsx'

export enum TextareaVariant {
  none = 'none',
  gray = 'gray',
}

export enum TextareaVariantFocus {
  none = 'none',
  blue = 'blue'
}

export enum TextareaSize {
  h12 = 'h12',
  h11 = 'h11',
  h10 = 'h10',
  h8 = 'h8',
  h6 = 'h6'
}

export type TextareaProps = {
  className?: string
  name?: string
  rows?: number
  size?: TextareaSize
  rounded?: boolean
  bordered?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  maxLength?: number
  autoComplete?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  variant?: TextareaVariant
  variantFocus?: TextareaVariantFocus
  onChange?: (e: BaseSyntheticEvent) => void
  onKeyUp?: KeyboardEventHandler
  onFocus?: FocusEventHandler
  onBlur?: FocusEventHandler,
  onInput?: (e: BaseSyntheticEvent) => void
}

export default function Textarea(
  {
    name,
    rows = 4,
    size = TextareaSize.h8,
    bordered,
    rounded,
    maxLength,
    autoComplete,
    autoFocus,
    placeholder,
    value,
    readOnly,
    defaultValue,
    className = '',
    variant = TextareaVariant.gray,
    variantFocus = TextareaVariantFocus.blue,
    onChange,
    onInput,
    onKeyUp,
    onFocus,
    onBlur
  }: TextareaProps
) {
  return (
    <textarea
      rows={rows}
      name={name}
      value={value}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyUp={onKeyUp}
      onInput={onInput}
      readOnly={readOnly}
      onChange={onChange}
      autoFocus={autoFocus}
      maxLength={maxLength}
      placeholder={placeholder}
      autoComplete={autoComplete}
      defaultValue={defaultValue}
      className={clsx('block border w-full', {
        [className]: className,
        ['px-4 text-lg']: size === TextareaSize.h12,
        ['px-4 text-md']: size === TextareaSize.h11,
        ['px-2 text-md']: size === TextareaSize.h10,
        ['px-2 text-sm']: size === TextareaSize.h8,
        ['px-1 text-sm']: size === TextareaSize.h6,
        ['bg-gray-800 text-gray-300 placeholder-gray-500']: variant === TextareaVariant.gray,
        ['focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-opacity-75 focus:border-blue-500']: variantFocus === TextareaVariantFocus.blue,
        ['focus:outline-none']: variantFocus === TextareaVariantFocus.none,
        ['border-transparent']: !bordered,
        ['border-gray-500/50']: bordered,
        ['rounded']: rounded,
      })}
    />
  )
}
