'use client'

import EntityFolder, { FolderType } from '@entities/EntityFolder'
import MetaLabel from '@components/MetaLabel'
import Folder from '@components/Folder'
import { useState } from 'react'

export default function Folders({ folders }: { folders: FolderType[] }) {
  const [ data, setData ] = useState<{ items: FolderType[], editUUID: string | number | null }>({
    items: [...folders],
    editUUID: null
  })

  return (
    <div>
      <div className="flex px-4 gap-2 items-center">
        Folders

        <div
          onClick={() => setData((prevState) => {
            const entry = new EntityFolder()
            const items = [ ...prevState.items, entry ]
            return { ...prevState, items, editUUID: entry.uuid }
          })}
          className="border border-gray-400 bg-gray-500 w-5 h-5 rounded-full hover:bg-gray-600 active:bg-gray-700 transition-colors hover:cursor-pointer flex items-center justify-center select-none"
        >
          +
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 p-4">
        {data.items.map((folder) => {
          return (
            <Folder
              key={folder.uuid}
              name={folder.name}
              href={`/folder/${folder.id}`}
              edit={folder.uuid === data.editUUID}
              onExit={() => {
                setData((prevState) => {
                  return { ...prevState, editUUID: null }}
                )
              }}
              onEdit={() => {
                if (folder.id) {
                  setData((prevState) => {
                    return { ...prevState, editUUID: folder.uuid }}
                  )
                }
              }}
              onChange={(name) => {
                setData((prevState) => {
                  return {
                    ...prevState,
                    items: prevState.items.map((item) => {
                      return item.uuid === prevState.editUUID ? { ...item, name } : item
                    })
                  }
                })
              }}
              label={<MetaLabel>{`Terms ${folder.count}`}</MetaLabel>}
            />
          )
        })}
      </div>
    </div>
  )
}
