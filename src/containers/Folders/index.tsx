'use client'

import ClientFolder from '@entities/ClientFolder'
import { remove, upsertObject } from '@lib/array'
import MetaLabel from '@components/MetaLabel'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FoldersType } from '@store/types'
import { useSelector} from 'react-redux'
import Folder from '@components/Folder'
import {
  actionFetchFolders,
  actionPutFolder,
  actionDelFolder,
  actionUpdateFolder,
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
            actionPutFolder(new ClientFolder().serialize())
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
              href={`/folder/${folder.id}`}
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
                    const origin = { ...folder } as ClientFolder
                    actionUpdateFolder({ editId: folder.id }, () => setOriginItem(origin))
                    break
                  case 2:
                    router.push(`/simulator/${folder.id}`)
                    break
                  case 3:
                    actionDelFolder(folder, () => {
                      if (originItem && originItem.id === folder.id) {
                        setOriginItem(null)
                      }
                    })
                    break
                }
              }}
              onSave={() => {
                actionPutFolder(folder, () => {
                  actionUpdateFolder({ editId: null, processIds: remove(folders.processIds, folder.id) }, () => {
                    setOriginItem(null)
                  })
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
