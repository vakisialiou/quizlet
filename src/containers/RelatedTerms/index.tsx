'use client'

import React, { useCallback, useMemo, useState, useImperativeHandle, Ref, forwardRef } from 'react'
import {filterRelatedTerms, searchRelatedTerms} from '@helper/search-terms'
import RelationTerm, {RelatedTermData} from '@entities/RelationTerm'
import Button, { ButtonVariant } from '@components/Button'
import { useMainSelector } from '@hooks/useMainSelector'
import { TermFiltersData } from '@entities/TermFilters'
import { COLOR_DEFAULT } from '@components/ColorLabel'
import { sortRelatedTerms } from '@helper/sort-terms'
import { findTermIntersections } from '@helper/terms'
import ColorDropdown from '@components/ColorDropdown'
import { findRelationTerm } from '@helper/relation'
import Term, { TermData } from '@entities/Term'
import { RelationProps} from '@helper/relation'
import { useSpeech } from '@hooks/useSpeech'
import TermCard from '@containers/TermCard'
import {useTranslations} from 'next-intl'
import { OrderEnum } from '@helper/sort'
import Dialog from '@components/Dialog'
import {
  actionEditTerm,
  actionUpsertTerm,
  actionCreateRelationTerm,
  actionRemoveRelationTerm,
  actionUpdateRelationTerm
} from '@store/action-main'

function RelatedTerms(
  {
    relatedTerms,
    relation,
    editable,
    search,
    filter,
    order,
  }:
  {
    search: string
    order: OrderEnum
    editable: boolean
    relation: RelationProps
    filter: TermFiltersData
    relatedTerms: RelatedTermData[]
  },
  ref: Ref<{ onCreate?: (color?: number) => void }>
) {
  const [ originItem, setOriginItem ] = useState<TermData | null>(null)
  const [ removeTerm, setRemoveTerm ] = useState<TermData | null>(null)

  const relationTerms = useMainSelector(({ relationTerms }) => relationTerms)
  const edit = useMainSelector(({ edit }) => edit)

  const filteredTerms = useMemo(() => {
    let rawItems = [...relatedTerms]
    if (search) {
      rawItems = searchRelatedTerms(rawItems, search, edit.termId)
    }

    return filterRelatedTerms(rawItems, filter, edit.termId)
  }, [relatedTerms, search, filter, edit.termId])

  const sortedTerms = useMemo(() => {
    return sortRelatedTerms([...filteredTerms], order)
  }, [filteredTerms, order])

  const termIntersections = useMemo(() => {
    return findTermIntersections(sortedTerms.map(({ term }) => term))
  }, [sortedTerms])

  const { speech, soundInfo, setSoundInfo } = useSpeech<{ playingName: string | null, termId: string | null }>({ playingName: null, termId: null })

  const onCreate = useCallback((color?: number) => {
    color = !color || [null, -1].includes(color) ? COLOR_DEFAULT : color

    const term = new Term()
      .serialize()

    const relationTerm = new RelationTerm()
      .setModuleId(relation.moduleId || null)
      .setFolderId(relation.folderId || null)
      .setOrder(relatedTerms.length + 1)
      .setTermId(term.id)
      .setColor(color)
      .serialize()

    actionUpsertTerm({ term, editId: term.id, editable }, () => {
      actionCreateRelationTerm({ relationTerm, editable }, () => {
        setOriginItem(term)
      })
    })
  }, [editable, relation, relatedTerms])

  useImperativeHandle(ref, () => ({ onCreate }))

  const t = useTranslations('Terms')

  return (
    <>
      {sortedTerms.length > 0 &&
        <div
          className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2"
        >
          {sortedTerms.map(({ term, relation }, index) => {
            const intersections = termIntersections[term.id] || []

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
                  warn={intersections.length > 0}
                  soundPlayingName={soundInfo.termId === term.id ? soundInfo.playingName : null}
                  controls={(
                    <ColorDropdown
                      className="p-2"
                      selected={relation.color || COLOR_DEFAULT}
                      onClick={(e) => e.preventDefault()}
                      onChange={(color) => {
                        actionUpdateRelationTerm({
                          editable,
                          relationTerm: { ...relation, color }
                        })
                      }}
                    />
                  )}
                  onSave={() => {
                    actionUpsertTerm({ term, editId: null, editable }, () => {
                      if (originItem) {
                        setOriginItem(null)
                      }
                    })
                  }}
                  onExit={async () => {
                    if (!originItem) {
                      return
                    }

                    actionUpsertTerm({
                      term: originItem,
                      editId: null,
                      editable,
                    }, () => {
                      setOriginItem(null)
                    })
                  }}
                  onEdit={() => {
                    actionEditTerm({ editId: term.id }, () => {
                      setOriginItem(term)
                    })
                  }}
                  onChange={(prop, value) => {
                    const updatedTerm = { ...term, [prop]: value } as Term
                    actionUpsertTerm({
                      editId: updatedTerm.id,
                      term: updatedTerm,
                      editable: false,
                    })
                  }}
                  onRemove={() => setRemoveTerm(term)}
                  onClickSound={({ play, text, name, lang }) => {
                    if (!speech) {
                      return
                    }

                    if (!play) {
                      speech.stop()
                      return
                    }

                    if (text && play) {
                      setSoundInfo({ playingName: name, termId: term.id })
                      speech.stop().setLang(lang).setVoice(speech.selectVoice(lang)).speak(text)
                    }
                  }}
                />
              </div>
            )
          })}
        </div>
      }

      {removeTerm &&
        <Dialog
          title={removeTerm.question || removeTerm.answer || t('removeDialogTitle')}
          text={t('removeDialogText')}
        >
          <Button
            className="min-w-28 px-4"
            variant={ButtonVariant.GRAY}
            onClick={() => {
              const relationTerm = findRelationTerm(relationTerms, relation, removeTerm.id)
              if (!relationTerm) {
                return
              }

              actionRemoveRelationTerm({ relationTerm, editable }, () => {
                if (originItem && originItem.id === removeTerm.id) {
                  setOriginItem(null)
                }
                setRemoveTerm(null)
              })
            }}
          >
            {t('removeDialogButtonApprove')}
          </Button>

          <Button
            className="min-w-28 px-4"
            variant={ButtonVariant.WHITE}
            onClick={() => setRemoveTerm(null)}
          >
            {t('removeDialogButtonCancel')}
          </Button>
        </Dialog>
      }
    </>
  )
}

export default forwardRef(RelatedTerms)
