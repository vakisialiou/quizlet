import Dropdown, { DropdownPlacement } from '@components/Dropdown'
import React, { useCallback, useMemo, useRef } from 'react'
import { actionUpdateModule } from '@store/action-main'
import { MarkersEnum } from '@entities/Marker'
import MetaLabel from '@components/MetaLabel'
import { ModuleData } from '@entities/Module'
import Textarea from '@components/Textarea'
import { useTranslations } from 'next-intl'
import Input from '@components/Input'
import clsx from "clsx";

export default function FolderModule(
  {
    module,
    editable,
    className = ''
  }:
  {
    className?: string
    module: ModuleData
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

  const labelsMap = useMemo(() => {
    return new Map()
      .set(MarkersEnum.new, tl('new'))
      .set(MarkersEnum.done, tl('done'))
      .set(MarkersEnum.focus, tl('focus'))
      .set(MarkersEnum.important, tl('important'))
  }, [tl])

  const labels = useMemo(() => {
    return Array.from(labelsMap.entries()).map(([key, value]) => ({
      id: key,
      name: value
    }))
  }, [labelsMap])

  const selectedLabelId = useMemo(() => {
    return module.markers.find((marker) => labelsMap.has(marker)) || null
  }, [labelsMap, module.markers])

  const SHOW_DESC = false

  return (
    <div
      className={clsx('flex flex-col gap-2 w-full', {
        [className]: className,
      })}
    >
      <Input
        autoFocus={!module.name}
        value={module.name || ''}
        placeholder={t('namePlaceholder')}
        onBlur={() => onChangeSave(module)}
        onChange={(e) => onChangeUpdate({...module, name: e.target.value})}
      />

      <div className="flex items-center justify-between gap-1">
        <Dropdown
          caret
          items={labels}
          selected={module.markers}
          className="h-8 justify-between px-2 gap-1 text-sm"
          placement={DropdownPlacement.bottomStart}
          onSelect={(id) => {
            const marker = id as MarkersEnum
            const markers = [...module.markers].filter(marker => {
              return !labelsMap.get(marker)
            })

            onChangeSave({...module, markers: [...markers, marker]})
          }}
        >
          Label
        </Dropdown>

        {selectedLabelId &&
          <div className="flex gap-1 items-center">
            <MetaLabel key={selectedLabelId}>
              {labelsMap.get(selectedLabelId)}
            </MetaLabel>
          </div>
        }
      </div>

      {SHOW_DESC &&
        <Textarea
          value={module.description || ''}
          onBlur={() => onChangeSave(module)}
          placeholder={t('textPlaceholder')}
          onChange={(e) => onChangeUpdate({...module, description: e.target.value})}
        />
      }
    </div>
  )
}
