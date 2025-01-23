import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  BaseSyntheticEvent,
  Ref,
  ComponentType,
  SVGProps
} from 'react'
import { autoUpdate, computePosition, offset, shift, flip, ReferenceElement, ComputePositionConfig, FloatingElement } from '@floating-ui/dom'
import SVGArrowDown from '@public/svg/downarrow_hlt.svg'
import { createPortal } from 'react-dom'
import Divide from '@components/Divide'
import clsx from 'clsx'

export enum DropdownPlacement {
  top = 'top',
  topStart = 'top-start',
  topEnd = 'top-end',
  right = 'right',
  rightStart = 'right-start',
  rightEnd = 'right-end',
  bottom = 'bottom',
  bottomStart = 'bottom-start',
  bottomEnd = 'bottom-end',
  left = 'left',
  leftStart = 'left-start',
  leftEnd = 'left-end',
}

export type DropdownItemType = {
  id: string | number,
  divider?: boolean,
  disabled?: boolean
  className?: string,
  name?: ReactNode | string,
  href?: string | null | undefined,
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export enum DropdownVariant {
  gray = 'gray',
  white = 'white',
  transparent = 'transparent'
}

function Dropdown(
  {
    closeOnSelect = true,
    bordered = false,
    children,
    selected = [],
    caret = false,
    disabled = false,
    className = '',
    classNameMenu = '',
    classNameContainer = '',
    menu,
    placement = DropdownPlacement.bottomEnd,
    variant = DropdownVariant.transparent,
    offsetOptions = 4,
    items = [],
    onSelect,
    onClick,
  }:
  {
    menu?: ReactNode,
    children: ReactNode,
    selected?: (string | number | null)[],
    caret?: boolean,
    closeOnSelect?: boolean,
    bordered?: boolean,
    disabled?: boolean,
    className?: string,
    classNameMenu?: string,
    classNameContainer?: string,
    placement?: DropdownPlacement,
    variant?: DropdownVariant,
    offsetOptions?: number,
    items?: (DropdownItemType)[],
    onClick?: ((e: BaseSyntheticEvent) => void),
    onSelect?: (id: string | number) => void,
  },
  ref: Ref<{ element?: HTMLDivElement | null, menu?: HTMLDivElement | null, close?: (value: boolean) => void }>
) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const refMenu = useRef<HTMLDivElement | null>(null)
  const refElement = useRef<HTMLDivElement | null>(null)

  useImperativeHandle(ref, () => ({
    element: refElement.current,
    menu: refMenu.current,
    close: setIsOpen
  }))

  const toggleDropdown = useCallback(() => {
    setIsOpen((prevState) => !prevState)
  }, [])

  const closeDropdown = useCallback((event: MouseEvent) => {
    if (refMenu.current && refMenu.current.contains(event.target as HTMLDivElement)) {
      return
    }

    if (refElement.current && !refElement.current.contains(event.target as HTMLDivElement)) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', closeDropdown)
    } else {
      document.removeEventListener('mousedown', closeDropdown)
    }
    return () => document.removeEventListener('mousedown', closeDropdown)
  }, [closeDropdown, isOpen])

  useLayoutEffect(() => {
    if (isOpen) {
      const block = refElement.current as ReferenceElement
      const menuBlock = refMenu.current as FloatingElement
      const cleanup = autoUpdate(block, menuBlock, () => {
        const options = {
          strategy: 'fixed',
          placement: placement,
          middleware: [offset(offsetOptions), shift(), flip()],
        } as ComputePositionConfig

        computePosition(block, menuBlock, options).then(({x, y}) => {
          Object.assign(menuBlock.style, {
            left: `${x}px`,
            top: `${y}px`,
          })
        })
      })

      return () => {
        cleanup()
      }
    }
  }, [offsetOptions, placement, isOpen])

  return (
    <div
      ref={refElement}
      onClick={onClick}
      className={clsx('flex items-center text-left transition-all', {
        [classNameContainer]: classNameContainer,
        ['border']: bordered,

        ['border-gray-400']: [DropdownVariant.white, DropdownVariant.transparent, DropdownVariant.gray].includes(variant) && bordered,

        ['disabled']: disabled,
        ['hover:bg-white/15']: variant === DropdownVariant.transparent,
        ['bg-white/15']: variant === DropdownVariant.transparent && isOpen,

        ['bg-gray-800 hover:bg-gray-800/50']: variant === DropdownVariant.gray,
        ['bg-gray-800/50']: variant === DropdownVariant.gray && isOpen,

        ['bg-white hover:bg-gray-200/50']: variant === DropdownVariant.white,
        ['bg-gray-300/50']: variant === DropdownVariant.white && isOpen
      })}
    >
      <div
        onClick={toggleDropdown}
        className={clsx('flex items-center justify-center select-none group cursor-pointer w-full', {
          [className]: className,
          ['text-gray-300 hover:text-gray-100 active:text-gray-50']: variant === DropdownVariant.transparent && isOpen,
          ['text-gray-500 hover:text-gray-400 active:text-gray-300']: variant === DropdownVariant.transparent && !isOpen,

          ['text-gray-200 hover:text-gray-300 active:text-gray-400']: variant === DropdownVariant.gray && isOpen,
          ['text-gray-400 hover:text-gray-300 active:text-gray-200']: variant === DropdownVariant.gray && !isOpen,

          ['text-gray-600 hover:text-gray-700 active:text-gray-800']: variant === DropdownVariant.white && isOpen,
          ['text-gray-800 hover:text-gray-700 active:text-gray-600']: variant === DropdownVariant.white && !isOpen
        })}
      >
        {children}

        {caret &&
          <SVGArrowDown
            width={16}
            height={16}
            className={clsx('w-4 h-4  transition-colors', {
              ['rotate-180']: isOpen,
            })}
          />
        }
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={refMenu}
            className={clsx('fixed z-10 border ring-1 ring-black ring-opacity-5 focus:outline-none select-none', {
              [classNameMenu]: classNameMenu,
              ['border-gray-600/50 bg-black shadow-lg']: variant === DropdownVariant.gray,
              ['border-gray-100/50 bg-white shadow-md']: variant === DropdownVariant.white,
              ['border-gray-500/50 bg-black shadow-lg']: variant === DropdownVariant.transparent
            })}
          >
            {items.length > 0 &&
              <div>
                {items.map((item: DropdownItemType) => {
                  if (item.divider) {
                    return (
                      <Divide
                        key={item.id}
                        className={clsx('divide-gray-600/50', {
                          [item.className || '']: item.className
                        })}
                      />
                    )
                  }
                  const Component = item.href ? 'a' : 'div'
                  const attr = {} as { href?: string }
                  if (item.href) {
                    attr.href = item.href
                  }

                  const IconComponent = item.icon

                  const isItemSelected = selected.includes(item.id)
                  return (
                    <Component
                      {...attr}
                      key={item.id}
                      className={clsx('group flex gap-3 items-center px-3 py-2 text-sm transition-colors', {
                        ['cursor-pointer']: !item.disabled,
                        ['disabled pointer-events-none opacity-30']: item.disabled,

                        ['text-gray-400 hover:text-gray-200 hover:bg-gray-900 active:bg-gray-800']: !isItemSelected && variant === DropdownVariant.gray,
                        ['text-gray-900 hover:text-gray-100 hover:bg-gray-600 active:bg-gray-500']: !isItemSelected && variant === DropdownVariant.white,
                        ['text-gray-500 hover:text-gray-200 hover:bg-gray-900 active:bg-gray-800']: !isItemSelected && variant === DropdownVariant.transparent,

                        ['bg-gray-800 text-gray-400']: isItemSelected&& variant === DropdownVariant.gray,
                        ['bg-gray-700 text-gray-200']: isItemSelected && variant === DropdownVariant.white,
                        ['bg-gray-800 text-gray-300']: isItemSelected && variant === DropdownVariant.transparent,

                        [item.className || '']: item.className
                      })}
                      onClick={() => {
                        if (closeOnSelect) {
                          setIsOpen(false)
                        }
                        if (onSelect) {
                          onSelect(item.id)
                        }
                      }}
                    >
                      {IconComponent &&
                        <IconComponent
                          width={18}
                          height={18}
                          key={item.id}
                          className="transition-colors text-gray-400 group-hover:text-gray-500 group-active:text-gray-600"
                        />
                      }

                      {item.name}
                    </Component>
                  )
                })}
              </div>
            }

            {menu}
          </div>,
          document.body
        )
      }
    </div>
  )
}

export default forwardRef(Dropdown)
