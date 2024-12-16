'use client'

import AchievementIcon, {AchievementsSize} from '@containers/AchievementIcon'
import MetaLabel, { MetaLabelVariant } from '@components/MetaLabel'
import { getSimulatorsInfo } from '@containers/Collection/helper'
import ChildFolders from '@containers/Collection/ChildFolders'
import AchievementDegree from '@containers/AchievementDegree'
import Dropdown, { DropdownSkin } from '@components/Dropdown'
import { ClientFolderData } from '@entities/ClientFolder'
import Button, { ButtonSkin } from '@components/Button'
import SVGRefresh from '@public/svg/file_refresh.svg'
import SVGFolder from '@public/svg/file_folder.svg'
import SVGEdit from '@public/svg/greasepencil.svg'
import Folder from '@containers/Collection/Folder'
import SVGOpen from '@public/svg/file_folder.svg'
import {FoldersType} from '@store/initial-state'
import SVGTrash from '@public/svg/trash.svg'
import { useTranslations } from 'next-intl'
import SVGPlay from '@public/svg/play.svg'
import { useSelector } from 'react-redux'
import { upsertObject } from '@lib/array'
import { useMemo, useState } from 'react'
import Dialog from '@components/Dialog'
import {
  actionDeleteFolder,
  actionSaveFolder,
  actionUpdateFolder,
  actionUpdateFolderItem,
  actionCreateFolderPartitions
} from '@store/index'

enum DropDownIdEnums {
  GENERATE = 'GENERATE',
  EDIT_FOLDER = 'EDIT_FOLDER',
  OPEN_FOLDER = 'OPEN_FOLDER',
  REMOVE_FOLDER = 'REMOVE_FOLDER',
  STUDY = 'STUDY',
}

