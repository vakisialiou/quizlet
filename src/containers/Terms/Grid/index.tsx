'use client'

import ClientTerm, {ClientTermData} from '@entities/ClientTerm'
import TextToSpeech, { TextToSpeechEvents } from '@lib/speech'
import React, { useEffect, useMemo, useState } from 'react'
import Button, { ButtonVariant } from '@components/Button'
import { filterDeletedTerms } from '@helper/terms'
import { searchTerms } from '@helper/search-terms'
import { TermsType } from '@store/initial-state'
import { sortTerms } from '@helper/sort-terms'
import { useTranslations } from 'next-intl'
import {useSelector} from 'react-redux'
import Dialog from '@components/Dialog'
import Term from '@containers/Term'
import {
  actionSaveTerm,
  actionUpdateTerm,
  actionUpdateTermItem
} from '@store/index'

export default function Grid(
  {
    terms,
  }:
  {
    terms: ClientTermData[]
  }
) {
  const t = useTranslations('Terms')

  const [ originItem, setOriginItem ] = useState<ClientTermData | null>(null)

  const editTermInfo = useSelector(({ terms }: { terms: TermsType }) => terms)

  const [removeTerm, setRemoveTerm] = useState<ClientTermData | null>(null)

  const speech = useMemo(() => {
    return typeof(window) === 'object' ? new TextToSpeech() : null
  }, [])

  const [ soundInfo, setSoundInfo ] = useState<{
    playingName: string | null,
    termId: string | null
  }>({ playingName: null, termId: null })

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

  return (
    <>
      <div
        className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2"
      >
        {terms.map((term, index) => {
          return (
            <div
              key={term.id}
              className="overflow-hidden"
            >
              <Term
                data={term}
                number={index + 1}
                edit={term.id === editTermInfo.editId}
                collapsed={term.collapsed && term.id !== editTermInfo.editId}
                soundPlayingName={soundInfo.termId === term.id ? soundInfo.playingName : null}
                onCollapse={() => {
                  actionSaveTerm({
                    term: {...term, collapsed: !term.collapsed},
                    editId: editTermInfo.editId
                  })
                }}
                onSave={() => {
                  actionSaveTerm({term, editId: null}, () => {
                    if (originItem) {
                      setOriginItem(null)
                    }
                  })
                }}
                onExit={async () => {
                  actionUpdateTerm({editId: null}, () => {
                    if (originItem) {
                      actionUpdateTermItem(originItem, () => {
                        setOriginItem(null)
                      })
                    }
                  })
                }}
                onEdit={() => {
                  actionUpdateTerm({editId: term.id}, () => {
                    setOriginItem(term)
                  })
                }}
                onChange={(prop, value) => {
                  actionUpdateTermItem({...term, [prop]: value} as ClientTerm)
                }}
                onRemove={() => setRemoveTerm(term)}
                onClickSound={({play, text, name, lang}) => {
                  if (speech) {
                    if (!play) {
                      speech.stop()
                      return
                    }

                    if (text && play) {
                      setSoundInfo({playingName: name, termId: term.id})
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
              actionSaveTerm({ term: { ...removeTerm, deleted: true }, editId: null }, () => {
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
