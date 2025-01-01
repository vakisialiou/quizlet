'use client'

import MetaLabel, {MetaLabelVariant} from '@components/MetaLabel'
import Dropdown, {DropdownVariant} from '@components/Dropdown'
import ChildFolders from '@containers/Collection/ChildFolders'
import AchievementDegree from '@containers/AchievementDegree'
import {FolderFrameVariant} from '@components/FolderFrame'
import Button, {ButtonVariant} from '@components/Button'
import AchievementIcon from '@containers/AchievementIcon'
import {ClientFolderData} from '@entities/ClientFolder'
import {filterDeletedTerms} from '@helper/terms'
import SVGGroups from '@public/svg/syntax_on.svg'
import SVGEdit from '@public/svg/greasepencil.svg'
import Folder from '@containers/Collection/Folder'
import SVGFileNew from '@public/svg/file_new.svg'
import React, {useMemo, useState} from 'react'
import SVGLinked from '@public/svg/linked.svg'
import SVGTrash from '@public/svg/trash.svg'
import {useLocale, useTranslations} from 'next-intl'
import SVGPlay from '@public/svg/play.svg'
import {upsertObject} from '@lib/array'
import Dialog from '@components/Dialog'
import {
  actionCreateFolderPartitions,
  actionDeleteFolder,
  actionSaveFolder,
  actionUpdateFolder,
  actionUpdateFolderItem
} from '@store/index'

import {getLastStudyFolder} from '@helper/study'
import {searchFolders} from '@helper/search-folders'
import {getSimulatorsInfo} from '@helper/simulators'
import {findModuleFolders} from '@helper/folders'
import {sortFoldersDesc} from '@helper/sort-folders'
import {
  DEFAULT_GROUP_SIZE,
  GROUP_SIZE_10,
  GROUP_SIZE_15,
  GROUP_SIZE_20,
  GROUP_SIZE_25,
  GROUP_SIZE_30,
  GROUP_SIZE_5,
  isGenerateGroupDisabled
} from '@helper/groups'
import {ClientFolderShareEnum} from "@entities/ClientFolderShare";
import {upsertClientFolderShare} from "@store/fetch/folders-share";
import {getPathname} from '@i18n/routing'
import {clipboard} from '@lib/clipboard'

enum DropDownIdEnums {
  GENERATE = 'GENERATE',
  EDIT_FOLDER = 'EDIT_FOLDER',
  OPEN_FOLDER = 'OPEN_FOLDER',
  REMOVE_FOLDER = 'REMOVE_FOLDER',
  SHARE = 'SHARE',
  STUDY = 'STUDY',
}

export type TypeFilter = {
  limit?: number,
  search?: string | null
}

type TypeShare = {
  folder: ClientFolderData | null,
  access: ClientFolderShareEnum,
  link: string | null,
  error: boolean
}

type TypePartition = {
  folder: ClientFolderData | null,
  size: number
}

