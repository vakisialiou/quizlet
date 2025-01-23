import { TermData, DefaultAnswerLang, DefaultAssociationLang, DefaultQuestionLang } from '@entities/Term'
import React, { useMemo, useState, SyntheticEvent } from 'react'
import { useMainSelector } from '@hooks/useMainSelector'
import { searchTerms } from '@helper/search-terms'
import { filterDeletedTerms } from '@helper/terms'
import { findTerms } from '@helper/relation'
import { useTranslations } from 'next-intl'
import SVGAdd from '@public/svg/add.svg'
import Search from '@components/Search'
import clsx from 'clsx'

export default function TermsDropdownList(
  {
    onClick,
    onCreate,
    moduleId,
    excludeTermIds,
    className = ''
  }: {
    moduleId?: string
    className?: string
    onClick: (term: TermData) => void
    onCreate: (e: SyntheticEvent) => void
    excludeTermIds: string[]
  }
) {
  const t = useTranslations('Terms')
  const terms = useMainSelector(({ terms }) => terms)
  const relationTerms = useMainSelector(({ relationTerms }) => relationTerms)
  const [ search, setSearch ] = useState('')
  const [ showModuleTerms, setShowModuleTerms ] = useState(!!moduleId)

  const rawTerms = useMemo(() => {
    return showModuleTerms ? findTerms(relationTerms, terms, { moduleId }) : terms
  }, [showModuleTerms, terms, relationTerms, moduleId])

  const excludedTerms = useMemo(() => {
    const excludeTermIdsMap = excludeTermIds.reduce((map, id) => {
      return { ...map, [id]: true }
    }, {}) as { [key: string]: boolean }

    return filterDeletedTerms(rawTerms)
      .filter(({ id }) => !excludeTermIdsMap[id])
  }, [rawTerms, excludeTermIds])

  const dropdownTerms = useMemo(() => {
    return search ? searchTerms(excludedTerms, search) : excludedTerms
  }, [excludedTerms, search])

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

      <div className="flex gap-1 px-2 border-b border-white/25 text-xs text-white/50">
        <div
          className={clsx('border-t border-l border-r border-white/25 rounded-t flex items-center px-2 py-1', {
            ['cursor-pointer hover:bg-white/10 active:bg-white/15']: showModuleTerms,
            ['bg-white/15']: !showModuleTerms
          })}
          onClick={() => {
            if (showModuleTerms) {
              setShowModuleTerms(false)
            }
          }}
        >
          {t('tabAllCards')}
        </div>

        {moduleId &&
          <div
            className={clsx('border-t border-l border-r border-white/25 rounded-t flex items-center px-2 py-1', {
              ['cursor-pointer hover:bg-white/10 active:bg-white/15']: !showModuleTerms,
              ['bg-white/15']: showModuleTerms
            })}
            onClick={() => {
              if (!showModuleTerms) {
                setShowModuleTerms(true)
              }
            }}
          >
            {t('tabRelatedCards')}
          </div>
        }

        <div
          onClick={onCreate}
          className={clsx('border-t border-l border-r border-white/25 rounded-t flex items-center px-2 py-1', {
            ['cursor-pointer hover:bg-white/10 active:bg-white/15']: true,
          })}
        >
          <SVGAdd
            width={18}
            height={18}
          />
        </div>
      </div>

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
