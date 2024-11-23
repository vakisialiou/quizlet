'use client'

import ClientFolder, { ClientFolderData } from '@entities/ClientFolder'
import Button, { ButtonSkin } from '@components/Button'
import ButtonSquare from '@components/ButtonSquare'
import { FoldersType } from '@store/initial-state'
import ContentPage from '@containers/ContentPage'
import MetaLabel from '@components/MetaLabel'
import { useState, useEffect } from 'react'
import SVGPlus from '@public/svg/plus.svg'
import { upsertObject } from '@lib/array'
import { useSelector} from 'react-redux'
import Dialog from '@components/Dialog'
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

  const [ originItem, setOriginItem ] = useState<ClientFolderData | null>(null)
  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const [removeFolder, setRemoveFolder] = useState<ClientFolderData | null>(null)

  return (
    <ContentPage
      backURL="/"
      title="Folder list"
      rightControls={(
        <ButtonSquare
          bordered
          icon={SVGPlus}
          onClick={() => {
            const folder = new ClientFolder().serialize()
            actionSaveFolder({folder, editId: folder.id})
          }}
        />
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
            skin={ButtonSkin.GRAY_500}
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
            skin={ButtonSkin.WHITE_100}
            onClick={() => setRemoveFolder(null)}
          >
            Cancel
          </Button>
        </Dialog>
      }
    </ContentPage>
  )
}
