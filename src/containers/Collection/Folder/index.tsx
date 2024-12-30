import { ReactNode, useCallback, useEffect, useRef } from 'react'
import FolderCart, {DropDownProps} from '@components/FolderCart'
import { FolderFrameVariant } from '@components/FolderFrame'
import SVGArrowDown from '@public/svg/downarrow_hlt.svg'
import {ClientFolderData} from '@entities/ClientFolder'
import ButtonSquare from '@components/ButtonSquare'
import {useTranslations} from 'next-intl'
import Textarea from '@components/Textarea'
import Input from '@components/Input'
import Clamp from '@components/Clamp'
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

  const ref = useRef<HTMLDivElement | null>(null)

  const finishEdit = useCallback((event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLDivElement)) {
      onSave()
    }
  }, [onSave])

  useEffect(() => {
    if (edit) {
      document.addEventListener('mousedown', finishEdit)
    } else {
      document.removeEventListener('mousedown', finishEdit)
    }
    return () => {
      document.removeEventListener('mousedown', finishEdit)
    }
  }, [finishEdit, edit, data])

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
      <div
        ref={ref}
        className="flex flex-col gap-1 w-full font-bold text-white/50 text-sm overflow-hidden justify-center min-h-8"
      >
        {edit &&
          <Input
            autoFocus
            type="text"
            name="name"
            maxLength={100}
            autoComplete="off"
            className="z-10 w-full"
            defaultValue={data.name || ''}
            placeholder={t('folderEditNamePlaceholder')}
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

        {edit &&
          <Textarea
            rows={4}
            name="description"
            maxLength={16000}
            autoComplete="off"
            className="z-10 w-full"
            defaultValue={data.description || ''}
            placeholder={t('folderEditDescPlaceholder')}
            onChange={(e) => {
              onChange('description', e.target.value)
            }}
            onKeyUp={(e) => {
              switch (e.keyCode) {
                case 27:
                  onExit()
                  break
              }
            }}
          />
        }

        {!edit &&
          <div className="flex items-center h-8 pt-[1px] mx-[9px] text-white/75">
            <div className="max-w-full truncate ...">
              <span className="max-w-full select-text">
                {data.name || <span className="italic">{t('folderNoName')}</span>}
              </span>
            </div>
          </div>
        }

        {(!edit && data.description && !collapsed) &&
          <div className="flex pt-[1px] mx-[9px]">
            <Clamp
              rows={3}
              key={edit ? 1 : 0}
              className="max-w-full w-full"
              btnClumpMore={'Show more'}
              btnClumpLess={'Show less'}
            >
              {data.description}
            </Clamp>
          </div>
        }
      </div>

      {children}
    </FolderCart>
  )
}
