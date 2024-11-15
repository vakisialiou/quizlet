'use client'

import { FoldersType, TermsType } from '@store/initial-state'
import SVGRightArrow from '@public//svg/rightarrow.svg'
import { useEffect, useMemo, useState } from 'react'
import ClientTerm from '@entities/ClientTerm'
import { useSelector } from 'react-redux'
import Term from '@components/Term'
import Link from 'next/link'
import {
  actionDeleteTerm,
  actionFetchFolders,
  actionSaveTerm,
  actionUpdateTerm,
  actionUpdateTermItem
} from '@store/index'

export default function Terms({ folderId }: { folderId: string }) {
  useEffect(actionFetchFolders, [])

  const [ originItem, setOriginItem ] = useState<ClientTerm | null>(null)
  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)
  const terms = useSelector(({ terms }: { terms: TermsType }) => terms)

  const folder = useMemo(() => {
    return folders.items.find(({ id }) => id === folderId)
  }, [folders.items, folderId])

  return (
    <div>
      <div className="flex px-4 gap-2 items-center justify-between">
        <div className="flex items-center text-gray-400 font-semibold gap-1">
          <Link href="/private" className="text-gray-400 hover:text-gray-500">
            Folders
          </Link>

          <SVGRightArrow
            width={24}
            height={24}
            className="text-gray-600"
          />

          <span className="text-gray-600">{folder?.name}</span>
        </div>

        <div
          onClick={() => {
            const term = new ClientTerm(folderId).serialize()
            actionSaveTerm({ term, editId: term.id })
          }}
          className="border border-gray-400 bg-gray-500 w-5 h-5 rounded-full hover:bg-gray-600 active:bg-gray-700 transition-colors hover:cursor-pointer flex items-center justify-center select-none"
        >
          +
        </div>
      </div>

      {folder &&
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 p-4">
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
