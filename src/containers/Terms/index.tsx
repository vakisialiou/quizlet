'use client'

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
import Term from '@components/Term'
import {
  actionDeleteTerm,
  actionFetchFolders,
  actionSaveTerm,
  actionUpdateTerm,
  actionUpdateTermItem
} from '@store/index'
// import Achievement from '@entities/Achievement'

export default function Terms({ folderId }: { folderId: string }) {
  useEffect(actionFetchFolders, [])

  const router = useRouter()

  const [ originItem, setOriginItem ] = useState<ClientTermData | null>(null)
  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)
  const terms = useSelector(({ terms }: { terms: TermsType }) => terms)

  const [removeTerm, setRemoveTerm] = useState<ClientTermData | null>(null)

  const folder = useMemo(() => {
    return folders.items.find(({ id }) => id === folderId)
  }, [folders.items, folderId])

  // const achievements = new Achievement().calculate(folder?.simulators || [])
  // console.log(folder?.simulators || [], achievements)

  return (
    <ContentPage
      showHeader
      showFooter
      title={folder?.name}
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
                const term = new ClientTerm(folderId).serialize()
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
          {folder.terms.map((term) => {
            return (
              <Term
                data={term}
                key={term.id}
                edit={term.id === terms.editId}
                process={terms.processIds.includes(term.id)}
                onSave={() => {
                  actionSaveTerm({ term, editId: null }, () => {
                    if (originItem) {
                      setOriginItem(null)
                    }
                  })
                }}
                onExit={async () => {
                  actionUpdateTerm({ editId: null }, () => {
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
