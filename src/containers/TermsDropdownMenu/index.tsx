import { TermData, DefaultAnswerLang, DefaultAssociationLang, DefaultQuestionLang } from '@entities/Term'
import React, { useMemo, useState, SyntheticEvent } from 'react'
import SVGFileBlank from '@public/svg/file_blank.svg'
import { useTermSelect } from '@hooks/useTermSelect'
import { searchTerms } from '@helper/search-terms'
import { filterDeletedTerms } from '@helper/terms'
import { useTranslations } from 'next-intl'
import Search from '@components/Search'
import clsx from 'clsx'

export default function TermsDropdownList(
  {
    onClick,
    onCreate,
    excludeTerms,
    className = ''
  }: {
    className?: string
    onClick: (term: TermData) => void
    onCreate: (e: SyntheticEvent) => void
    excludeTerms: TermData[]
  }
) {
  const t = useTranslations('Terms')
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
      className={clsx('flex flex-col bg-black/95', {
        [className]: className
      })}
    >
      <Search
        autoFocus
        value={search}
        className="py-2 px-2.5"
        placeholder={t('termSearch')}
        onClear={() => setSearch('')}
        onChange={(e) => {
          setSearch(e.target.value)
        }}
      />

      <div
        onClick={onCreate}
        className={clsx('relative flex gap-2 items-center px-3 py-2 text-sm text-start transition-colors cursor-pointer mx-2.5 border border-white/25', {
          ['hover:text-gray-200 hover:bg-gray-900 active:bg-gray-800']: true,
          ['text-gray-500 bg-black']: true
        })}
      >
        <div className="absolute left-0 top-0 w-full h-full bg-white/10"/>

        <SVGFileBlank
          width={18}
          height={18}
        />
        {t('termCreate')}
      </div>

      <div className="w-full h-[1px] border-b border-white/15 mt-2"/>

      <div
        className="flex flex-col py-2 pl-2.5 pr-0.5 gap-0.5 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100/50 active:scrollbar-thumb-gray-400"
        style={{scrollbarGutter: 'stable'}}
      >
        {dropdownTerms.length === 0 &&
          <div className="px-4 text-white/50 italic w-full text-center text-xs font-bold">
            {search &&
              <div>
                {t('emptySearchList')}
              </div>
            }

            {!search &&
              <div>
                {t('emptyList')}
              </div>
            }
          </div>
        }

        {dropdownTerms.map((term) => {
          return (
            <div
              key={term.id}
              onClick={() => {
                onClick(term)
              }}
              className={clsx('relative flex flex-col px-3 py-1 text-xs text-start transition-colors cursor-pointer', {
                ['hover:text-gray-200 hover:bg-gray-900 active:bg-gray-800']: true,
                ['text-gray-500 bg-black']: true
              })}
            >
              <div className="absolute left-0 top-0 w-full h-full bg-white/10"/>

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
