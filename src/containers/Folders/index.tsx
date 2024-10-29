'use client'

import { DataStateFoldersType, useFolderActions } from '@store/reducers/folders'
import ClientFolder, { ClientFolderType } from '@entities/ClientFolder'
import { DataStateTermsType } from '@store/reducers/terms'
import MetaLabel from '@components/MetaLabel'
import { unique, remove } from '@lib/array'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Folder from '@components/Folder'
import { useState } from 'react'

export default function Folders() {
  const router = useRouter()
  const [ originItem, setOriginItem ] = useState<ClientFolderType | null>(null)
  const folders = useSelector(({ folders }: { folders: DataStateFoldersType }) => folders)
  const terms = useSelector(({ terms }: { terms: DataStateTermsType }) => terms)
  const actions = useFolderActions()

  return (
    <div>
      <div className="flex px-4 gap-2 items-center justify-between">
        <div className="flex items-center text-gray-400 font-semibold gap-1">Folders</div>

        <div
          onClick={() => {
            const folder = new ClientFolder().serialize()
            actions.addFolder({ folder, editUUID: folder.uuid })
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
              key={folder.uuid}
              href={`/folder/${folder.uuid}`}
              edit={folder.uuid === folders.editUUID}
              process={folders.processUUIDs.includes(folder.uuid)}
              dropdownItems={[
                {id: 1, name: 'Edit'},
                {id: 2, name: 'Learn', disabled: (terms[folder.uuid]?.items?.length || 0) === 0},
                {id: 3, name: 'Remove', disabled: (terms[folder.uuid]?.items?.length || 0) > 0},
              ]}
              onDropdownSelect={(id) => {
                switch (id) {
                  case 1:
                    setOriginItem({ ...folder })
                    actions.updateFolder({ editUUID: folder.uuid })
                    break
                  case 2:
                    router.push(`/simulator/${folder.uuid}`)
                    break
                  case 3:
                    actions.updateFolder({
                      processUUIDs: unique([...folders.processUUIDs, folder.uuid]),
                    })

                    fetch(`http://localhost:3000/api/folders/${folder.uuid}`, {
                      method: 'DELETE',
                      headers: {'Content-Type': 'application/json'},
                    }).then(() => {
                      actions.updateFolder({
                        processUUIDs: remove(folders.processUUIDs, folder.uuid),
                        items: folders.items.filter((item) => item.uuid !== folder.uuid)
                      })
                    })
                    break
                }
              }}
              onSave={() => {
                setOriginItem(null)

                const editFolder = folders.items.find(({uuid}) => uuid === folder.uuid)

                actions.updateFolder({
                  editUUID: null,
                  processUUIDs: unique([...folders.processUUIDs, folder.uuid]),
                })

                fetch(`http://localhost:3000/api/folders/${folder.uuid}`, {
                  method: 'PUT',
                  body: JSON.stringify(editFolder),
                  headers: {'Content-Type': 'application/json'},
                }).then(() => {
                  actions.updateFolder({ processUUIDs: remove(folders.processUUIDs, folder.uuid) })
                })
              }}
              onExit={async () => {
                actions.updateFolder({
                  editUUID: null,
                  items: folders.items.map((item) => {
                    return item.uuid === originItem?.uuid ? { ...originItem } : item
                  })
                })
                setOriginItem(null)
              }}
              onChange={(prop, value) => {
                actions.updateFolder({
                  items: folders.items.map((item) => {
                    return item.uuid === folder.uuid ? {...item, [prop]: value } : item
                  })
                })
              }}
              label={<MetaLabel>{`Terms ${terms[folder.uuid]?.items?.length || 0}`}</MetaLabel>}
            />
          )
        })}
      </div>
    </div>
  )
}