export default function Grid(
  {
    onOpen,
    onPlay,
    search,
  }:
  {
    search?: string | null,
    onOpen?: (folder: ClientFolderData) => void,
    onPlay?: (folder: ClientFolderData) => void
  }
) {
  const t = useTranslations('Folders')

  const dropdownParentItems = [
    {id: DropDownIdEnums.EDIT_FOLDER, name: t('dropDownEditModule'), icon: SVGEdit },
    {id: DropDownIdEnums.OPEN_FOLDER, name: t('dropDownOpenModule'), icon: SVGOpen },
    {id: DropDownIdEnums.STUDY, name: t('dropDownStudyModule'), icon: SVGPlay },
    {id: DropDownIdEnums.GENERATE, name: t('dropDownGenerateGroups'), icon: SVGRefresh },
    {id: '2', divider: true },
    {id: DropDownIdEnums.REMOVE_FOLDER, name: t('dropDownRemoveModule'), icon: SVGTrash },
  ]

  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const [ originItem, setOriginItem ] = useState<ClientFolderData | null>(null)
  const [ removeItem, setRemoveItem ] = useState<ClientFolderData | null>(null)

  const [ partition, setPartition ] = useState<{ folderId: string | null, size: number }>({ folderId: null, size: 20 })

  const items = useMemo(() => {
    let rawItems = [...folders.items || []]
      .filter((item) => item.isModule)

    if (search) {
      rawItems = rawItems.filter(({ name }) => `${name}`.toLocaleLowerCase().includes(search))
    }

    return rawItems.sort((a, b) => {
      if (a.order === b.order) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return a.order - b.order
    })
  }, [folders.items, search])

  return (
    <>
      <div
        className="flex flex-col gap-2 p-2 md:p-4"
      >
        {items.map((folder, index) => {
          const { hasActive, countDone } = getSimulatorsInfo(folder.simulators)

          return (
            <Folder
              key={index}
              data={folder}
              collapsed={folder.collapsed}
              title={(
                <div className="flex gap-2 items-center font-bold">
                  <SVGFolder
                    width={16}
                    height={16}
                  />
                  <span className="uppercase text-xs">
                    {t('cardSubTitle')}
                  </span>
                  <span>#{index + 1}</span>
                </div>
              )}
              edit={folders.editId === folder.id}
              process={folders.processIds.includes(folder.id)}
              dropdown={{
                items: dropdownParentItems,
                onSelect: (id) => {
                  switch (id) {
                    case DropDownIdEnums.EDIT_FOLDER:
                      actionUpdateFolder({editId: folder.id}, () => setOriginItem(folder))
                      break
                    case DropDownIdEnums.OPEN_FOLDER:
                      if (onOpen) {
                        onOpen(folder)
                      }
                      break
                    case DropDownIdEnums.STUDY:
                      if (onPlay) {
                        onPlay(folder)
                      }
                      break
                    case DropDownIdEnums.REMOVE_FOLDER:
                      setRemoveItem(folder)
                      break
                    case DropDownIdEnums.GENERATE:
                      setPartition({ ...partition, folderId: folder.id })
                      break
                  }
                }
              }}
              achievement={(
                <div className="flex items-center gap-4">
                  <AchievementIcon
                    folder={folder}
                    size={AchievementsSize.sm}
                  />
                  <AchievementDegree
                    folder={folder}
                    className="text-sm font-bold uppercase text-white/50"
                  />
                </div>
              )}
              labels={(
                <>
                  {hasActive &&
                    <MetaLabel
                      variant={MetaLabelVariant.amber}
                    >
                      {t('folderLabelActive')}
                    </MetaLabel>
                  }
                  <MetaLabel
                    variant={MetaLabelVariant.gray}
                  >
                    {t('folderLabelDone', { count: countDone })}
                  </MetaLabel>
                  <MetaLabel>
                    {t('folderLabelTerms', { count: folder.terms.length })}
                  </MetaLabel>
                </>
              )}
              onOpen={() => {
                if (onOpen) {
                  onOpen(folder)
                }
              }}
              onCollapse={() => {
                actionSaveFolder({folder: {...folder, collapsed: !folder.collapsed}})
              }}
              onChange={(prop, value) => {
                actionUpdateFolderItem({ ...folder, [prop]: value })
              }}
              onSave={() => {
                actionSaveFolder({ folder, editId: null }, () => {
                  setOriginItem(null)
                })
              }}
              onExit={() => {
                actionUpdateFolder({
                  editId: null,
                  items: upsertObject([...items], originItem as ClientFolderData)
                }, () => setOriginItem(null))
              }}
            >
              {!folder.collapsed &&
                <ChildFolders
                  folder={folder}
                  onPlay={(childFolder) => {
                    if (onPlay) {
                      onPlay(childFolder)
                    }
                  }}
                  onRemove={(childFolder) => {
                    setRemoveItem(childFolder)
                  }}
                  onGenerate={(parentFolder) => {
                    setPartition({...partition, folderId: parentFolder.id})
                  }}
                />
              }
            </Folder>
          )
        })}

      </div>

      {partition.folderId &&
        <Dialog
          title={t('generateDialogTitle')}
          text={(
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="text-black">
                {t('generateDialogPartitionLabel')}
              </div>

              <Dropdown
                caret
                bordered
                className="py-2 px-2"
                selected={partition.size}
                skin={DropdownSkin.white}
                items={[
                  { id: 10, name: t('generateDialogPartitionSize', { size: 10 }) },
                  { id: 15, name: t('generateDialogPartitionSize', { size: 15 }) },
                  { id: 20, name: t('generateDialogPartitionSize', { size: 20 }) },
                  { id: 25, name: t('generateDialogPartitionSize', { size: 25 }) },
                  { id: 30, name: t('generateDialogPartitionSize', { size: 30 }) },
                ]}
                onSelect={(id) => {
                  setPartition({ ...partition, size: id as number })
                }}
              >
                <span className="px-2">
                  {t('generateDialogPartitionSize', { size: partition.size })}
                </span>
              </Dropdown>
            </div>
          )}
        >
          <Button
            skin={ButtonSkin.GREEN}
            className="min-w-28 px-4"
            onClick={() => {
              if (partition.folderId) {
                const { folderId, size } = partition
                setPartition({ ...partition, folderId: null })
                actionCreateFolderPartitions({
                  folderId,
                  partitionSize: size
                })
              }
            }}
          >
            {t('generateDialogButtonGenerate')}
          </Button>

          <Button
            className="min-w-28 px-4"
            skin={ButtonSkin.WHITE}
            onClick={() => setPartition({ ...partition, folderId: null })}
          >
            {t('generateDialogButtonCancel')}
          </Button>
        </Dialog>
      }

      {removeItem &&
        <Dialog
          title={removeItem.name || t('removeDialogTitle')}
          text={t('removeDialogText')}
        >
          <Button
            className="min-w-28 px-4"
            skin={ButtonSkin.GRAY}
            onClick={() => {
              const folder = removeItem
              setRemoveItem(null)
              if (originItem && originItem.id === folder?.id) {
                setOriginItem(null)
              }

              actionDeleteFolder({ folder: folder as ClientFolderData })
            }}
          >
            {t('removeDialogButtonApprove')}
          </Button>

          <Button
            className="min-w-28 px-4"
            skin={ButtonSkin.WHITE}
            onClick={() => setRemoveItem(null)}
          >
            {t('removeDialogButtonCancel')}
          </Button>
        </Dialog>
      }
    </>
  )
}
