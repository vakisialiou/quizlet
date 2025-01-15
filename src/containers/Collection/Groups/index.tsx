'use client'

import {actionRemoveFolderGroup, actionUpdateFolderGroup} from '@store/index'
import { findFolderGroups, findGroupFolders } from '@helper/relation'
import { useFolderSelect } from '@hooks/useFolderSelect'
import React, {Fragment, useMemo, useState} from 'react'
import { FolderGroupData } from '@entities/FolderGroup'
import { useGroupSelect } from '@hooks/useGroupSelect'
import SVGNewFolder from '@public/svg/new_folder.svg'
import SVGThreeDots from '@public/svg/three_dots.svg'
import Folders from '@containers/Collection/Folders'
import SVGEdit from '@public/svg/greasepencil.svg'
import { sortFolderGroups } from '@helper/groups'
import { ModuleData } from '@entities/Module'
import SVGTrash from '@public/svg/trash.svg'
import Dropdown from '@components/Dropdown'
import { useRouter } from '@i18n/routing'
import Input from '@components/Input'
import Folder from '@entities/Folder'

enum DropDownIdEnums {
  CREATE_FOLDER = 'CREATE_FOLDER',
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
  const router = useRouter()

  const { relationFolders, folderGroups } = useGroupSelect()
  const folders = useFolderSelect()

  const moduleFolderGroups = useMemo(() => {
    return sortFolderGroups(findFolderGroups(folderGroups, module.id))
  }, [folderGroups, module])

  const [ editGroup, setEditGroup ] = useState<FolderGroupData | null>(null)

  return (
    <div className="flex flex-col gap-2">
      {moduleFolderGroups.map((group) => {
        const edit = (editGroup && editGroup.id === group.id)
        const groupFolders = findGroupFolders(relationFolders, folders, group.id)
        return (
          <Fragment
            key={group.id}
          >
            <div className="flex items-center justify-between w-full overflow-hidden">
              {edit &&
                <Input
                  autoFocus
                  value={editGroup.name || ''}
                  onBlur={() => {
                    actionUpdateFolderGroup({ editable, folderGroup: editGroup }, () => {
                      setEditGroup(null)
                    })
                  }}
                  onChange={(e) => {
                    setEditGroup({ ...editGroup, name: e.target.value })
                  }}
                  onKeyUp={(e) => {
                    switch (e.keyCode) {
                      case 13:
                        actionUpdateFolderGroup({ editable, folderGroup: editGroup }, () => {
                          setEditGroup(null)
                        })
                        break
                      case 27:
                        setEditGroup(null)
                        break
                    }
                  }}
                />
              }
              {!edit &&
                <span className="text-white/55 text-sm pl-[9px] pt-[1px] truncate ...">
                  {group.name}
                </span>
              }
              <Dropdown
                classNameContainer="mr-[4px]"
                onClick={(e) => {
                  e.preventDefault()
                }}
                items={[
                  { id: DropDownIdEnums.EDIT_GROUP, name: 'Редактировать группу', icon: SVGEdit },
                  { id: DropDownIdEnums.CREATE_FOLDER, name: 'Добавить папку', icon: SVGNewFolder },
                  { id: 3, divider: true },
                  { id: DropDownIdEnums.REMOVE_GROUP, name: 'Удалить группу', icon: SVGTrash }
                ]}
                className="w-8 min-w-8 h-8 items-center"
                onSelect={(id) => {
                  switch (id) {
                    case DropDownIdEnums.EDIT_GROUP:
                      setEditGroup(group)
                      break
                    case DropDownIdEnums.CREATE_FOLDER:
                      const folder = new Folder().serialize()
                      router.push(`/private/groups/${group.id}/${folder.id}`)
                      break
                    case DropDownIdEnums.REMOVE_GROUP:
                      actionRemoveFolderGroup({ folderGroup: group, editable })
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

          </Fragment>
        )
      })}
    </div>
  )
}
