'use client'

import ClientTerm, { ClientTermData } from '@entities/ClientTerm'
import { FoldersType, TermsType } from '@store/initial-state'
import { useEffect, useMemo, useState } from 'react'
import ButtonSquare from '@components/ButtonSquare'
import HeaderPage from '@containers/HeaderPage'
import { useRouter } from 'next/navigation'
import SVGPlus from '@public/svg/plus.svg'
import SVGPlay from '@public/svg/play.svg'
import { useSelector } from 'react-redux'
import Term from '@components/Term'
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
  const terms = useSelector(({ terms }: { terms: TermsType }) => terms)

  const folder = useMemo(() => {
    return folders.items.find(({ id }) => id === folderId)
  }, [folders.items, folderId])

  return (
    <div>
      <HeaderPage
        breadcrumbs={[
          {id: 1, name: 'Home', href: '/'},
          {id: 2, name: 'Folders', href: '/private'},
          {id: 3, name: folder?.name },
        ]}
      >
        <ButtonSquare
          icon={SVGPlus}
          onClick={() => {
            const term = new ClientTerm(folderId).serialize()
            actionSaveTerm({term, editId: term.id})
          }}
        />
        <ButtonSquare
          icon={SVGPlay}
          onClick={() => {
            if (folder) {
              router.push(`/private/simulator/${folder.id}`)
            }
          }}
        />
      </HeaderPage>

        {folder &&
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 p-2 md:p-4">
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
                  onRemove={() => {
                    actionDeleteTerm(term, () => {
                      if (originItem && originItem.id === folder.id) {
                        setOriginItem(null)
                      }
                    })
                  }}
                />
            )
          })}
        </div>
      }
    </div>
  )
}
