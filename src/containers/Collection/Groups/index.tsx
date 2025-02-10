'use client'

import { findFolderGroups, findGroupFolders } from '@helper/relation'
import DialogCreateFolders from '@containers/DialogCreateFolders'
import DialogRemoveGroup from '@containers/DialogRemoveGroup'
import { actionUpdateFolderGroup } from '@store/action-main'
import { useMainSelector } from '@hooks/useMainSelector'
import { FolderGroupData } from '@entities/FolderGroup'
import { ConfigType } from '@store/initial-state-main'
import SVGNewFolder from '@public/svg/new_folder.svg'
import SVGCreate from '@public/svg/asset_manager.svg'
import SVGThreeDots from '@public/svg/three_dots.svg'
import Folders from '@containers/Collection/Folders'
import SVGEdit from '@public/svg/greasepencil.svg'
import { sortFolderGroups } from '@helper/groups'
import React, { useMemo, useState } from 'react'
import { ModuleData } from '@entities/Module'
import SVGTrash from '@public/svg/trash.svg'
import Dropdown from '@components/Dropdown'
import { useTranslations } from 'next-intl'
import { useRouter } from '@i18n/routing'
import Input from '@components/Input'
import Folder from '@entities/Folder'
import clsx from "clsx";

enum DropDownIdEnums {
  CREATE_FOLDER = 'CREATE_FOLDER',
  CREATE_FOLDERS = 'CREATE_FOLDERS',
  REMOVE_GROUP = 'REMOVE_GROUP',
  EDIT_GROUP   = 'EDIT_GROUP',
}

export default function Groups(
  {
    module,
    editable,
    className = ''
  }:
  {
    module: ModuleData
    editable: boolean,
    className?: string
  }
) {
  const t = useTranslations('Groups')

  const relationFolders = useMainSelector(({ relationFolders }) => relationFolders)
  const editGroupId = useMainSelector((state: ConfigType) => state.edit.groupId)
  const folderGroups = useMainSelector(({ folderGroups }) => folderGroups)
  const folders = useMainSelector(({ folders }) => folders)
  const router = useRouter()

  const moduleFolderGroups = useMemo(() => {
    return sortFolderGroups(findFolderGroups(folderGroups, module.id))
  }, [folderGroups, module])

  const [ createFolders, setCreateFolders ] = useState<FolderGroupData | null>(null)
  const [ originGroup, setOriginGroup ] = useState<FolderGroupData | null>(null)
  const [ removeGroup, setRemoveGroup ] = useState<FolderGroupData | null>(null)

  return (
    <div
      className={clsx('flex flex-col gap-4', {
        [className]: className
      })}
    >
      {moduleFolderGroups.length === 0 &&
        <div className="flex items-center justify-center italic text-xs text-center text-white/50 h-[50px]">
          {t('emptyList')}
        </div>
      }
      {moduleFolderGroups.map((group, index) => {
        const edit = (editGroupId === group.id)
        const groupFolders = findGroupFolders(relationFolders, folders, group.id)
        return (
          <div
            key={group.id}
            className={clsx('relative flex flex-col gap-2 box-content', {
              ['pl-4']: true
            })}
          >
            <div
              className="w-[12px] h-[12px] absolute left-[-2px] top-2.5 bg-black rounded-full overflow-hidden">
              <div className="bg-white/25 w-full h-full"/>
            </div>
            <div className="absolute left-[3px] top-[20px] w-[2px] h-[calc(100%-20px)] bg-black">
              <div className="bg-white/25 w-full h-full"/>
            </div>

            {moduleFolderGroups.length - 1 > index &&
              <div className="absolute left-[3px] bottom-[-30px] w-[2px] h-[30px] bg-black">
                <div className="border-r-2 border-white/25 border-dashed w-full h-full"/>
              </div>
            }

            {moduleFolderGroups.length - 1 === index &&
              <div className="absolute left-[3px] bottom-0 w-[6px] h-[2px] bg-black">
                <div className="bg-white/25 w-full h-full"/>
              </div>
            }

            <div className="flex items-center justify-between max-w-full overflow-hidden">
              {edit &&
                <Input
                  autoFocus
                  value={group.name || ''}
                  placeholder={t('namePlaceholder')}
                  onBlur={() => {
                    actionUpdateFolderGroup({
                      editable,
                      folderGroup: group,
                      editId: null
                    })
                  }}
                  onChange={(e) => {
                    actionUpdateFolderGroup({
                      editable: false,
                      editId: group.id,
                      folderGroup: {...group, name: e.target.value}
                    })
                  }}
                  onKeyUp={(e) => {
                    switch (e.keyCode) {
                      case 13:
                        actionUpdateFolderGroup({
                          editable,
                          folderGroup: group,
                          editId: null
                        })
                        break
                      case 27:
                        if (originGroup) {
                          actionUpdateFolderGroup({
                            editable,
                            folderGroup: originGroup,
                            editId: null
                          })
                        }
                        break
                    }
                  }}
                />
              }
              {!edit &&
                <span className="text-white/55 text-sm pl-[9px] pt-[1px] truncate ...">
                  {group.name || t('groupNoName')}
                </span>
              }
              <Dropdown
                classNameContainer="mr-[4px]"
                onClick={(e) => {
                  e.preventDefault()
                }}
                items={[
                  {id: DropDownIdEnums.EDIT_GROUP, name: t('dropdownEdit'), icon: SVGEdit},
                  {id: DropDownIdEnums.CREATE_FOLDER, name: t('dropdownAdd'), icon: SVGNewFolder},
                  {
                    id: DropDownIdEnums.CREATE_FOLDERS,
                    name: t('dropdownGenerate'),
                    icon: SVGCreate
                  },
                  {id: 1, divider: true},
                  {id: DropDownIdEnums.REMOVE_GROUP, name: t('dropdownRemove'), icon: SVGTrash}
                ]}
                className="w-8 min-w-8 h-8 items-center"
                onSelect={(id) => {
                  switch (id) {
                    case DropDownIdEnums.EDIT_GROUP:
                      actionUpdateFolderGroup({
                        editable: false,
                        folderGroup: group,
                        editId: group.id
                      }, () => {
                        setOriginGroup(group)
                      })
                      break
                    case DropDownIdEnums.CREATE_FOLDER:
                      const folder = new Folder().serialize()
                      router.push(`/private/groups/${group.id}/${folder.id}`)
                      break
                    case DropDownIdEnums.REMOVE_GROUP:
                      setRemoveGroup(group)
                      break
                    case DropDownIdEnums.CREATE_FOLDERS:
                      setCreateFolders(group)
                      break
                  }
                }}
              >
                <SVGThreeDots
                  width={24}
                  height={24}
                />
              </Dropdown>
            </div>

            {groupFolders.length > 0 &&
              <Folders
                group={group}
                editable={editable}
              />
            }

          </div>
        )
      })}

      {removeGroup &&
        <DialogRemoveGroup
          editable={editable}
          group={removeGroup}
          onClose={() => {
            setRemoveGroup(null)
          }}
          onDone={() => {
            setRemoveGroup(null)
          }}
        />
      }

      {createFolders &&
        <DialogCreateFolders
          editable={editable}
          group={createFolders}
          onClose={() => {
            setCreateFolders(null)
          }}
          onDone={() => {
            setCreateFolders(null)
          }}
        />
      }
    </div>
  )
}
