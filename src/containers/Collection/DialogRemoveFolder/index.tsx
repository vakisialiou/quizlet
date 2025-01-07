import { RelationFolderData } from '@entities/RelationFolder'
import Button, { ButtonVariant } from '@components/Button'
import { useFolderSelect } from '@hooks/useFolderSelect'
import { useGroupSelect } from '@hooks/useGroupSelect'
import {FolderGroupData} from '@entities/FolderGroup'
import { findGroupFolders } from '@helper/relation'
import { actionDeleteFolder } from '@store/index'
import { FolderData } from '@entities/Folder'
import { useTranslations } from 'next-intl'
import Spinner from '@components/Spinner'
import Dialog from '@components/Dialog'
import React, {useState} from 'react'

export default function DialogRemoveFolder(
  {
    group,
    folder,
    onClose,
    onDone,
    editable
  }:
  {
    group: FolderGroupData
    folder: FolderData
    onClose: () => void
    onDone: () => void
    editable: boolean
  }
) {
  const t = useTranslations('Folders')
  const [process, setProcess] = useState(false)
  const { relationFolders, folderGroups } = useGroupSelect()
  const folders = useFolderSelect()

  return (
    <Dialog
      onClose={onClose}
      text={t('removeDialogText')}
      title={folder.name || t('removeDialogTitle')}
    >
      <Button
        className="min-w-28 px-4"
        variant={ButtonVariant.GRAY}
        onClick={() => {
          if (process) {
            return
          }

          setProcess(true)

          const groupFolders = findGroupFolders(relationFolders, folders, group.id)

          const relation = {
            folderId: folder.id,
            groupId: groupFolders.length === 1 ? group.id : null
          }

          actionDeleteFolder({ relation, editable }, () => {
            setProcess(false)
            onDone()
          })
        }}
      >
        {process &&
          <Spinner size={4} />
        }
        {!process && t('removeDialogButtonApprove')}
      </Button>

      <Button
        onClick={onClose}
        className="min-w-28 px-4"
        variant={ButtonVariant.WHITE}
      >
        {t('removeDialogButtonCancel')}
      </Button>
    </Dialog>
  )
}
