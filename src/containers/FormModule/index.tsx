import { actionUpdateModule } from '@store/action-main'
import React, {useCallback, useRef} from 'react'
import { ModuleData } from '@entities/Module'
import Textarea from '@components/Textarea'
import { useTranslations } from 'next-intl'
import Input from '@components/Input'

export default function FolderModule(
  {
    module,
    editable
  }:
  {
    module: ModuleData,
    editable: boolean
  }
) {
  const t = useTranslations('Module')
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const onChangeUpdate = useCallback((module: ModuleData) => {
    actionUpdateModule({ module, editId: module.id, editable: false })
    if (!editable) {
      return
    }

    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    timeoutId.current = setTimeout(() => {
      actionUpdateModule({ module, editId: module.id, editable })
    }, 200)
  }, [editable])

  const onChangeSave = useCallback((module: ModuleData) => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }
    actionUpdateModule({ module, editId: null, editable })
  }, [editable])

  const SHOW_DESC = false

  return (
    <div className="flex flex-col gap-2 w-full">
      <Input
        autoFocus
        value={module.name || ''}
        placeholder={t('namePlaceholder')}
        onBlur={() => onChangeSave(module)}
        onChange={(e) => onChangeUpdate({ ...module, name: e.target.value })}
      />

      {SHOW_DESC &&
        <Textarea
          value={module.description || ''}
          onBlur={() => onChangeSave(module)}
          placeholder={t('textPlaceholder')}
          onChange={(e) => onChangeUpdate({ ...module, description: e.target.value })}
        />
      }
    </div>
  )
}
