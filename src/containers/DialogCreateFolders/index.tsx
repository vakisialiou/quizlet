import Dropdown, {DropdownVariant} from '@components/Dropdown'
import { actionGenerateFolders } from '@store/action-main'
import Button, {ButtonVariant} from '@components/Button'
import { useMainSelector } from '@hooks/useMainSelector'
import { FolderGroupData } from '@entities/FolderGroup'
import { filterDeletedTerms } from '@helper/terms'
import React, {useMemo, useState} from 'react'
import SVGError from '@public/svg/error.svg'
import { findTerms } from '@helper/relation'
import { useTranslations } from 'next-intl'
import Spinner from '@components/Spinner'
import Dialog from '@components/Dialog'
import {
  GROUP_SIZE_5,
  GROUP_SIZE_10,
  GROUP_SIZE_15,
  DEFAULT_GROUP_SIZE,
  isGenerateGroupDisabled
} from '@helper/groups'

export default function DialogCreateFolders(
  {
    group,
    onDone,
    onClose,
    editable
  }:
    {
      group: FolderGroupData
      onClose: () => void
      onDone: () => void
      editable: boolean
    }
) {
  const terms = useMainSelector(({ terms }) => terms)
  const relationTerms = useMainSelector(({ relationTerms }) => relationTerms)

  const t = useTranslations('Groups')
  const [ state, setState ] = useState<{ size: number, process: boolean }>({ size: DEFAULT_GROUP_SIZE, process: false })

  const moduleTerms = useMemo(() => {
    return filterDeletedTerms(findTerms(relationTerms, terms, { moduleId: group.moduleId }))
  }, [relationTerms, terms, group.moduleId])

  return (
    <Dialog
      title={t('createDialogTitle')}
      text={(
        <div className="flex flex-col items-stretch text-start">
          {isGenerateGroupDisabled(moduleTerms, GROUP_SIZE_5) &&
            <div className="flex justify-center items-center gap-2 mt-2 mb-4 text-xs text-yellow-700">
              <SVGError
                width={24}
                height={24}
                className="min-w-[24px]"
              />
              <span>{t('createDialogWarn')}</span>
            </div>
          }

          <div className="flex justify-between">
            <div className="text-black/50 font-bold">
              {t('createDialogLabel')}
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
                name: t('createDialogSize', {size: GROUP_SIZE_5}),
                disabled: isGenerateGroupDisabled(moduleTerms, GROUP_SIZE_5)
              },
              {
                id: GROUP_SIZE_10,
                name: t('createDialogSize', {size: GROUP_SIZE_10}),
                disabled: isGenerateGroupDisabled(moduleTerms, GROUP_SIZE_10)
              },
              {
                id: GROUP_SIZE_15,
                name: t('createDialogSize', {size: GROUP_SIZE_15}),
                disabled: isGenerateGroupDisabled(moduleTerms, GROUP_SIZE_15)
              },
            ]}
            onSelect={(id) => {
              setState({ ...state, size: id as number })
            }}
          >
            <span>
              {t('createDialogSize', { size: state.size })}
            </span>
          </Dropdown>
        </div>
      )}
      onClose={() => {
        setState({process: false, size: DEFAULT_GROUP_SIZE})
        onClose()
      }}
    >
      <Button
        className="min-w-28 px-4"
        variant={ButtonVariant.GREEN}
        disabled={isGenerateGroupDisabled(moduleTerms, GROUP_SIZE_5)}
        onClick={() => {
          setState({ ...state, process: true })
          actionGenerateFolders({ editable, group, terms: moduleTerms, size: state.size }, () => {
            setState({ ...state, process: false, size: DEFAULT_GROUP_SIZE })
            onDone()
          })
        }}
      >
        {t('createDialogButtonApply')}
      </Button>

      <Button
        className="min-w-28 px-4"
        variant={ButtonVariant.WHITE}
        onClick={() => {
          setState({ process: false, size: DEFAULT_GROUP_SIZE })
          onClose()
        }}
      >
        {t('createDialogButtonCancel')}
      </Button>
    </Dialog>
  )
}
