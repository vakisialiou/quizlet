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
import { createPortal } from 'react-dom'
import Divide from '@components/Divide'
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
  divider?: boolean,
  disabled?: boolean
  className?: string,
  name?: ReactNode | string,
  href?: string | null | undefined,
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export enum DropdownSkin {
  gray = 'gray',
  white = 'white',
  transparent = 'transparent'
}

function Dropdown(
  {
    bordered = false,
    children,
    selected,
    caret = false,
    disabled = false,
    className = '',
    classNameMenu = '',
    menu,
    placement = Placement.bottomEnd,
    skin = DropdownSkin.transparent,
    offsetOptions = 4,
    items = [],
    onSelect,
    onClick,
  }:
  {
    menu?: ReactNode,
    children: ReactNode,
    selected?: string | number | null,
    caret?: boolean,
    bordered?: boolean,
    disabled?: boolean,
    className?: string,
    classNameMenu?: string,
    placement?: Placement,
    skin?: DropdownSkin,
    offsetOptions?: number,
    items?: (DropdownItemType)[],
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
      className={clsx('flex items-center text-left transition-all', {
        ['border']: bordered,
        ['disabled']: disabled,
        ['hover:bg-gray-800']: skin === DropdownSkin.transparent,
        ['bg-gray-800']: skin === DropdownSkin.transparent && isOpen,

        ['bg-gray-800 hover:bg-gray-800/50']: skin === DropdownSkin.gray,
        ['bg-gray-800/50']: skin === DropdownSkin.gray && isOpen,

        ['bg-white hover:bg-gray-200/50']: skin === DropdownSkin.white,
        ['bg-gray-300/50']: skin === DropdownSkin.white && isOpen
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
            className={clsx('fixed z-10 mt-1 border ring-1 ring-black ring-opacity-5 focus:outline-none select-none px-1', {
              [classNameMenu]: classNameMenu,
              ['border-gray-600/50 bg-black shadow-lg']: skin === DropdownSkin.gray,
              ['border-gray-100/50 bg-white shadow-md']: skin === DropdownSkin.white,
              ['border-gray-500/50 bg-black shadow-lg']: skin === DropdownSkin.transparent
            })}
          >
            {items.length > 0 &&
              <div className="py-1">
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
                  return (
                    <Component
                      {...attr}
                      key={item.id}
                      className={clsx('group flex gap-3 items-center px-3 py-2 text-sm transition-colors', {
                        ['cursor-pointer']: !item.disabled,
                        ['disabled pointer-events-none']: item.disabled,

                        ['text-gray-400 hover:text-gray-200 hover:bg-gray-900 active:bg-gray-800']: item.id !== selected && skin === DropdownSkin.gray,
                        ['text-gray-900 hover:text-gray-100 hover:bg-gray-600 active:bg-gray-500']: item.id !== selected && skin === DropdownSkin.white,
                        ['text-gray-500 hover:text-gray-200 hover:bg-gray-900 active:bg-gray-800']: item.id !== selected && skin === DropdownSkin.transparent,

                        ['bg-gray-900 text-gray-600']: item.id === selected && skin === DropdownSkin.gray,
                        ['bg-gray-700 text-gray-200']: item.id === selected && skin === DropdownSkin.white,
                        ['bg-gray-800 text-gray-300']: item.id === selected && skin === DropdownSkin.transparent,

                        [item.className || '']: item.className
                      })}
                      onClick={() => {
                        setIsOpen(false)
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
