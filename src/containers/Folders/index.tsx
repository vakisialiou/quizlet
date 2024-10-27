'use client'

import { DataStateType, addFolder, updateFolder } from '@store/reducers/folders'
import { useSelector, useDispatch } from 'react-redux'
import ClientFolder from '@entities/ClientFolder'
import MetaLabel from '@components/MetaLabel'
import { unique, remove } from '@lib/array'
import Folder from '@components/Folder'

export default function Folders() {
  const dispatch = useDispatch()
  const folders = useSelector(({ folders }: { folders: DataStateType }) => folders)
  console.log(folders)

  return (
    <div>
      <div className="flex px-4 gap-2 items-center">
        Folders

        <div
          onClick={() => {
            const folder = new ClientFolder().serialize()
            dispatch(addFolder({ folder, editUUID: folder.uuid }))
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
              onExit={async () => {
                const { editUUID, processUUIDs } = folders
                const editFolder = folders.items.find(({uuid}) => uuid === editUUID)

                dispatch(updateFolder({
                  editUUID: null,
                  processUUIDs: unique([...processUUIDs, editUUID]),
                }))

                fetch(`http://localhost:3000/api/folder/${editUUID}`, {
                  method: 'PUT',
                  body: JSON.stringify(editFolder),
                  headers: {'Content-Type': 'application/json'},
                }).then(() => {
                  dispatch(updateFolder({ processUUIDs: remove(processUUIDs, editUUID) }))
                })
              }}
              onEdit={() => {
                dispatch(updateFolder({ editUUID: folder.uuid }))
              }}
              onChange={(name) => {
                dispatch(updateFolder({
                  items: folders.items.map((item) => {
                    return item.uuid === folders.editUUID ? {...item, name} : item
                  })
                }))
              }}
              onRemove={() => {
                dispatch(updateFolder({
                  processUUIDs: unique([...folders.processUUIDs, folder.uuid]),
                }))

                fetch(`http://localhost:3000/api/folder/${folder.uuid}`, {
                  method: 'DELETE',
                  headers: {'Content-Type': 'application/json'},
                }).then(() => {
                  dispatch(updateFolder({
                    processUUIDs: remove(folders.processUUIDs, folder.uuid),
                    items: folders.items.filter((item) => item.uuid !== folder.uuid)
                  }))
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
