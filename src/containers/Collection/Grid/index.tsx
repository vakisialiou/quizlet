'use client'

import MetaLabel, { MetaLabelVariant } from '@components/MetaLabel'
import Button, { ButtonSize, ButtonSkin } from '@components/Button'
import { filterDeletedTerms } from '@containers/Simulator/helpers'
import ChildFolders from '@containers/Collection/ChildFolders'
import AchievementDegree from '@containers/AchievementDegree'
import Dropdown, { DropdownSkin } from '@components/Dropdown'
import { ClientFolderData } from '@entities/ClientFolder'
import SVGPresetNew from '@public/svg/preset_new.svg'
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

import { getLastStudyFolder, getLastStudyChildFolder } from '@helper/study'
import { searchFolders } from '@helper/search-folders'
import { getSimulatorsInfo } from '@helper/simulators'
import { findModuleFolders } from '@helper/folders'
import { sortFolders } from '@helper/sort-folders'

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

  const [ partition, setPartition ] = useState<{ folderId: string | null, size: number }>({ folderId: null, size: 20 })

  const moduleFolders = useMemo(() => {
    let moduleFolders = findModuleFolders([...folders.items || []])
    moduleFolders = searchFolders(moduleFolders, search, folders.editId)
    return sortFolders(moduleFolders)
  }, [folders.items, folders.editId, search])

  const lastStudy = useMemo(() => {
    const parent = getLastStudyFolder(moduleFolders)
    return {
      parent,
      child: getLastStudyChildFolder(folders.items, parent.folder)
    }
  }, [folders.items, moduleFolders])

  return (
    <>
      <div
        className="flex flex-col gap-2 p-2 md:p-4"
      >
        {moduleFolders.map((folder, index) => {
          const terms = filterDeletedTerms(folder.terms)
          const { hasActive } = getSimulatorsInfo(folder.simulators)

          const isLastStudy = lastStudy.parent.folder?.id === folder.id

          return (
            <Folder
              key={index}
              data={folder}
              collapsed={folder.collapsed}
              title={(
                <div className="flex gap-2 items-center font-bold">
                  <span>#{index + 1}</span>

                  <div className="flex items-center gap-4">
                    <AchievementDegree
                      hideDegree
                      folder={folder}
                      className="text-xs font-bold uppercase text-white/50"
                    />
                  </div>
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
              labels={(
                <>
                  {hasActive &&
                    <MetaLabel
                      variant={MetaLabelVariant.amber}
                    >
                      {t('folderLabelActive')}
                    </MetaLabel>
                  }

                  {(isLastStudy && !hasActive) &&
                    <MetaLabel
                      variant={MetaLabelVariant.green}
                    >
                      {t('folderLabelLast')}
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
                    className="flex mb-4 gap-2 justify-between max-w-full md:max-w-xs"
                  >
                    <Button
                      skin={ButtonSkin.WHITE}
                      size={ButtonSize.H08}
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
                      skin={ButtonSkin.GREEN}
                      size={ButtonSize.H08}
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

                    {folder.terms.length >= 20 &&
                      <Button
                        skin={ButtonSkin.GRAY}
                        size={ButtonSize.H08}
                        className="gap-2 font-normal"
                        onClick={() => {
                          setPartition({...partition, folderId: folder.id})
                        }}
                      >
                        <SVGSettings
                          width={18}
                          height={18}
                          className="min-[18px]"
                        />
                      </Button>
                    }
                  </div>

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
