'use client'

import Achievements, { AchievementsSize } from '@containers/Achievements'
import TextToSpeech, { TextToSpeechEvents, voices } from '@lib/speech'
import ClientTerm, {ClientTermData} from '@entities/ClientTerm'
import { FoldersType, TermsType } from '@store/initial-state'
import React, {useEffect, useMemo, useState} from 'react'
import Button, { ButtonSkin } from '@components/Button'
import ButtonSquare from '@components/ButtonSquare'
import ContentPage from '@containers/ContentPage'
import SVGBack from '@public/svg/back.svg'
import SVGPlus from '@public/svg/plus.svg'
import SVGPlay from '@public/svg/play.svg'
import {useRouter} from '@i18n/routing'
import {useSelector} from 'react-redux'
import Dialog from '@components/Dialog'
import Term from '@containers/Term'
import {
  actionDeleteTerm,
  actionFetchFolders,
  actionSaveTerm,
  actionUpdateTerm,
  actionUpdateTermItem
} from '@store/index'

export default function Terms({ folderId }: { folderId: string }) {
  useEffect(actionFetchFolders, [])

  const router = useRouter()

  const [ originItem, setOriginItem ] = useState<ClientTermData | null>(null)
  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)
  const editTermInfo = useSelector(({ terms }: { terms: TermsType }) => terms)

  const [removeTerm, setRemoveTerm] = useState<ClientTermData | null>(null)

  const folder = useMemo(() => {
    return folders.items.find(({ id }) => id === folderId)
  }, [folders.items, folderId])

  const terms = useMemo(() => {
    return [...folder?.terms || []].sort((a, b) => {
      if (a.order === b.order) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return a.order - b.order
    })
  }, [folder?.terms])

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

  return (
    <ContentPage
      showHeader
      showFooter
      title={folder?.name}
      leftControls={(
        <div className="flex items-center mr-2">
          <Achievements
            folder={folder}
            size={AchievementsSize.sm}
          />
        </div>
      )}
      rightControls={(
        <ButtonSquare
          icon={SVGBack}
          onClick={() => {
            router.push(`/private`)
          }}
        />
      )}
      footer={(
        <div className="flex w-full justify-center text-center">
          <div className="flex gap-2 w-full max-w-96">
            <Button
              skin={ButtonSkin.WHITE}
              className="w-1/2 gap-1"
              onClick={() => {
                const term = new ClientTerm(folderId).setOrder(terms.length).serialize()
                actionSaveTerm({term, editId: term.id})
              }}
            >
              <SVGPlus
                width={28}
                height={28}
                className="text-gray-700"
              />
              Create
            </Button>
            <Button
              skin={ButtonSkin.GREEN}
              className="w-1/2 gap-1"
              onClick={() => {
                if (folder) {
                  router.push(`/private/simulator/${folder.id}`)
                }
              }}
            >
              <SVGPlay
                width={28}
                height={28}
                className="text-gray-100"
              />
              Play
            </Button>
          </div>
        </div>
      )}
    >
      {folder &&
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 p-2 md:p-4"
        >
          {terms.map((term, index) => {
            return (
              <Term
                data={term}
                key={term.id}
                number={index + 1}
                edit={term.id === editTermInfo.editId}
                process={editTermInfo.processIds.includes(term.id)}
                soundPlayingName={soundInfo.termId === term.id ? soundInfo.playingName : null}
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
                  actionUpdateTerm({ editId: term.id }, () => {
                    setOriginItem(term)
                  })
                }}
                onChange={(prop, value) => {
                  actionUpdateTermItem({ ...term, [prop]: value } as ClientTerm)
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
                      const item = voices.find((item) => item.lang === lang)
                      speech.stop().setLang(lang).setVoice(item?.name || lang).speak(text)
                    }
                  }
                }}
              />
            )
          })}
        </div>
      }

      {removeTerm &&
        <Dialog
          title={removeTerm.question || removeTerm.answer || 'Term empty'}
          text="Are you sure you want to remove this term?"
        >
          <Button
            className="w-28"
            skin={ButtonSkin.GRAY}
            onClick={() => {
              actionDeleteTerm(removeTerm, () => {
                setRemoveTerm(null)
                if (originItem && originItem.id === removeTerm.id) {
                  setOriginItem(null)
                }
              })
            }}
          >
            Remove
          </Button>

          <Button
            className="w-28"
            skin={ButtonSkin.WHITE}
            onClick={() => setRemoveTerm(null)}
          >
            Cancel
          </Button>
        </Dialog>
      }
    </ContentPage>
  )
}
