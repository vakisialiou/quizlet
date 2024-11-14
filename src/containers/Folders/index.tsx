'use client'

// import { DataStateFoldersType, useFolderActions } from '@store/reducers/folders'
import ClientFolder from '@entities/ClientFolder'
import { DataStateTermsType } from '@store/reducers/terms'
import MetaLabel from '@components/MetaLabel'
import { unique, remove } from '@lib/array'
import { useRouter } from 'next/navigation'
import { useSelector} from 'react-redux'
import Folder from '@components/Folder'
import { useState, useEffect } from 'react'
import { actionFetchFolders, actionPutFolders } from '@store/index'
import { FoldersType } from '@store/types'

export default function Folders() {
  useEffect(actionFetchFolders, [])


  const router = useRouter()
  const [ originItem, setOriginItem ] = useState<ClientFolder | null>(null)
  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  // const actions = useFolderActions()

  console.log(folders)

  return (
    <div>
      <div className="flex px-4 gap-2 items-center justify-between">
        <div className="flex items-center text-gray-400 font-semibold gap-1">Folders</div>

        <div
          onClick={() => {
            // const folder = new ClientFolder().serialize()
            // actions.addFolder({ folder, editUUID: folder.uuid })
            actionPutFolders(new ClientFolder().serialize())
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
                    setOriginItem({ ...folder } as ClientFolder)
                    // actions.updateFolder({ editUUID: folder.uuid })
                    break
                  case 2:
                    router.push(`/simulator/${folder.id}`)
                    break
                  case 3:
                    // actions.updateFolder({
                    //   processUUIDs: unique([...folders.processUUIDs, folder.uuid]),
                    // })

                    fetch(`http://localhost:3000/api/folders/${folder.id}`, {
                      method: 'DELETE',
                      headers: {'Content-Type': 'application/json'},
                    }).then(() => {
                      // actions.updateFolder({
                      //   processUUIDs: remove(folders.processUUIDs, folder.uuid),
                      //   items: folders.items.filter((item) => item.uuid !== folder.uuid)
                      // })
                    })
                    break
                }
              }}
              onSave={() => {
                setOriginItem(null)

                const editFolder = folders.items.find(({id}) => id === folder.id)

                // actions.updateFolder({
                //   editUUID: null,
                //   processUUIDs: unique([...folders.processUUIDs, folder.uuid]),
                // })

                fetch(`http://localhost:3000/api/folders/${folder.id}`, {
                  method: 'PUT',
                  body: JSON.stringify(editFolder),
                  headers: {'Content-Type': 'application/json'},
                }).then(() => {
                  // actions.updateFolder({ processUUIDs: remove(folders.processUUIDs, folder.uuid) })
                })
              }}
              onExit={async () => {
                // actions.updateFolder({
                //   editUUID: null,
                //   items: folders.items.map((item) => {
                //     return item.uuid === originItem?.uuid ? { ...originItem } : item
                //   })
                // })
                setOriginItem(null)
              }}
              onChange={(prop, value) => {
                // actions.updateFolder({
                //   items: folders.items.map((item) => {
                //     return item.uuid === folder.uuid ? {...item, [prop]: value } : item
                //   })
                // })
              }}
              label={<MetaLabel>{`Terms ${folder.terms.length || 0}`}</MetaLabel>}
            />
          )
        })}
      </div>
    </div>
  )
}
