import { TermData, DefaultAnswerLang, DefaultAssociationLang, DefaultQuestionLang } from '@entities/Term'
import { useTermSelect } from '@hooks/useTermSelect'
import ButtonSquare from '@components/ButtonSquare'
import { searchTerms } from '@helper/search-terms'
import React, { useMemo, useState } from 'react'
import { filterDeletedTerms } from '@helper/terms'
import SVGClose from '@public/svg/x.svg'
import Search from '@components/Search'
import clsx from 'clsx'

export default function SearchTermList(
  {
    onClick,
    onClose,
    className = '',
    excludeTerms
  }: {
    className?: string
    onClose: () => void
    onClick: (term: TermData) => void
    excludeTerms: TermData[]
  }
) {
  const { terms } = useTermSelect()
  const [ search, setSearch ] = useState('')

  const dropdownTerms = useMemo(() => {
    const excludeTermIds = excludeTerms.reduce((previousValue, currentValue) => {
      return { ...previousValue, [currentValue.id]: true }
    }, {}) as { [key: string]: boolean }

    const visibleTerms = filterDeletedTerms(terms)
      .filter(({ id }) => !excludeTermIds[id])

    if (search) {
      return searchTerms(visibleTerms, search)
    }
    return visibleTerms
  }, [excludeTerms, terms, search])

  return (
    <div
      className={clsx('flex flex-col gap-2 bg-black/95', {
        [className]: className
      })}
    >
      <div className="flex justify-between items-center w-full border-b border-white/15 p-4 bg-black">
        <div className="text-white/50 text-base">
          Add term
        </div>
        <ButtonSquare
          size={32}
          icon={SVGClose}
          onClick={onClose}
        />
      </div>

      <Search
        autoFocus
        value={search}
        className="p-2"
        placeholder="Search term"
        onClear={() => setSearch('')}
        onChange={(e) => setSearch(e.target.value)}
      />

      {dropdownTerms.length === 0 &&
        <div className="px-4 text-white/50 italic w-full text-center text-sm">
          {search &&
            <div>
              Ниечго не найдено.
            </div>
          }

          {!search &&
            <div>
              В вашем списке еще нет терминов.
            </div>
          }
        </div>
      }

      <div className="px-2 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-1">
        {dropdownTerms.map((term) => {
          return (
            <div
              key={term.id}
              onClick={() => {
                onClick(term)
              }}
              className={clsx('flex flex-col px-3 py-2 text-sm text-start transition-colors cursor-pointer', {
                ['hover:text-gray-200 hover:bg-gray-900 active:bg-gray-800']: true,
                ['text-gray-500 text-gray-300 bg-white/5']: true
              })}
            >
              <div className="flex justify-between">
                <div>{term.question || 'Not set'}</div>
                <div className="uppercase">{term.questionLang || DefaultQuestionLang}</div>
              </div>

              <div className="flex justify-between">
                <div>{term.answer || 'Not set'}</div>
                <div className="uppercase">{term.answerLang || DefaultAnswerLang}</div>
              </div>

              {term.association &&
                <div className="flex justify-between">
                  <div>{term.association}</div>
                  <div className="uppercase">{term.associationLang || DefaultAssociationLang}</div>
                </div>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}
