'use client'

import { FoldersType } from '@store/initial-state'
import ClientFolder from '@entities/ClientFolder'
import MetaLabel from '@components/MetaLabel'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { upsertObject } from '@lib/array'
import { useSelector} from 'react-redux'
import Folder from '@components/Folder'
import {
  actionSaveFolder,
  actionDeleteFolder,
  actionUpdateFolder,
  actionFetchFolders,
  actionUpdateFolderItem
} from '@store/index'

export default function Folders() {
  useEffect(actionFetchFolders, [])

  const router = useRouter()
  const [ originItem, setOriginItem ] = useState<ClientFolder | null>(null)
  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  return (
    <div>
      <div className="flex px-4 gap-2 items-center justify-between">
        <div className="flex items-center text-gray-400 font-semibold gap-1">Folders</div>

        <div
          onClick={() => {
            const folder = new ClientFolder().serialize()
            actionSaveFolder({ folder, editId: folder.id })
          }}
          className="border border-gray-400 bg-gray-500 w-5 h-5 rounded-full hover:bg-gray-600 active:bg-gray-700 transition-colors hover:cursor-pointer flex items-center justify-center select-none"
        >
          +
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 p-4">
        {folders.items.map((folder) => {
          return (
            <Folder
              data={folder}
              key={folder.id}
              href={`/private/folder/${folder.id}`}
              edit={folder.id === folders.editId}
              process={folders.processIds.includes(folder.id)}
              dropdownItems={[
                {id: 1, name: 'Edit'},
                {id: 2, name: 'Learn', disabled: (folder.terms.length || 0) === 0},
                {id: 3, name: 'Remove', disabled: (folder.terms.length || 0) > 0},
              ]}
              onDropdownSelect={(id) => {
                switch (id) {
                  case 1:
                    actionUpdateFolder({ editId: folder.id }, () => setOriginItem(folder))
                    break
                  case 2:
                    router.push(`/private/simulator/${folder.id}`)
                    break
                  case 3:
                    actionDeleteFolder(folder, () => {
                      if (originItem && originItem.id === folder.id) {
                        setOriginItem(null)
                      }
                    })
                    break
                }
              }}
              onSave={() => {
                actionSaveFolder({ folder, editId: null }, () => {
                  setOriginItem(null)
                })
              }}
              onExit={() => {
                actionUpdateFolder({
                  editId: null,
                  items: upsertObject([...folders.items], originItem as ClientFolder) as ClientFolder[]
                }, () => setOriginItem(null))
              }}
              onChange={(prop, value) => {
                actionUpdateFolderItem({ ...folder, [prop]: value } as ClientFolder)
              }}
              label={<MetaLabel>{`Terms ${folder.terms.length || 0}`}</MetaLabel>}
            />
          )
        })}
      </div>
    </div>
  )
}
