'use client'

import { actionUpsertTerm, actionCreateRelationTerm, actionEditTerm, actionRemoveRelationTerm } from '@store/index'
import React, { useCallback, useEffect, useMemo, useState, useImperativeHandle, Ref, forwardRef } from 'react'
import TextToSpeech, { TextToSpeechEvents } from '@lib/speech'
import Button, { ButtonVariant } from '@components/Button'
import { ConfigEditType } from '@store/initial-state'
import { useTermSelect } from '@hooks/useTermSelect'
import { findRelationTerm } from '@helper/relation'
import RelationTerm from '@entities/RelationTerm'
import {searchTerms} from '@helper/search-terms'
import Term, { TermData } from '@entities/Term'
import { RelationProps} from '@helper/relation'
import {sortTerms} from '@helper/sort-terms'
import TermCard from '@containers/TermCard'
import {useTranslations} from 'next-intl'
import { useSelector } from 'react-redux'
import Dialog from '@components/Dialog'

export type TypeFilterGrid = {
  search: string | null,
}

function Grid(
  {
    relation,
    shareId,
    editable,
    filter,
    relatedTerms
  }:
  {
    editable: boolean
    shareId: string | null
    relation: RelationProps
    filter: TypeFilterGrid
    relatedTerms: TermData[]
  },
  ref: Ref<{ onCreate?: () => void }>
) {
  const { relationTerms } = useTermSelect()

  const [ originItem, setOriginItem ] = useState<TermData | null>(null)
  const [removeTerm, setRemoveTerm] = useState<TermData | null>(null)

  const edit = useSelector(({ edit }: { edit: ConfigEditType }) => edit)

  const filteredTerms = useMemo(() => {
    let rawItems = [...relatedTerms]

    if (filter.search) {
      rawItems = searchTerms(rawItems, filter.search, edit.termId)
    }

    return sortTerms(rawItems)
  }, [relatedTerms, filter, edit.termId])

  const speech = useMemo(() => {
    return typeof(window) === 'object' ? new TextToSpeech() : null
  }, [])

  const [ soundInfo, setSoundInfo ] = useState<{ playingName: string | null, termId: string | null }>({ playingName: null, termId: null })

  useEffect(() => {
    if (speech) {
      const onEndCallback = () => {
        setSoundInfo({ playingName: null, termId: null })
      }
      speech.addEventListener(TextToSpeechEvents.end, onEndCallback)
      return () => {
        speech.removeEventListener(TextToSpeechEvents.end, onEndCallback)
      }
    }
  }, [speech, setSoundInfo])

  const onCreate = useCallback(() => {
    const term = new Term()
      .setOrder(relatedTerms.length + 1)
      .serialize()

    const relationTerm = new RelationTerm()
      .setModuleId(relation.moduleId || null)
      .setFolderId(relation.folderId || null)
      .setTermId(term.id)
      .serialize()

    actionUpsertTerm({ term, editId: term.id, editable, shareId }, () => {
      actionCreateRelationTerm({ relationTerm, editable }, () => {
        setOriginItem(term)
      })
    })
  }, [relatedTerms])

  useImperativeHandle(ref, () => ({ onCreate }))

  const t = useTranslations('Terms')

  return (
    <>
      {editable && relatedTerms.length === 0 &&
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          <div className="text-white/50 text-sm italic text-center">
            {t('noCardsHelper', { btnName: t('footButtonCreateTerm') })}
          </div>
        </div>
      }

      <div
        className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2"
      >
        {filteredTerms.map((term, index) => {
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
                collapsed={term.collapsed && term.id !== edit.termId}
                soundPlayingName={soundInfo.termId === term.id ? soundInfo.playingName : null}
                onCollapse={() => {
                  actionUpsertTerm({
                    term: {...term, collapsed: !term.collapsed},
                    editId: null,
                    editable,
                    shareId
                  })
                }}
                onSave={() => {
                  actionUpsertTerm({ term, editId: null, editable, shareId }, () => {
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
                    shareId
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
                    shareId
                  })
                }}
                onRemove={() => setRemoveTerm(term)}
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

export default forwardRef(Grid)
