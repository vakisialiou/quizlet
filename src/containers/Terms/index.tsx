'use client'

import { filterDeletedTerms, filterEmptyTerms } from '@helper/terms'
import ClientTerm, {ClientTermData} from '@entities/ClientTerm'
import TextToSpeech, { TextToSpeechEvents } from '@lib/speech'
import { FoldersType, TermsType } from '@store/initial-state'
import React, { useEffect, useMemo, useState } from 'react'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import Button, { ButtonSkin } from '@components/Button'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import { searchTerms } from '@helper/search-terms'
import ContentPage from '@containers/ContentPage'
import SVGFileNew from '@public/svg/file_new.svg'
import FolderTitle from '@containers/FolderTitle'
import { sortTerms } from '@helper/sort-terms'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import SVGPlay from '@public/svg/play.svg'
import {useRouter} from '@i18n/routing'
import {useSelector} from 'react-redux'
import Dialog from '@components/Dialog'
import Term from '@containers/Term'
import {
  actionSaveTerm,
  actionUpdateTerm,
  actionUpdateTermItem
} from '@store/index'
import clsx from 'clsx'

export default function Terms({ folderId }: { folderId: string }) {
  const router = useRouter()

  const [ originItem, setOriginItem ] = useState<ClientTermData | null>(null)
  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)
  const editTermInfo = useSelector(({ terms }: { terms: TermsType }) => terms)

  const [removeTerm, setRemoveTerm] = useState<ClientTermData | null>(null)

  const folder = useMemo(() => {
    return folders.items.find(({ id }) => id === folderId)
  }, [folders.items, folderId])

  const [search, setSearch] = useState<string>('')

  const visibleItems = useMemo(() => {
    return filterDeletedTerms([...folder?.terms || []])
  }, [folder?.terms])

  const terms = useMemo(() => {
    let rawItems = [...visibleItems]

    if (search) {
      rawItems = searchTerms(rawItems, search, editTermInfo.editId)
    }

    return sortTerms(rawItems)
  }, [visibleItems, search, editTermInfo.editId])

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

  const playTerms = useMemo(() => {
    return filterEmptyTerms([...folder?.terms || []])
  }, [folder?.terms])

  const [showUserHelp, setShowUserHelp] = useState(false)

  const t = useTranslations('Terms')

  return (
    <ContentPage
      showHeader
      showFooter
      options={{
        padding: true,
        scrollbarGutter: true,
      }}
      title={(
        <HeaderPageTitle
          title={t('headTitle')}
          search={{
            value: search || '',
            placeholder: t('searchPlaceholder'),
            onClear: () => setSearch(''),
            onChange: ({ formattedValue }) => setSearch(formattedValue)
          }}
        />
      )}
      rightControls={(
        <>
          <ButtonSquare
            icon={SVGQuestion}
            disabled={showUserHelp}
            onClick={() => setShowUserHelp(true)}
          />

          <ButtonSquare
            icon={SVGBack}
            onClick={() => {
              router.push(`/private`)
            }}
          />
        </>
      )}
      footer={(
        <div className="flex w-full justify-center text-center">
          <div className="flex gap-2 w-full max-w-96">
            <Button
              skin={ButtonSkin.WHITE}
              className="w-1/2 gap-1"
              onClick={() => {
                const term = new ClientTerm(folderId)
                  .setOrder(visibleItems.length + 1)
                  .serialize()

                actionSaveTerm({ term, editId: term.id }, () => {
                  setOriginItem(term)
                })
              }}
            >
              <SVGFileNew
                width={28}
                height={28}
                className="text-gray-700"
              />
              {t('footButtonCreateTerm')}
            </Button>
            <Button
              skin={ButtonSkin.GREEN}
              disabled={playTerms.length === 0}
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
                className={clsx('text-gray-100', {
                  ['text-gray-500/50']: playTerms.length === 0
                })}
              />
              {t('footButtonPlay')}
            </Button>
          </div>
        </div>
      )}
    >

      <FolderTitle
        folderId={folderId}
        className="mb-4"
      />

      {folder &&
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2"
        >
          {terms.map((term, index) => {
            return (
              <Term
                data={term}
                key={term.id}
                number={index + 1}
                edit={term.id === editTermInfo.editId}
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
                      speech.stop().setLang(lang).setVoice(speech.selectVoice(lang)).speak(text)
                    }
                  }
                }}
              />
            )
          })}
        </div>
      }

      {showUserHelp &&
        <Dialog
          title={t('userHelpTitle')}
          text={(
            <div className="flex flex-col gap-4 text-gray-800">

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection1Title')}</div>
                {t('userHelpSection1Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection2Title')}</div>
                {t('userHelpSection2Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection3Title')}</div>
                {t('userHelpSection3Text')}
              </div>
            </div>
          )}
        >
          <Button
            className="min-w-28 px-4"
            skin={ButtonSkin.GRAY}
            onClick={() => {
              setShowUserHelp(false)
            }}
          >
            {t('userHelpButtonClose')}
          </Button>
        </Dialog>
      }

      {removeTerm &&
        <Dialog
          title={removeTerm.question || removeTerm.answer || t('removeDialogTitle')}
          text={t('removeDialogText')}
        >
          <Button
            className="min-w-28 px-4"
            skin={ButtonSkin.GRAY}
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
            skin={ButtonSkin.WHITE}
            onClick={() => setRemoveTerm(null)}
          >
            {t('removeDialogButtonCancel')}
          </Button>
        </Dialog>
      }
    </ContentPage>
  )
}
