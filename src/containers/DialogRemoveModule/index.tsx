import Button, { ButtonVariant } from '@components/Button'
import { actionDeleteModule } from '@store/index'
import { ModuleData } from '@entities/Module'
import { useTranslations } from 'next-intl'
import Spinner from '@components/Spinner'
import Dialog from '@components/Dialog'
import React, {useState} from 'react'

export default function DialogRemoveModule(
  {
    editable,
    module,
    onClose,
    onDone
  }:
    {
      editable: boolean
      module: ModuleData
      onClose: () => void
      onDone: () => void
    }
) {
  const t = useTranslations('Module')
  const [process, setProcess] = useState(false)

  return (
    <Dialog
      onClose={onClose}
      text={t('removeDialogText')}
      title={module.name || t('moduleNoName')}
    >
      <Button
        className="min-w-28 px-4"
        variant={ButtonVariant.GRAY}
        onClick={() => {
          if (process) {
            return
          }

          setProcess(true)
          actionDeleteModule({ module, editable }, () => {
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
