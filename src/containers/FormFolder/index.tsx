import { actionUpdateFolder } from '@store/action-main'
import React, { useCallback, useRef } from 'react'
import { FolderData } from '@entities/Folder'
import { useTranslations } from 'next-intl'
import Input from '@components/Input'

export default function FormFolder(
  {
    folder,
    editable
  }:
  {
    folder: FolderData,
    editable: boolean
  }
) {
  const t = useTranslations('Folder')
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const onChangeUpdate = useCallback((folder: FolderData) => {
    actionUpdateFolder({ folder, editId: folder.id, editable: false })
    if (!editable) {
      return
    }

    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    timeoutId.current = setTimeout(() => {
      actionUpdateFolder({ folder, editId: folder.id, editable })
    }, 200)
  }, [editable])

  const onChangeSave = useCallback((folder: FolderData) => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }
    actionUpdateFolder({ folder, editId: null, editable })
  }, [editable])

  return (
    <div className="flex flex-col gap-2 w-full">
      <Input
        autoFocus={!folder.name}
        value={folder.name || ''}
        placeholder={t('namePlaceholder')}
        onBlur={() => onChangeSave(folder)}
        onChange={(e) => onChangeUpdate({ ...folder, name: e.target.value })}
      />

    </div>
  )
}
