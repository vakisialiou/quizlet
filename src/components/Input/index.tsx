import {BaseSyntheticEvent, FocusEventHandler, KeyboardEventHandler} from 'react'
import clsx from 'clsx'

export default function Input(
  { type, name, bordered, rounded, autoComplete, autoFocus, placeholder, defaultValue, onChange, onKeyUp, onBlur }:
  {
    type?: string
    name?: string
    rounded?: boolean
    bordered?: boolean
    autoFocus?: boolean
    autoComplete?: string
    placeholder?: string
    defaultValue?: string
    onChange?: (e: BaseSyntheticEvent) => void
    onKeyUp?: KeyboardEventHandler
    onBlur?: FocusEventHandler
  }
) {
  return (
    <input
      name={name}
      type={type}
      onBlur={onBlur}
      onKeyUp={onKeyUp}
      onChange={onChange}
      autoFocus={autoFocus}
      placeholder={placeholder}
      autoComplete={autoComplete}
      defaultValue={defaultValue}
      className={clsx('block border w-full bg-gray-800 text-gray-300 h-8 px-2 placeholder-gray-500 text-sm', {
        ['focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-opacity-75 focus:border-blue-500']: true,
        ['border-transparent']: !bordered,
        ['border-gray-800']: bordered,
        ['rounded']: rounded
      })}
    />
  )
}
