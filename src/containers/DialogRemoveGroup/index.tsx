import { actionRemoveFolderGroup } from '@store/action-main'
import Button, { ButtonVariant } from '@components/Button'
import { FolderGroupData } from '@entities/FolderGroup'
import { useTranslations } from 'next-intl'
import Spinner from '@components/Spinner'
import Dialog from '@components/Dialog'
import React, { useState } from 'react'

export default function DialogRemoveFolder(
  {
    group,
    onClose,
    onDone,
    editable
  }:
  {
    group: FolderGroupData,
    onClose: () => void
    onDone: () => void
    editable: boolean
  }
) {
  const t = useTranslations('Groups')
  const [process, setProcess] = useState(false)

  return (
    <Dialog
      onClose={onClose}
      text={t('removeDialogText')}
      title={group.name || t('groupNoName')}
    >
      <Button
        className="min-w-28 px-4"
        variant={ButtonVariant.GRAY}
        onClick={() => {
          if (process) {
            return
          }

          setProcess(true)
          actionRemoveFolderGroup({ folderGroup: group, editable }, () => {
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
