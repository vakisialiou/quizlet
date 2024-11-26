'use client'

import ClientFolder, {ClientFolderData} from '@entities/ClientFolder'
import Button, { ButtonSkin } from '@components/Button'
import {FoldersType} from '@store/initial-state'
import ContentPage from '@containers/ContentPage'
import MetaLabel from '@components/MetaLabel'
import {useEffect, useState} from 'react'
import SVGPlus from '@public/svg/plus.svg'
import {upsertObject} from '@lib/array'
import {useSelector} from 'react-redux'
import Dialog from '@components/Dialog'
import Folder from '@components/Folder'
import {
  actionDeleteFolder,
  actionFetchFolders,
  actionSaveFolder,
  actionUpdateFolder,
  actionUpdateFolderItem
} from '@store/index'

export default function Folders() {
  useEffect(actionFetchFolders, [])

  const [ originItem, setOriginItem ] = useState<ClientFolderData | null>(null)
  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const [removeFolder, setRemoveFolder] = useState<ClientFolderData | null>(null)

  return (
    <ContentPage
      showHeader
      showFooter
      title="Collections"
      footer={(
        <div className="flex w-full justify-center lg:justify-end">
          <Button
            skin={ButtonSkin.WHITE}
            className="w-full lg:w-auto px-8 gap-1"
            onClick={() => {
              const folder = new ClientFolder().serialize()
              actionSaveFolder({folder, editId: folder.id})
            }}
          >
            <SVGPlus
              width={28}
              height={28}
              className="text-gray-700"
            />

            Create
          </Button>
        </div>
      )}
    >
      <div
        className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 p-2 md:p-4">
        {folders.items.map((folder) => {
          return (
            <Folder
              data={folder}
              key={folder.id}
              editHref={`/private/folder/${folder.id}`}
              playHref={`/private/simulator/${folder.id}`}
              edit={folder.id === folders.editId}
              process={folders.processIds.includes(folder.id)}
              dropdownItems={[
                {id: 1, name: 'Edit'},
                {id: 2, name: 'Remove', disabled: (folder.terms.length || 0) > 0},
              ]}
              onDropdownSelect={(id) => {
                switch (id) {
                  case 1:
                    actionUpdateFolder({editId: folder.id}, () => setOriginItem(folder))
                    break
                  case 2:
                    setRemoveFolder(folder)
                    break
                }
              }}
              onSave={() => {
                actionSaveFolder({folder, editId: null}, () => {
                  setOriginItem(null)
                })
              }}
              onExit={() => {
                actionUpdateFolder({
                  editId: null,
                  items: upsertObject([...folders.items], originItem as ClientFolderData)
                }, () => setOriginItem(null))
              }}
              onChange={(prop, value) => {
                actionUpdateFolderItem({...folder, [prop]: value})
              }}
              label={<MetaLabel>{`Terms ${folder.terms.length || 0}`}</MetaLabel>}
            />
          )
        })}
      </div>

      {removeFolder &&
        <Dialog
          title={removeFolder.name || 'Folder No Name'}
          text="Are you sure you want to remove this folder?"
        >
          <Button
            className="w-28"
            skin={ButtonSkin.GRAY}
            onClick={() => {
              actionDeleteFolder(removeFolder, () => {
                setRemoveFolder(null)
                if (originItem && originItem.id === removeFolder.id) {
                  setOriginItem(null)
                }
              })
            }}
          >
            Remove
          </Button>

          <Button
            className="w-28"
            skin={ButtonSkin.WHITE}
            onClick={() => setRemoveFolder(null)}
          >
            Cancel
          </Button>
        </Dialog>
      }
    </ContentPage>
  )
}
