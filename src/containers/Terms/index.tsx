'use client'

import { DataStateTermsType, useTermActions } from '@store/reducers/terms'
import { DataStateFoldersType } from '@store/reducers/folders'
import SVGRightArrow from '@public//svg/rightarrow.svg'
import ClientTerm from '@entities/ClientTerm'
import MetaLabel from '@components/MetaLabel'
import { unique, remove } from '@lib/array'
import { useSelector } from 'react-redux'
import Term from '@components/Term'
import { useMemo } from 'react'
import Link from 'next/link'

export default function Terms({ folderUUID }: { folderUUID: string }) {
  const actions = useTermActions()
  const terms = useSelector(({ terms }: { terms: DataStateTermsType }) => terms[folderUUID])
  const folders = useSelector(({ folders }: { folders: DataStateFoldersType }) => folders)
  const folder = useMemo(() => folders.items.find((item) => item.uuid === folderUUID), [folderUUID])

  return (
    <div>
      <div className="flex px-4 gap-2 items-center justify-between">
        <div className="flex items-center text-gray-400 font-semibold gap-1">
          <Link href="/" className="text-gray-400 hover:text-gray-500">
            Folders
          </Link>

          <SVGRightArrow
            width={24}
            height={24}
            className="text-gray-600"
          />

          <span>{folder?.name}</span>
        </div>

        <div
          onClick={() => {
            const term = new ClientTerm(folderUUID).serialize()
            actions.addTerm({ term, editUUID: term.uuid })
          }}
          className="border border-gray-400 bg-gray-500 w-5 h-5 rounded-full hover:bg-gray-600 active:bg-gray-700 transition-colors hover:cursor-pointer flex items-center justify-center select-none"
        >
          +
        </div>
      </div>

      {terms &&
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 p-4">
          {terms.items.map((folder) => {
            return (
              <Term
                data={folder}
                key={folder.uuid}
                edit={folder.uuid === terms.editUUID}
                process={terms.processUUIDs.includes(folder.uuid)}
                onExit={async () => {
                  const { editUUID, processUUIDs } = terms
                  const editFolder = terms.items.find(({uuid}) => uuid === editUUID)

                  actions.updateTerm({
                    folderUUID,
                    editUUID: null,
                    processUUIDs: unique([...processUUIDs, editUUID]),
                  })

                  fetch(`http://localhost:3000/api/terms/${editUUID}`, {
                    method: 'PUT',
                    body: JSON.stringify(editFolder),
                    headers: {'Content-Type': 'application/json'},
                  }).then(() => {
                    actions.updateTerm({ folderUUID, processUUIDs: remove(processUUIDs, editUUID) })
                  })
                }}
                onEdit={() => {
                  actions.updateTerm({ folderUUID, editUUID: folder.uuid })
                }}
                onChange={(question) => {
                  actions.updateTerm({
                    folderUUID,
                    items: terms.items.map((item) => {
                      return item.uuid === terms.editUUID ? {...item, question} : item
                    })
                  })
                }}
                onRemove={() => {
                  actions.updateTerm({
                    folderUUID,
                    processUUIDs: unique([...terms.processUUIDs, folder.uuid]),
                  })

                  fetch(`http://localhost:3000/api/terms/${folder.uuid}`, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                  }).then(() => {
                    actions.updateTerm({
                      folderUUID,
                      processUUIDs: remove(terms.processUUIDs, folder.uuid),
                      items: terms.items.filter((item) => item.uuid !== folder.uuid)
                    })
                  })
                }}
                label={<MetaLabel>{`Terms`}</MetaLabel>}
              />
            )
          })}
        </div>
      }
    </div>
  )
}
