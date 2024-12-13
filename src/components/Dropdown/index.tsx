import { useState, useRef, useEffect, useLayoutEffect, useCallback, useImperativeHandle, forwardRef, ReactNode, BaseSyntheticEvent, Ref } from 'react'
import { autoUpdate, computePosition, offset, shift, flip, ReferenceElement, ComputePositionConfig, FloatingElement } from '@floating-ui/dom'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

enum Placement {
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
  disabled?: boolean
  className?: string,
  name: ReactNode | string,
  href?: string | null | undefined,
}

export enum DropdownSkin {
  gray = 'gray',
  transparent = 'transparent'
}

function Dropdown(
  {
    children,
    selected,
    caret = false,
    disabled = false,
    className = '',
    classNameMenu = '',
    menu,
    placement = Placement.bottomEnd,
    skin = DropdownSkin.transparent,
    offsetOptions = 0,
    items = [],
    onSelect,
    onClick,
  }:
  {
    menu?: ReactNode,
    children: ReactNode,
    selected?: string | number | null,
    caret?: boolean,
    disabled?: boolean,
    className?: string,
    classNameMenu?: string,
    placement?: Placement,
    skin?: DropdownSkin,
    offsetOptions?: number,
    items?: DropdownItemType[],
    onClick?: ((e: BaseSyntheticEvent) => void),
    onSelect?: (id: string | number) => void,
  },
  ref: Ref<{ element: HTMLDivElement | null, menu: HTMLDivElement | null }>
) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const refMenu = useRef<HTMLDivElement | null>(null)
  const refElement = useRef<HTMLDivElement | null>(null)

  useImperativeHandle(ref, () => ({ element: refElement.current, menu: refMenu.current }))

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
      className={clsx('flex items-center text-left', {
        ['disabled']: disabled,
        ['hover:bg-gray-800']: skin === DropdownSkin.transparent,
        ['bg-gray-800']: skin === DropdownSkin.transparent && isOpen,

        ['bg-gray-800 hover:bg-gray-800/50']: skin === DropdownSkin.gray,
        ['bg-gray-800/50']: skin === DropdownSkin.gray && isOpen
      })}
    >
      <div
        onClick={toggleDropdown}
        className={clsx('flex items-center justify-between select-none group cursor-pointer w-full', {
          [className]: className,
        })}
      >
        {children}

        {caret &&
          <svg
            className="w-3 h-3 group-aria-[]:group:text-gray-500 group-active:text-gray-400 transition-colors"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        }
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={refMenu}
            className={clsx('fixed z-10 mt-1 border border-gray-600 bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none select-none', {
              [classNameMenu]: classNameMenu
            })}
          >
            {items.length > 0 &&
              <div className="py-1">
                {items.map((item: DropdownItemType) => {
                  const Component = item.href ? 'a' : 'div'
                  const attr = {} as { href?: string }
                  if (item.href) {
                    attr.href = item.href
                  }
                  return (
                    <Component
                      {...attr}
                      key={item.id}
                      className={clsx('block px-4 py-2 text-sm text-gray-400 transition-colors', {
                        ['bg-gray-900']: item.id === selected,
                        ['disabled pointer-events-none']: item.disabled,
                        ['text-gray-700']: item.disabled,
                        ['hover:bg-gray-900 active:bg-gray-800 cursor-pointer']: !item.disabled,
                        [item.className || '']: item.className
                      })}
                      onClick={() => {
                        setIsOpen(false)
                        if (onSelect) {
                          onSelect(item.id)
                        }
                      }}
                    >
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