export default function Grid(
  {
    onOpen,
    onPlay,
    editId,
    items,
    filter = {},
  }:
  {
    editId: string | null,
    filter: TypeFilter,
    items: ClientFolderData[],
    onOpen?: (folder: ClientFolderData) => void,
    onPlay?: (folder: ClientFolderData) => void
  }
) {
  const t = useTranslations('Folders')
  const locale = useLocale()

  console.log(locale)

  const dropdownParentItems = [
    {id: DropDownIdEnums.EDIT_FOLDER, name: t('dropDownEditModule'), icon: SVGEdit },
    {id: DropDownIdEnums.OPEN_FOLDER, name: t('dropDownOpenModule'), icon: SVGFileNew },
    {id: DropDownIdEnums.STUDY, name: t('dropDownStudyModule'), icon: SVGPlay },
    {id: DropDownIdEnums.GENERATE, name: t('dropDownGenerateGroups'), icon: SVGGroups },
    {id: DropDownIdEnums.SHARE, name: t('dropDownGenerateShare'), icon: SVGLinked },
    {id: '2', divider: true },
    {id: DropDownIdEnums.REMOVE_FOLDER, name: t('dropDownRemoveModule'), icon: SVGTrash },
  ]

  const [ originItem, setOriginItem ] = useState<ClientFolderData | null>(null)
  const [ removeItem, setRemoveItem ] = useState<ClientFolderData | null>(null)

  const [ partition, setPartition ] = useState<TypePartition>({
    folder: null,
    size: DEFAULT_GROUP_SIZE
  })

  const [ shareFolder, setShareFolder ] = useState<TypeShare>({
    folder: null,
    link: null,
    error: false,
    access: ClientFolderShareEnum.readonly,
  })

  const lastStudy = useMemo(() => {
    return getLastStudyFolder(items)
  }, [items])

  const moduleFolders = useMemo(() => {
    let moduleFolders = findModuleFolders([...items || []])
    moduleFolders = searchFolders(moduleFolders, filter.search || null, editId)
    return sortFoldersDesc(moduleFolders)
      .sort((a, b) => {
        if (lastStudy.folder?.id === a.id) {
          return -1
        }
        if (lastStudy.folder?.id === b.id) {
          return 1
        }
        return 0
      }).slice(0, filter.limit || Infinity)
  }, [items, editId, filter, lastStudy])

  return (
    <>
      <div
        className="flex flex-col gap-2 text-start"
      >
        {moduleFolders.length === 0 &&
          <div className="flex flex-col items-center justify-center gap-2 p-4">
            <div className="text-white/50 text-sm italic text-center">
              {t('noFoldersHelper', { btnName: t('footButtonCreateModule') })}
            </div>
          </div>
        }

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
              edit={editId === folder.id}
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
                    case DropDownIdEnums.SHARE:
                      setShareFolder({
                        access: ClientFolderShareEnum.readonly,
                        folder,
                        link: null,
                        error: false
                      })
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

      {shareFolder.folder &&
        <Dialog
          title={t('shareDialogTitle')}
          text={(
            <div className="flex flex-col items-stretch md:flex-row md:items-center md:justify-between md:gap-4 text-start">
              <div className="flex justify-between">
                <div className="text-black">
                  {t('shareDialogLabel')}
                </div>
                <div className="text-green-600 lowercase">
                  {(shareFolder.link && !shareFolder.error)
                    ? t('shareDialogCopied')
                    : ''
                  }
                </div>
              </div>

              <Dropdown
                caret
                bordered
                disabled={!shareFolder.link}
                selected={shareFolder.access}
                className="py-2 px-2 justify-between"
                variant={DropdownVariant.white}
                items={[
                  {
                    id: ClientFolderShareEnum.readonly,
                    name: t('shareDialogReadonly'),
                  },
                  {
                    id: ClientFolderShareEnum.editable,
                    name: t('shareDialogEditable'),
                  },
                ]}
                onSelect={(id) => {
                  setShareFolder({
                    ...shareFolder,
                    access: id as ClientFolderShareEnum,
                    link: null,
                    error: false
                  })
                }}
              >
                <span className="px-2">
                  {shareFolder.access === ClientFolderShareEnum.readonly
                    ? t('shareDialogReadonly')
                    : t('shareDialogEditable')
                  }
                </span>
              </Dropdown>
            </div>
          )}
        >
          <Button
            className="min-w-40 px-4"
            variant={ButtonVariant.GREEN}
            onClick={async () => {
              if (!shareFolder.folder?.id) {
                return
              }

              const shareId = await upsertClientFolderShare(shareFolder.folder.id, shareFolder.access)
              const link = `${origin}${getPathname({ href: `/share/${shareId}`, locale })}`
              clipboard(link, (error) => {
                setShareFolder({ ...shareFolder, link, error })

                setTimeout(() => {
                  if (!shareFolder.folder) {
                    return
                  }

                  setShareFolder({ ...shareFolder, link: null })
                }, 2000)
              })
            }}
          >
            {t('shareDialogButtonCopy')}
          </Button>

          <Button
            className="min-w-28 px-4"
            variant={ButtonVariant.WHITE}
            onClick={() => {
              setShareFolder({
                folder: null,
                link: null,
                error: false,
                access: ClientFolderShareEnum.readonly })
            }}
          >
            {t('shareDialogButtonCancel')}
          </Button>
        </Dialog>
      }

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
                    name: t('generateDialogPartitionSize', {size: GROUP_SIZE_5}),
                    disabled: isGenerateGroupDisabled(partition.folder, GROUP_SIZE_5)
                  },
                  {
                    id: GROUP_SIZE_10,
                    name: t('generateDialogPartitionSize', {size: GROUP_SIZE_10}),
                    disabled: isGenerateGroupDisabled(partition.folder, GROUP_SIZE_10)
                  },
                  {
                    id: GROUP_SIZE_15,
                    name: t('generateDialogPartitionSize', {size: GROUP_SIZE_15}),
                    disabled: isGenerateGroupDisabled(partition.folder, GROUP_SIZE_15)
                  },
                  {
                    id: GROUP_SIZE_20,
                    name: t('generateDialogPartitionSize', {size: GROUP_SIZE_20}),
                    disabled: isGenerateGroupDisabled(partition.folder, GROUP_SIZE_20)
                  },
                  {
                    id: GROUP_SIZE_25,
                    name: t('generateDialogPartitionSize', {size: GROUP_SIZE_25}),
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
