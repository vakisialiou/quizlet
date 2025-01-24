'use client'

import React, { useCallback, useMemo, useState, useImperativeHandle, Ref, forwardRef } from 'react'
import {
  actionCreateSharedTerm,
  actionUpsertSharedTerm,
  actionEditSharedTerm
} from '@store/action-share'
import {
  actionUpsertTerm
} from '@store/action-main'
import Button, { ButtonVariant } from '@components/Button'
import { useShareSelector } from '@hooks/useShapeSelector'
import { useMainSelector } from '@hooks/useMainSelector'
import { ModuleShareData } from '@entities/ModuleShare'
import { filterDeletedTerms } from '@helper/terms'
import RelationTerm from '@entities/RelationTerm'
import {searchTerms} from '@helper/search-terms'
import Term, { TermData } from '@entities/Term'
import { useSpeech } from '@hooks/useSpeech'
import {sortTerms} from '@helper/sort-terms'
import TermCard from '@containers/TermCard'
import {useTranslations} from 'next-intl'
import Dialog from '@components/Dialog'

export type TypeFilterGrid = {
  search: string | null,
}

function Grid(
  {
    share,
    filter,
    editable,
  }:
  {
    editable: boolean
    filter: TypeFilterGrid
    share: ModuleShareData
  },
  ref: Ref<{ onCreate?: () => void }>
) {
  const userModules = useMainSelector(({ modules }) => modules)
  const userHasModule = useMemo(() => {
    return !!userModules.find((module) => module.id === share.moduleId)
  }, [userModules, share.moduleId])

  const tryUpdateMainTermState = useCallback((term: TermData, callback?: () => void) => {
    if (!userHasModule) {
      return
    }
    actionUpsertTerm({ term, editId: null, editable: false }, callback)
  }, [userHasModule])

  const [ originItem, setOriginItem ] = useState<TermData | null>(null)
  const [ removeTerm, setRemoveTerm ] = useState<TermData | null>(null)

  const edit = useShareSelector((state) => state.edit)
  const terms = useShareSelector((state) => state.terms)
  const visibleTerms = useMemo(() => filterDeletedTerms(terms), [terms])

  const filteredTerms = useMemo(() => {
    let rawItems = [...visibleTerms]

    if (filter.search) {
      rawItems = searchTerms(rawItems, filter.search, edit.termId)
    }

    return sortTerms(rawItems)
  }, [visibleTerms, filter, edit.termId])

  const { speech, soundInfo, setSoundInfo } = useSpeech<{ playingName: string | null, termId: string | null }>({ playingName: null, termId: null })

  const onCreate = useCallback(() => {
    const term = new Term().serialize()
    const relationTerm = new RelationTerm()
      .setModuleId(share.moduleId)
      .setTermId(term.id)
      .serialize()

    actionCreateSharedTerm({ term, editId: term.id, relationTerm, editable, shareId: share.id }, () => {
      setOriginItem(term)
      tryUpdateMainTermState(term)
    })
  }, [editable, share.moduleId, share.id, tryUpdateMainTermState])

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
                  const updatedTerm = {...term, collapsed: !term.collapsed}
                  actionUpsertSharedTerm({
                    term: updatedTerm,
                    shareId: share.id,
                    editId: null,
                    editable
                  }, () => tryUpdateMainTermState(updatedTerm))
                }}
                onChangeColor={(color) => {
                  actionUpsertTerm({ term: { ...term, color }, editId: edit.termId, editable })
                }}
                onSave={() => {
                  actionUpsertSharedTerm({ term, editId: null, editable, shareId: share.id }, () => {
                    if (originItem) {
                      setOriginItem(null)
                    }
                    tryUpdateMainTermState(term)
                  })
                }}
                onExit={async () => {
                  if (!originItem) {
                    return
                  }

                  actionUpsertSharedTerm({
                    shareId: share.id,
                    term: originItem,
                    editId: null,
                    editable
                  }, () => {
                    setOriginItem(null)
                    tryUpdateMainTermState(originItem)
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
                    editId: updatedTerm.id,
                    shareId: share.id,
                    term: updatedTerm,
                    editable: false
                  }, () => {
                    tryUpdateMainTermState(updatedTerm)
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
              actionUpsertSharedTerm({
                term: { ...removeTerm, deleted: true },
                shareId: share.id,
                editId: null,
                editable
              }, () => {
                tryUpdateMainTermState(removeTerm)
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
