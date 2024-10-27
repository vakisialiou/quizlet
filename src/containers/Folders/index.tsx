'use client'

import EntityFolder, { ClientFolderType } from '@entities/ClientFolder'
import MetaLabel from '@components/MetaLabel'
import { unique, remove } from '@lib/array'
import Folder from '@components/Folder'
import { useState, memo } from 'react'

export type DataStateType = {
  items: ClientFolderType[],
  editUUID: string | number | null,
  processUUIDs: (string | number)[]
}

const Folders = memo(({ folders }: { folders: ClientFolderType[] }) => {
  const [ data, setData ] = useState<DataStateType>({ items: [...folders], editUUID: null, processUUIDs: [] })

  return (
    <div>
      <div className="flex px-4 gap-2 items-center">
        Folders

        <div
          onClick={() => setData((prevState) => {
            const entry = new EntityFolder()
            const items = [...prevState.items, entry]
            return {...prevState, items, editUUID: entry.uuid}
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
              data={folder}
              key={folder.uuid}
              href={`/folder/${folder.uuid}`}
              edit={folder.uuid === data.editUUID}
              process={data.processUUIDs.includes(folder.uuid)}
              onExit={async () => {
                const {editUUID} = data
                const editFolder = data.items.find(({uuid}) => uuid === editUUID)

                setData((prevState) => {
                  return {
                    ...prevState,
                    editUUID: null,
                    processUUIDs: editUUID ? unique([...data.processUUIDs, editUUID]) : data.processUUIDs,
                  }
                })

                fetch(`http://localhost:3000/api/folder/${editUUID}`, {
                  method: 'PUT',
                  body: JSON.stringify(editFolder),
                  headers: {'Content-Type': 'application/json'},
                }).then(() => {
                  setData((prevState) => {
                    return {...prevState, processUUIDs: remove(data.processUUIDs, editUUID)}
                  })
                })
              }}
              onEdit={() => {
                setData((prevState) => {
                    return {...prevState, editUUID: folder.uuid}
                  }
                )
              }}
              onChange={(name) => {
                setData((prevState) => {
                  return {
                    ...prevState,
                    items: prevState.items.map((item) => {
                      return item.uuid === prevState.editUUID ? {...item, name} : item
                    })
                  }
                })
              }}
              onRemove={() => {
                setData((prevState) => {
                  return {
                    ...prevState,
                    processUUIDs: unique([...data.processUUIDs, folder.uuid]),
                  }
                })

                fetch(`http://localhost:3000/api/folder/${folder.uuid}`, {
                  method: 'DELETE',
                  headers: {'Content-Type': 'application/json'},
                }).then(() => {
                  setData((prevState) => {
                    return {
                      ...prevState,
                      processUUIDs: remove(data.processUUIDs, folder.uuid),
                      items: prevState.items.filter((item) => item.uuid !== folder.uuid)
                    }
                  })
                })
              }}
              label={<MetaLabel>{`Terms ${folder.count}`}</MetaLabel>}
            />
          )
        })}
      </div>
    </div>
  )
})

export default Folders
