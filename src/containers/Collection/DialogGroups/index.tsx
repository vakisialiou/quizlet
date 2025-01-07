import Dropdown, {DropdownVariant} from '@components/Dropdown'
import {actionCreateModuleGroup} from '@store/index'
import Button, {ButtonVariant} from '@components/Button'
import { useTermSelect } from '@hooks/useTermSelect'
import { findGroupFolders, findTerms } from '@helper/relation'
import { filterDeletedTerms } from '@helper/terms'
import React, {useMemo, useState} from 'react'
import { ModuleData } from '@entities/Module'
import { useTranslations } from 'next-intl'
import Spinner from '@components/Spinner'
import Dialog from '@components/Dialog'
import {
  DEFAULT_GROUP_SIZE,
  GROUP_SIZE_5,
  GROUP_SIZE_10,
  GROUP_SIZE_15,
  GROUP_SIZE_20,
  GROUP_SIZE_25,
  GROUP_SIZE_30,
  isGenerateGroupDisabled
} from '@helper/groups'

export default function DialogGroups(
  {
    module,
    onClose
  }:
  {
    module: ModuleData
    onClose: () => void
  }
) {
  const { relationTerms, terms } = useTermSelect()

  const t = useTranslations('Folders')
  const [ state, setState ] = useState<{ size: number, process: boolean }>({ size: DEFAULT_GROUP_SIZE, process: false })

  const moduleTerms = useMemo(() => {
    return filterDeletedTerms(findTerms(relationTerms, terms, { moduleId: module.id }))
  }, [relationTerms, terms, module.id])

  return (
    <Dialog
      title={t('generateDialogTitle')}
      text={(
        <div className="flex flex-col items-stretch text-start">
          <div className="flex justify-between">
            <div className="text-black/50 font-bold">
              {t('generateDialogPartitionLabel')}
            </div>

            {state.process &&
              <Spinner size={4} />
            }
          </div>

          <Dropdown
            caret
            bordered
            selected={state.size}
            variant={DropdownVariant.white}
            className="py-2 px-2 justify-between"
            items={[
              {
                id: GROUP_SIZE_5,
                name: t('generateDialogPartitionSize', {size: GROUP_SIZE_5}),
                disabled: isGenerateGroupDisabled(moduleTerms, GROUP_SIZE_5)
              },
              {
                id: GROUP_SIZE_10,
                name: t('generateDialogPartitionSize', {size: GROUP_SIZE_10}),
                disabled: isGenerateGroupDisabled(moduleTerms, GROUP_SIZE_10)
              },
              {
                id: GROUP_SIZE_15,
                name: t('generateDialogPartitionSize', {size: GROUP_SIZE_15}),
                disabled: isGenerateGroupDisabled(moduleTerms, GROUP_SIZE_15)
              },
              {
                id: GROUP_SIZE_20,
                name: t('generateDialogPartitionSize', {size: GROUP_SIZE_20}),
                disabled: isGenerateGroupDisabled(moduleTerms, GROUP_SIZE_20)
              },
              {
                id: GROUP_SIZE_25,
                name: t('generateDialogPartitionSize', {size: GROUP_SIZE_25}),
                disabled: isGenerateGroupDisabled(moduleTerms, GROUP_SIZE_25)
              },
              {
                id: GROUP_SIZE_30,
                name: t('generateDialogPartitionSize', { size: GROUP_SIZE_30 }),
                disabled: isGenerateGroupDisabled(moduleTerms, GROUP_SIZE_30)
              },
            ]}
            onSelect={(id) => {
              setState({ ...state, size: id as number })
            }}
          >
            <span>
              {t('generateDialogPartitionSize', { size: state.size })}
            </span>
          </Dropdown>
        </div>
      )}
      onClose={() => {
        setState({ process: false, size: DEFAULT_GROUP_SIZE })
        onClose()
      }}
    >
      <Button
        variant={ButtonVariant.GREEN}
        className="min-w-28 px-4"
        disabled={isGenerateGroupDisabled(moduleTerms, GROUP_SIZE_5)}
        onClick={() => {
          setState({ ...state, process: true })
          actionCreateModuleGroup({ moduleId: module.id, termIds: moduleTerms.map(({ id }) => id), size: state.size }, () => {
            setState({ ...state, process: false, size: DEFAULT_GROUP_SIZE })
            onClose()
          })
        }}
      >
        {t('generateDialogButtonGenerate')}
      </Button>
    </Dialog>
  )
}
