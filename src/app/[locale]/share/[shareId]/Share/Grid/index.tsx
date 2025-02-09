'use client'

import React, { useCallback, useMemo, useState, useImperativeHandle, Ref, forwardRef } from 'react'
import { filterRelatedTerms, searchRelatedTerms } from '@helper/search-terms'
import RelationTerm, { RelationTermData } from '@entities/RelationTerm'
import { findTermsWithRelations, getModule } from '@helper/relation'
import { useShareSelector } from '@hooks/useShapeSelector'
import { useMainSelector } from '@hooks/useMainSelector'
import { ModuleShareData } from '@entities/ModuleShare'
import { TermFiltersData } from '@entities/TermFilters'
import { COLOR_DEFAULT } from '@components/ColorLabel'
import ColorDropdown from '@components/ColorDropdown'
import { sortRelatedTerms } from '@helper/sort-terms'
import { filterDeletedTerms } from '@helper/terms'
import Term, { TermData } from '@entities/Term'
import { useSpeech } from '@hooks/useSpeech'
import TermCard from '@containers/TermCard'
import {useTranslations} from 'next-intl'
import { OrderEnum } from '@helper/sort'
import {
  actionCreateSharedTerm,
  actionUpsertSharedTerm,
  actionEditSharedTerm,
} from '@store/action-share'
import {
  actionUpdateRelationTerm,
  actionUpsertTerm
} from '@store/action-main'

function Grid(
  {
    share,
    order,
    filter,
    search,
    editable,
  }:
  {
    search: string
    order: OrderEnum
    editable: boolean
    share: ModuleShareData
    filter: TermFiltersData
  },
  ref: Ref<{ onCreate?: (color?: number) => void }>
) {
  const mainModules = useMainSelector(({ modules }) => modules)
  const userModule = useMemo(() => {
    return getModule(mainModules, share.moduleId)
  }, [mainModules, share.moduleId])

  const tryUpdateMainTermState = useCallback((term: TermData, relation: RelationTermData) => {
    if (!userModule) {
      return
    }
    actionUpsertTerm({ term, editId: null, editable: false }, () => {
      actionUpdateRelationTerm({ relationTerm: relation, editable: false })
    })
  }, [userModule])

  const [ originItem, setOriginItem ] = useState<TermData | null>(null)

  const edit = useShareSelector((state) => state.edit)
  const terms = useShareSelector((state) => state.terms)
  const relationTerms = useShareSelector((state) => state.relationTerms)

  const relatedTerms = useMemo(() => {
    const visibleTerms = filterDeletedTerms(terms)
    return findTermsWithRelations(relationTerms, visibleTerms, { moduleId: share.moduleId })
  }, [relationTerms, terms, share.moduleId])

  const filteredItems = useMemo(() => {
    let rawItems = [...relatedTerms]
    if (search) {
      rawItems = searchRelatedTerms(rawItems, search, edit.termId)
    }

    return filterRelatedTerms(rawItems, filter, edit.termId)
  }, [relatedTerms, search, filter, edit.termId])

  const sortedItems = useMemo(() => {
    return sortRelatedTerms([...filteredItems], order)
  }, [filteredItems, order])

  const { speech, soundInfo, setSoundInfo } = useSpeech<{ playingName: string | null, termId: string | null }>({ playingName: null, termId: null })

  const onCreate = useCallback((color?: number) => {
    color = !color || [null, -1].includes(color) ? COLOR_DEFAULT : color
    const term = new Term().serialize()
    const relationTerm = new RelationTerm()
      .setOrder(sortedItems.length + 1)
      .setModuleId(share.moduleId)
      .setTermId(term.id)
      .setColor(color)
      .serialize()

    actionCreateSharedTerm({ term, editId: term.id, relationTerm, editable, shareId: share.id }, () => {
      setOriginItem(term)
      tryUpdateMainTermState(term, relationTerm)
    })
  }, [editable, share.moduleId, share.id, sortedItems, tryUpdateMainTermState])

  useImperativeHandle(ref, () => ({ onCreate }))

  const t = useTranslations('Terms')

  return (
    <>
      {editable && terms.length === 0 &&
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          <div className="text-white/50 text-sm italic text-center">
            {t('noCardsHelper')}
          </div>
        </div>
      }

      <div
        className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2"
      >
        {sortedItems.map(({ term, relation }, index) => {
          return (
            <div
              key={term.id}
              className="overflow-hidden"
            >
              <TermCard
                data={term}
                number={index + 1}
                readonly={!editable}
                edit={term.id === edit.termId}
                soundPlayingName={soundInfo.termId === term.id ? soundInfo.playingName : null}
                controls={(
                  <ColorDropdown
                    className="p-2"
                    readonly={!editable}
                    selected={relation.color || COLOR_DEFAULT}
                    onClick={(e) => e.preventDefault()}
                    onChange={(color) => {
                      const updatedTerm = { ...term }
                      const updateRelationTerm = { ...relation, color }
                      actionUpsertSharedTerm({
                        editable,
                        term: updatedTerm,
                        shareId: share.id,
                        editId: edit.termId,
                        relationTerm: updateRelationTerm
                      }, () => tryUpdateMainTermState(updatedTerm, updateRelationTerm))
                    }}
                  />
                )}
                onSave={() => {
                  actionUpsertSharedTerm({ term, relationTerm: relation, editId: null, editable, shareId: share.id }, () => {
                    if (originItem) {
                      setOriginItem(null)
                    }
                    tryUpdateMainTermState(term, relation)
                  })
                }}
                onExit={async () => {
                  if (!originItem) {
                    return
                  }

                  actionUpsertSharedTerm({
                    relationTerm: relation,
                    shareId: share.id,
                    term: originItem,
                    editId: null,
                    editable
                  }, () => {
                    setOriginItem(null)
                    tryUpdateMainTermState(originItem, relation)
                  })
                }}
                onEdit={() => {
                  actionEditSharedTerm({ editId: term.id }, () => {
                    setOriginItem(term)
                  })
                }}
                onChange={(prop, value) => {
                  const updatedTerm = { ...term, [prop]: value } as Term
                  actionUpsertSharedTerm({
                    relationTerm: relation,
                    editId: updatedTerm.id,
                    shareId: share.id,
                    term: updatedTerm,
                    editable: false
                  }, () => {
                    tryUpdateMainTermState(updatedTerm, relation)
                  })
                }}
                onClickSound={({ play, text, name, lang }) => {
                  if (speech) {
                    if (!play) {
                      speech.stop()
                      return
                    }

                    if (text && play) {
                      setSoundInfo({ playingName: name, termId: term.id })
                      speech.stop().setLang(lang).setVoice(speech.selectVoice(lang)).speak(text)
                    }
                  }
                }}
              />
            </div>
          )
        })}
      </div>

    </>
  )
}

export default forwardRef(Grid)
