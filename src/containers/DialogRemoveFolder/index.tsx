import { actionDeleteFolder, actionRemoveRelationFolder } from '@store/index'
import Button, { ButtonVariant } from '@components/Button'
import { useGroupSelect } from '@hooks/useGroupSelect'
import { FolderGroupData } from '@entities/FolderGroup'
import { getRelationFolder } from '@helper/relation'
import { FolderData } from '@entities/Folder'
import { useTranslations } from 'next-intl'
import Spinner from '@components/Spinner'
import Dialog from '@components/Dialog'
import React, { useState } from 'react'

export default function DialogRemoveFolder(
  {
    group,
    folder,
    onClose,
    onDone,
    editable
  }:
  {
    folder: FolderData
    group: FolderGroupData,
    onClose: () => void
    onDone: () => void
    editable: boolean
  }
) {
  const t = useTranslations('Modules')
  const [process, setProcess] = useState(false)
  const { relationFolders } = useGroupSelect()

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

          const relationFolder = getRelationFolder(relationFolders, group.id, folder.id)
          if (!relationFolder) {
            return
          }

          setProcess(true)
          actionRemoveRelationFolder({ relationFolder, editable }, () => {
            actionDeleteFolder({ folderId: folder.id, editable }, () => {
              setProcess(false)
              onDone()
            })
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
