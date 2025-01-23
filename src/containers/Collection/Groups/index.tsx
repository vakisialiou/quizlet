'use client'

import { findFolderGroups, findGroupFolders } from '@helper/relation'
import DialogCreateFolders from '@containers/DialogCreateFolders'
import DialogRemoveGroup from '@containers/DialogRemoveGroup'
import { actionUpdateFolderGroup } from '@store/action-main'
import React, {Fragment, useMemo, useState} from 'react'
import { useMainSelector } from '@hooks/useMainSelector'
import { FolderGroupData } from '@entities/FolderGroup'
import { ConfigType } from '@store/initial-state-main'
import SVGNewFolder from '@public/svg/new_folder.svg'
import SVGCreate from '@public/svg/asset_manager.svg'
import SVGThreeDots from '@public/svg/three_dots.svg'
import Folders from '@containers/Collection/Folders'
import SVGEdit from '@public/svg/greasepencil.svg'
import { sortFolderGroups } from '@helper/groups'
import { ModuleData } from '@entities/Module'
import SVGTrash from '@public/svg/trash.svg'
import Dropdown from '@components/Dropdown'
import { useTranslations } from 'next-intl'
import { useRouter } from '@i18n/routing'
import Input from '@components/Input'
import Folder from '@entities/Folder'

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
  }:
  {
    module: ModuleData
    editable: boolean,
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
    <div className="flex flex-col gap-2">
      {moduleFolderGroups.length === 0 &&
        <div className="italic text-xs text-center text-white/50">
          {t('emptyList')}
        </div>
      }
      {moduleFolderGroups.map((group, index) => {
        const edit = (editGroupId === group.id)
        const groupFolders = findGroupFolders(relationFolders, folders, group.id)
        return (
          <Fragment
            key={group.id}
          >
            <div className="flex items-center justify-between w-full overflow-hidden">
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
                      folderGroup: { ...group, name: e.target.value }
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
                  { id: DropDownIdEnums.CREATE_FOLDER, name: t('dropdownAdd'), icon: SVGNewFolder },
                  { id: DropDownIdEnums.CREATE_FOLDERS, name: t('dropdownGenerate'), icon: SVGCreate },
                  { id: DropDownIdEnums.EDIT_GROUP, name: t('dropdownEdit'), icon: SVGEdit },
                  { id: 1, divider: true },
                  { id: DropDownIdEnums.REMOVE_GROUP, name: t('dropdownRemove'), icon: SVGTrash }
                ]}
                className="w-8 min-w-8 h-8 items-center"
                onSelect={(id) => {
                  switch (id) {
                    case DropDownIdEnums.EDIT_GROUP:
                      actionUpdateFolderGroup({ editable: false, folderGroup: group, editId: group.id }, () => {
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

            {index < (moduleFolderGroups.length - 1) &&
              <div className="border-b border-white/15 my-2" />
            }

          </Fragment>
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
