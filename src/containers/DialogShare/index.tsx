import Dropdown, { DropdownVariant } from '@components/Dropdown'
import Button, { ButtonVariant } from '@components/Button'
import { useMainSelector } from '@hooks/useMainSelector'
import { ModuleShareEnum } from '@entities/ModuleShare'
import { actionShareModule } from '@store/action-main'
import { useLocale, useTranslations } from 'next-intl'
import SVGCheckmark from '@public/svg/checkmark.svg'
import React, { useCallback, useState } from 'react'
import { ModuleData } from '@entities/Module'
import { getPathname } from '@i18n/routing'
import { clipboard } from '@lib/clipboard'
import Spinner from '@components/Spinner'
import SVGError from '@public/svg/x.svg'
import Dialog from '@components/Dialog'

type TypeShare = {
  access: ModuleShareEnum,
  link: string | null,
  process: boolean,
  error: boolean
}

export default function DialogShare(
  {
    module,
    onClose
  }:
  {
    module: ModuleData
    onClose: () => void
  }
) {
  const moduleShares = useMainSelector(({ moduleShares }) => moduleShares)
  const t = useTranslations('Modules')
  const locale = useLocale()

  const [ state, setState ] = useState<TypeShare>({
    link: null,
    error: false,
    process: false,
    access: ModuleShareEnum.readonly
  })

  const copyShareLink = useCallback((shareId: string) => {
    const link = `${origin}${getPathname({ href: `/share/${shareId}`, locale })}`
    clipboard(link, (error) => {
      setState({ ...state, link, error, process: false })

      setTimeout(() => {
        setState({ ...state, link: null })
      }, 2000)
    })
  }, [state, locale])

  return (
    <Dialog
      title={t('shareDialogTitle')}
      text={(
        <div className="flex flex-col items-stretch text-start">
          <div className="flex justify-between">
            <div className="text-black/50 font-bold">
              {t('shareDialogLabel')}
            </div>
            {state.error &&
              <div className="flex text-red-500 lowercase gap-1">
                {t('shareDialogNotCopied')}

                <SVGError
                  width={16}
                  height={16}
                />
              </div>
            }

            {(!state.error && state.link) &&
              <div className="flex text-green-600 lowercase gap-1">
                {t('shareDialogCopied')}

                <SVGCheckmark
                  width={16}
                  height={16}
                />
              </div>
            }

            {(!state.link && state.process) &&
              <Spinner
                size={4}
              />
            }
          </div>

          <Dropdown
            caret
            bordered
            disabled={!state.link}
            selected={[state.access]}
            variant={DropdownVariant.white}
            className="py-2 px-2 justify-between"
            items={[
              {
                id: ModuleShareEnum.readonly,
                name: t('shareDialogReadonly'),
              },
              {
                id: ModuleShareEnum.editable,
                name: t('shareDialogEditable'),
              },
            ]}
            onSelect={(id) => {
              setState({ ...state, access: id as ModuleShareEnum })
            }}
          >
            <span>
              {state.access === ModuleShareEnum.readonly
                ? t('shareDialogReadonly')
                : t('shareDialogEditable')
              }
            </span>
          </Dropdown>
        </div>
      )}
      onClose={() => {
        setState({
          link: null,
          error: false,
          process: false,
          access: ModuleShareEnum.readonly
        })
        onClose()
      }}
    >
      <Button
        className="min-w-40 px-4"
        variant={ButtonVariant.GREEN}
        onClick={async () => {
          const moduleShare = moduleShares.find(({ moduleId, access }) => {
            return moduleId === module.id && access === state.access
          })

          if (moduleShare) {
            copyShareLink(moduleShare.id)
            return
          }

          setState({ ...state, process: true })
          actionShareModule({ module, access: state.access }, (moduleShare) => {
            copyShareLink(moduleShare.id)
          })
        }}
      >
        {t('shareDialogButtonCopy')}
      </Button>
    </Dialog>
  )
}
