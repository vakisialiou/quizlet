import { BaseSyntheticEvent, FocusEventHandler, KeyboardEventHandler } from 'react'
import clsx from 'clsx'

export enum InputVariant {
  none = 'none',
  gray = 'gray',
}

export enum InputVariantFocus {
  none = 'none',
  blue = 'blue'
}

export enum InputSize {
  h12 = 'h12',
  h11 = 'h11',
  h10 = 'h10',
  h8 = 'h8',
  h6 = 'h6'
}

export type InputProps = {
  className?: string
  type?: string
  name?: string
  size?: InputSize
  rounded?: boolean
  bordered?: boolean
  autoFocus?: boolean
  autoComplete?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  variant?: InputVariant
  variantFocus?: InputVariantFocus
  onChange?: (e: BaseSyntheticEvent) => void
  onKeyUp?: KeyboardEventHandler
  onFocus?: FocusEventHandler
  onBlur?: FocusEventHandler,
}

export default function Input(
  {
    type,
    name,
    size = InputSize.h8,
    bordered,
    rounded,
    autoComplete,
    autoFocus,
    placeholder,
    value,
    defaultValue,
    className = '',
    variant = InputVariant.gray,
    variantFocus = InputVariantFocus.blue,
    onChange,
    onKeyUp,
    onFocus,
    onBlur
  }: InputProps
) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyUp={onKeyUp}
      onChange={onChange}
      autoFocus={autoFocus}
      placeholder={placeholder}
      autoComplete={autoComplete}
      defaultValue={defaultValue}
      className={clsx('block border w-full', {
        [className]: className,
        ['h-12 px-4 text-lg']: size === InputSize.h12,
        ['h-11 px-4 text-md']: size === InputSize.h11,
        ['h-10 px-2 text-md']: size === InputSize.h10,
        ['h-8 px-2 text-sm']: size === InputSize.h8,
        ['h-6 px-1 text-sm']: size === InputSize.h6,
        ['bg-gray-800 text-gray-300 placeholder-gray-500']: variant === InputVariant.gray,
        ['focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-opacity-75 focus:border-blue-500']: variantFocus === InputVariantFocus.blue,
        ['focus:outline-none']: variantFocus === InputVariantFocus.none,
        ['border-transparent']: !bordered,
        ['border-gray-500/50']: bordered,
        ['rounded']: rounded,
      })}
    />
  )
}
