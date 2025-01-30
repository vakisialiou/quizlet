'use client'

import React, { useCallback, useMemo, useState, useImperativeHandle, Ref, forwardRef } from 'react'
import { actionUpsertTerm, actionEditTerm } from '@store/action-main'
import Button, { ButtonVariant } from '@components/Button'
import { useMainSelector } from '@hooks/useMainSelector'
import { searchTerms } from '@helper/search-terms'
import { filterDeletedTerms } from '@helper/terms'
import Term, { TermData } from '@entities/Term'
import { useSpeech } from '@hooks/useSpeech'
import {sortTerms} from '@helper/sort-terms'
import TermCard from '@containers/TermCard'
import {useTranslations} from 'next-intl'
import { OrderEnum } from '@helper/sort'
import Dialog from '@components/Dialog'

function Grid(
  {
    order,
    search,
    editable,
  }:
  {
    search: string
    order: OrderEnum
    editable: boolean
  },
  ref: Ref<{ onCreate?: () => void }>
) {
  const [ originItem, setOriginItem ] = useState<TermData | null>(null)
  const [ removeTerm, setRemoveTerm ] = useState<TermData | null>(null)


  const edit = useMainSelector(({ edit }) => edit)
  const terms = useMainSelector(({ terms }) => terms)
  const visibleTerms = useMemo(() => filterDeletedTerms(terms), [terms])

  const filteredTerms = useMemo(() => {
    let rawItems = [...visibleTerms]

    if (search) {
      rawItems = searchTerms(rawItems, search, edit.termId)
    }

    return sortTerms(rawItems, order)
  }, [visibleTerms, search, order, edit.termId])

  const orderedTerms = useMemo(() => {
    return sortTerms(filteredTerms, order)
  }, [filteredTerms, order])

  const { speech, soundInfo, setSoundInfo } = useSpeech<{ playingName: string | null, termId: string | null }>({ playingName: null, termId: null })

  const onCreate = useCallback(() => {
    const term = new Term().serialize()

    actionUpsertTerm({ term, editId: term.id, editable }, () => {
      setOriginItem(term)
    })
  }, [editable])

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
        {orderedTerms.map((term, index) => {
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
                  })
                }}
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
              actionUpsertTerm({
                term: { ...removeTerm, deleted: true },
                editId: null,
                editable,
              }, () => {
                setRemoveTerm(null)
                if (originItem && originItem.id === removeTerm.id) {
                  setOriginItem(null)
                }
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
