import Button, { ButtonVariant } from '@components/Button'
import { actionDeleteFolder } from '@store/index'
import { FolderData } from '@entities/Folder'
import { useTranslations } from 'next-intl'
import Spinner from '@components/Spinner'
import Dialog from '@components/Dialog'
import React, {useState} from 'react'

export default function DialogRemoveFolder(
  {
    folder,
    onClose,
    onDone
  }:
  {
    folder: FolderData
    onClose: () => void
    onDone: () => void
  }
) {
  const t = useTranslations('Folders')
  const [process, setProcess] = useState(false)

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
          actionDeleteFolder({ folder }, () => {
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
