'use client'

import Button, { ButtonSize, ButtonVariant } from '@components/Button'
import MetaLabel, { MetaLabelVariant } from '@components/MetaLabel'
import Dropdown, { DropdownVariant } from '@components/Dropdown'
import ChildFolders from '@containers/Collection/ChildFolders'
import AchievementDegree from '@containers/AchievementDegree'
import { FolderFrameVariant } from '@components/FolderFrame'
import AchievementIcon from '@containers/AchievementIcon'
import { ClientFolderData } from '@entities/ClientFolder'
import SVGPresetNew from '@public/svg/preset_new.svg'
import { filterDeletedTerms } from '@helper/terms'
import SVGSettings from '@public/svg/settings.svg'
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

import { getLastStudyFolder } from '@helper/study'
import { searchFolders } from '@helper/search-folders'
import { getSimulatorsInfo } from '@helper/simulators'
import { findModuleFolders } from '@helper/folders'
import { sortFoldersDesc } from '@helper/sort-folders'
import {
  DEFAULT_GROUP_SIZE,
  GROUP_SIZE_5,
  GROUP_SIZE_10,
  GROUP_SIZE_15,
  GROUP_SIZE_20,
  GROUP_SIZE_25,
  GROUP_SIZE_30,
  isGenerateGroupDisabled
} from '@helper/groups'

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
    {id: DropDownIdEnums.GENERATE, name: t('dropDownGenerateGroups'), icon: SVGSettings },
    {id: '2', divider: true },
    {id: DropDownIdEnums.REMOVE_FOLDER, name: t('dropDownRemoveModule'), icon: SVGTrash },
  ]

  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const [ originItem, setOriginItem ] = useState<ClientFolderData | null>(null)
  const [ removeItem, setRemoveItem ] = useState<ClientFolderData | null>(null)

  const [ partition, setPartition ] = useState<{ folder: ClientFolderData | null, size: number }>({ folder: null, size: DEFAULT_GROUP_SIZE })

  const lastStudy = useMemo(() => {
    return getLastStudyFolder(folders.items)
  }, [folders.items])

  const moduleFolders = useMemo(() => {
    let moduleFolders = findModuleFolders([...folders.items || []])
    moduleFolders = searchFolders(moduleFolders, search, folders.editId)
    return sortFoldersDesc(moduleFolders)
      .sort((a, b) => {
        if (lastStudy.folder?.id === a.id) {
          return -1
        }
        if (lastStudy.folder?.id === b.id) {
          return 1
        }
        return 0
      })
  }, [folders.items, folders.editId, search, lastStudy])

  return (
    <>
      <div
        className="flex flex-col gap-2"
      >
        {moduleFolders.map((folder, index) => {
          const terms = filterDeletedTerms(folder.terms)
          const { hasActive } = getSimulatorsInfo(folder.simulators)

          const isLastStudy = lastStudy.folder?.id === folder.id

          return (
            <Folder
              key={index}
              data={folder}
              collapsed={folder.collapsed}
              variant={isLastStudy ? FolderFrameVariant.blue : FolderFrameVariant.default}
              title={(
                <div className="flex gap-2 items-center font-bold">

                  <div className="flex items-center gap-1">
                    <AchievementIcon
                      folder={folder}
                      size={12}
                    />

                    <AchievementDegree
                      folder={folder}
                      className="text-xs font-bold uppercase text-white/50"
                    />
                  </div>
                </div>
              )}
              edit={folders.editId === folder.id}
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
                      setPartition({ ...partition, folder })
                      break
                  }
                }
              }}
              labels={(
                <>
                  {hasActive &&
                    <MetaLabel
                      variant={MetaLabelVariant.amber}
                    >
                      {t('folderLabelActive')}
                    </MetaLabel>
                  }

                  <MetaLabel>
                    {t('folderLabelTerms', { count: terms.length })}
                  </MetaLabel>
                </>
              )}
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
                  items: upsertObject([...moduleFolders], originItem as ClientFolderData)
                }, () => setOriginItem(null))
              }}
            >
              {!folder.collapsed &&
                <>
                  <div
                    className="flex my-4 gap-2 justify-between max-w-full md:max-w-xs"
                  >
                    <Button
                      size={ButtonSize.H08}
                      variant={ButtonVariant.WHITE}
                      className="gap-2 font-normal w-full"
                      onClick={() => {
                        if (onOpen) {
                          onOpen(folder)
                        }
                      }}
                    >
                      <SVGPresetNew
                        width={18}
                        height={18}
                        className="min-[18px]"
                      />

                      {t('folderOpen')}
                    </Button>

                    <Button
                      size={ButtonSize.H08}
                      variant={ButtonVariant.GREEN}
                      className="gap-2 font-normal w-full"
                      onClick={() => {
                        if (onPlay) {
                          onPlay(folder)
                        }
                      }}
                    >
                      <SVGPlay
                        width={18}
                        height={18}
                        className="min-[18px]"
                      />

                      {t('folderPlay')}
                    </Button>

                    <Button
                      size={ButtonSize.H08}
                      variant={ButtonVariant.GRAY}
                      className="gap-2 font-normal"
                      disabled={isGenerateGroupDisabled(folder, DEFAULT_GROUP_SIZE)}
                      onClick={() => {
                        setPartition({...partition, folder})
                      }}
                    >
                      <SVGSettings
                        width={18}
                        height={18}
                        className="min-[18px]"
                      />
                    </Button>
                  </div>

                  <div className="w-full h-[1px] border-b border-white/10 mt-1 mb-2" />

                  <ChildFolders
                    folder={folder}
                    lastFolderId={lastStudy.child.folder?.id}
                    onPlay={(childFolder) => {
                      if (onPlay) {
                        onPlay(childFolder)
                      }
                    }}
                    onRemove={(childFolder) => {
                      setRemoveItem(childFolder)
                    }}
                  />
                </>
              }
            </Folder>
          )
        })}
      </div>

      {partition.folder &&
        <Dialog
          title={t('generateDialogTitle')}
          text={(
            <div className="flex items-center justify-start gap-4 w-full">
              <div className="text-black">
                {t('generateDialogPartitionLabel')}
              </div>

              <Dropdown
                caret
                bordered
                className="py-2 px-2"
                selected={partition.size}
                variant={DropdownVariant.white}
                items={[
                  {
                    id: GROUP_SIZE_5,
                    name: t('generateDialogPartitionSize', { size: GROUP_SIZE_5  }),
                    disabled: isGenerateGroupDisabled(partition.folder, GROUP_SIZE_5)
                  },
                  {
                    id: GROUP_SIZE_10,
                    name: t('generateDialogPartitionSize', { size: GROUP_SIZE_10 }),
                    disabled: isGenerateGroupDisabled(partition.folder, GROUP_SIZE_10)
                  },
                  {
                    id: GROUP_SIZE_15,
                    name: t('generateDialogPartitionSize', { size: GROUP_SIZE_15 }),
                    disabled: isGenerateGroupDisabled(partition.folder, GROUP_SIZE_15)
                  },
                  {
                    id: GROUP_SIZE_20,
                    name: t('generateDialogPartitionSize', { size: GROUP_SIZE_20 }),
                    disabled: isGenerateGroupDisabled(partition.folder, GROUP_SIZE_20)
                  },
                  {
                    id: GROUP_SIZE_25,
                    name: t('generateDialogPartitionSize', { size: GROUP_SIZE_25 }),
                    disabled: isGenerateGroupDisabled(partition.folder, GROUP_SIZE_25)
                  },
                  {
                    id: GROUP_SIZE_30,
                    name: t('generateDialogPartitionSize', { size: GROUP_SIZE_30 }),
                    disabled: isGenerateGroupDisabled(partition.folder, GROUP_SIZE_30)
                  },
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
            variant={ButtonVariant.GREEN}
            className="min-w-28 px-4"
            disabled={isGenerateGroupDisabled(partition.folder, GROUP_SIZE_5)}
            onClick={() => {
              if (partition.folder) {
                const { folder, size } = partition
                setPartition({ ...partition, folder: null })
                actionCreateFolderPartitions({ folderId: folder.id, partitionSize: size })
              }
            }}
          >
            {t('generateDialogButtonGenerate')}
          </Button>

          <Button
            className="min-w-28 px-4"
            variant={ButtonVariant.WHITE}
            onClick={() => setPartition({ ...partition, folder: null })}
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
            variant={ButtonVariant.GRAY}
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
            variant={ButtonVariant.WHITE}
            onClick={() => setRemoveItem(null)}
          >
            {t('removeDialogButtonCancel')}
          </Button>
        </Dialog>
      }
    </>
  )
}
