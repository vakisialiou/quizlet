import Dropdown, { DropdownVariant } from '@components/Dropdown'
import ColorLabel, { ColorEnum } from '@components/ColorLabel'
import {BaseSyntheticEvent, useRef} from 'react'

export const colors = [
  ColorEnum.white5, ColorEnum.white15, ColorEnum.white45, ColorEnum.white75, ColorEnum.white95,
  ColorEnum.amber600, ColorEnum.red600, ColorEnum.fuchsia600, ColorEnum.green600, ColorEnum.blue600
]

export default function ColorDropdown(
  {
    caret,
    variant,
    onClick,
    onChange,
    className,
    selected,
    readonly
  }:
  {
    caret?: boolean,
    readonly?: boolean,
    className?: string,
    selected?: ColorEnum,
    variant?: DropdownVariant
    onChange?: (color: ColorEnum) => void
    onClick?: ((e: BaseSyntheticEvent) => void),
  },
) {
  const ref = useRef<{ close?: () => void }>(null)
  return (
    <Dropdown
      ref={ref}
      caret={caret}
      onClick={onClick}
      variant={variant}
      disabled={readonly}
      className={className}
      menu={(
        <div className="grid grid-cols-5 gap-2 p-2">
          {colors.map((color) => {
            return (
              <ColorLabel
                hover
                size={4}
                rounded
                key={color}
                color={color}
                onClick={() => {
                  if (onChange) {
                    onChange(color)
                    if (ref.current?.close) {
                      ref.current.close()
                    }
                  }
                }}
                active={color === selected}
              />
            )
          })}
        </div>
      )}
    >
      <ColorLabel
        size={4}
        rounded
        color={selected || ColorEnum.white15}
      />
    </Dropdown>
  )
}
