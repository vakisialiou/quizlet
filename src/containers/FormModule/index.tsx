import Dropdown, { DropdownPlacement } from '@components/Dropdown'
import { ModuleData, ModuleMarkersEnum } from '@entities/Module'
import { actionUpdateModule } from '@store/action-main'
import React, { useCallback, useRef } from 'react'
import MetaLabel from '@components/MetaLabel'
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
  const tl = useTranslations('Labels')

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

  const labels = [
    {id: ModuleMarkersEnum.focus, name: tl('focus')},
    {id: ModuleMarkersEnum.important, name: tl('important')}
  ]

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

      <div className="flex items-center justify-between gap-1">
        <Dropdown
          caret
          items={labels}
          selected={module.markers}
          className="h-8 px-2 gap-1 text-sm"
          placement={DropdownPlacement.bottomStart}
          onSelect={(id) => {
            const marker = id as ModuleMarkersEnum
            const markers = [...module.markers]
            const index = markers.indexOf(marker)
            if (index === -1) {
              markers.push(marker)
            } else {
              markers.splice(index, 1)
            }
            onChangeSave({ ...module, markers })
          }}
        >
          Labels
        </Dropdown>

        {module.markers.length > 0 &&
          <div className="flex gap-1 items-center">
            {module.markers.map((marker) => {
              const item = labels.find(({ id }) => marker === id)
              if (!item) {
                return
              }

              return (
                <MetaLabel
                  key={marker}
                  className="px-2"
                >
                  {item.name}
                </MetaLabel>
              )
            })}
          </div>
        }
      </div>

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
