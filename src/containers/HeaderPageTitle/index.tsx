import React, {BaseSyntheticEvent, ReactNode, useState} from 'react'
import ButtonSquare from '@components/ButtonSquare'
import SVGZoomAll from '@public/svg/viewzoom.svg'
import Search from '@components/Search'
import clsx from "clsx";

export type SearchProps = {
  value: string,
  className?: string
  placeholder?: string,
  onClear: () => void,
  onChange: (params: { event: BaseSyntheticEvent, value: string, formattedValue: string }) => void
}

export default function HeaderPageTitle(
  {
    title,
    search
  }:
  {
    title?: ReactNode,
    search?: SearchProps
  }
) {
  const [searchFocus, setSearchFocus] = useState(false)

  return (
    <div className="flex items-center justify-between overflow-hidden w-full max-w-full">
      {(title && !searchFocus) &&
        <div className="flex gap-2 items-center justify-start w-full pr-2">
          <span className="text-gray-500 font-bold truncate ...">
            {title}
          </span>
        </div>
      }

      {(search && searchFocus) &&
        <Search
          rounded
          bordered
          autoFocus
          onClear={search.onClear}
          onChange={(event) => {
            search.onChange({
              event,
              value: event.target.value,
              formattedValue: event.target.value ? `${event.target.value}`.toLocaleLowerCase() : '',
            })
          }}
          onKeyUp={(e) => {
            switch (e.keyCode) {
              case 27:
                if (search.value) {
                  search.onClear()
                }
                break
            }
          }}
          value={search.value || ''}
          className={clsx('w-full max-w-full', {
            [search.className || '']: search.className
          })}
          placeholder={search.placeholder || ''}
          onBlur={() => {
            if (!search.value) {
              setSearchFocus(false)
            }
          }}
        />
      }

      {(search && !searchFocus) &&
        <ButtonSquare
          icon={SVGZoomAll}
          onClick={() => {
            setSearchFocus(true)
          }}
        />
      }
    </div>
  )
}
