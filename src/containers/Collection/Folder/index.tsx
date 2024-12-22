import FolderCart, {DropDownProps} from '@components/FolderCart'
import { FolderFrameVariant } from '@components/FolderFrame'
import SVGArrowDown from '@public/svg/downarrow_hlt.svg'
import {ClientFolderData} from '@entities/ClientFolder'
import ButtonSquare from '@components/ButtonSquare'
import {useTranslations} from 'next-intl'
import Input from '@components/Input'
import {ReactNode} from 'react'
import clsx from 'clsx'

export default function Folder(
  {
    data,
    title,
    labels,
    dropdown,
    className,
    edit = false,
    collapsed = true,
    onCollapse,
    onSave,
    onExit,
    onChange,
    children,
    variant
  }:
  {
    edit?: boolean,
    title: ReactNode,
    collapsed?: boolean,
    className?: string
    labels?: ReactNode,
    dropdown?: DropDownProps,
    data: ClientFolderData,
    onSave: () => void,
    onExit: () => void,
    onChange: (prop: string, value: string) => void,
    onCollapse?: () => void,
    children?: ReactNode,
    variant?: FolderFrameVariant
  }
) {
  const t = useTranslations('Folders')

  return (
    <FolderCart
      hover={false}
      title={title}
      labels={labels}
      variant={variant}
      dropdown={dropdown}
      className={className}
      controls={(
        <ButtonSquare
          size={24}
          icon={SVGArrowDown}
          onClick={onCollapse}
          classNameIcon={clsx('', {
            ['rotate-180']: !collapsed
          })}
        />
      )}
    >
      <div className="w-full font-bold text-white/50 text-sm overflow-hidden flex items-center min-h-8">
        {edit &&
          <Input
            autoFocus
            type="text"
            name="name"
            maxLength={100}
            onBlur={onSave}
            autoComplete="off"
            className="z-10 w-full"
            defaultValue={data.name || ''}
            placeholder={t('folderEditPlaceholder')}
            onChange={(e) => {
              onChange('name', e.target.value)
            }}
            onKeyUp={(e) => {
              switch (e.keyCode) {
                case 13:
                  onSave()
                  break
                case 27:
                  onExit()
                  break
              }
            }}
          />
        }

        {!edit &&
          <div className="pt-[1px] mx-[9px] max-w-full truncate ...">
            <span className="max-w-full">
              {data.name || <span className="italic">{t('folderNoName')}</span>}
            </span>
          </div>
        }
      </div>

      {children}
    </FolderCart>
  )
}
