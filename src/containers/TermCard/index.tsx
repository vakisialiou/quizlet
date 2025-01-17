import { TermData, DefaultAnswerLang, DefaultQuestionLang, DefaultAssociationLang, languages } from '@entities/Term'
import Dropdown, { DropdownVariant } from '@components/Dropdown'
import SVGArrowDown from '@public/svg/downarrow_hlt.svg'
import Button, { ButtonSize } from '@components/Button'
import { useCallback, useEffect, useRef } from 'react'
import SVGPencil from '@public/svg/greasepencil.svg'
import ButtonSquare from '@components/ButtonSquare'
import RowRead from '@containers/TermCard/RowRead'
import FolderCart from '@components/FolderCart'
import SVGTrash from '@public/svg/trash.svg'
import SVGError from '@public/svg/error.svg'
import { useTranslations } from 'next-intl'
import Input from '@components/Input'
import clsx from 'clsx'

export enum SoundPlayingNameEnum {
  answer = 'answer',
  question = 'question',
  association = 'association'
}

export type ClickSoundCallbackParams = {
  play: boolean,
  lang: string,
  text: string
  name: string
}

export default function TermCard(
  {
    data,
    edit = false,
    number,
    onEdit,
    onRemove,
    onExit,
    onSave,
    onChange,
    readonly,
    collapsed = true,
    onCollapse,
    onClickSound,
    soundPlayingName
  }:
  {
    data: TermData
    number: number
    edit: boolean
    readonly: boolean
    collapsed: boolean
    onEdit: () => void
    onRemove: () => void
    onExit: () => void
    onSave: () => void
    onCollapse?: () => void,
    onChange: (prop: string, value: string) => void
    soundPlayingName: SoundPlayingNameEnum | string | null,
    onClickSound: (params: ClickSoundCallbackParams) => void
  }
) {
  const refAssociationLang = useRef<{ element: HTMLDivElement | null, menu: HTMLDivElement | null }>(null)
  const refQuestionLang = useRef<{ element: HTMLDivElement | null, menu: HTMLDivElement | null }>(null)
  const refAnswerLang = useRef<{ element: HTMLDivElement | null, menu: HTMLDivElement | null }>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  const finishEdit = useCallback((event: MouseEvent) => {
    if (refQuestionLang.current?.menu || refAnswerLang.current?.menu || refAssociationLang.current?.menu) {
      return
    }
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

  const getLocaleShortName = useCallback((lang: string | null, defaultLang: string) => {
    lang = lang || defaultLang
    return lang.split('-')[0]
  }, [])

  const t = useTranslations('Terms')

  return (
    <FolderCart
      hover={false}
      title={(
        <div className="flex gap-2 items-center font-bold">
          <span>#{number}</span>

          {((!data.question || !data.answer) && collapsed && !edit) &&
            <SVGError
              width={16}
              height={16}
              className="text-red-600"
            />
          }
        </div>
      )}
      controls={(
        <ButtonSquare
          size={24}
          disabled={edit}
          icon={SVGArrowDown}
          onClick={onCollapse}
          classNameIcon={clsx('', {
            ['rotate-180']: !collapsed
          })}
        />
      )}
      dropdown={{
        hidden: readonly,
        items: [
          { id: 1, name: t('cardDropDownEdit'), icon: SVGPencil },
          { id: 2, name: t('cardDropDownRemove'), icon: SVGTrash },
        ],
        onSelect: (id) => {
          switch (id) {
            case 1:
              onEdit()
              break
            case 2:
              onRemove()
              break
          }
        }
      }}
    >
      <div ref={ref} className="flex flex-col gap-1">

        <div className="flex justify-between gap-2 w-full max-w-full overflow-hidden">
          {!edit &&
            <RowRead
              value={data.question || ''}
              placeholder={(
                <span className="text-red-800 italic">
                  {t('cardQuestionHintR')}
                </span>
              )}
              soundPlaying={soundPlayingName === SoundPlayingNameEnum.question}
              lang={getLocaleShortName(data.questionLang, DefaultQuestionLang)}
              onClickSound={(play) => {
                onClickSound({
                  play,
                  text: data.question || '',
                  name: SoundPlayingNameEnum.question,
                  lang: data.questionLang || DefaultQuestionLang
                })
              }}
            />
          }

          {edit &&
            <div
              className="flex gap-1 w-full"
            >
              <Input
                autoFocus
                type="text"
                name="question"
                maxLength={100}
                autoComplete="off"
                placeholder={t('cardQuestionHintW')}
                defaultValue={data.question || ''}
                onChange={(e) => {
                  onChange('question', e.target.value)
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

              <Dropdown
                caret
                className="px-1"
                items={languages}
                ref={refQuestionLang}
                variant={DropdownVariant.gray}
                selected={data.questionLang || DefaultQuestionLang}
                onClick={(e) => e.preventDefault()}
                onSelect={(id) => {
                  onChange('questionLang', id as string)
                }}
              >
                <div className="w-6 min-w-6 text-center text-sm uppercase">
                  {getLocaleShortName(data.questionLang, DefaultQuestionLang)}
                </div>
              </Dropdown>
            </div>
          }
        </div>

        {!collapsed &&
          <div className="flex w-full max-w-full overflow-hidden">
            {!edit &&
              <RowRead
                value={data.answer || ''}
                placeholder={(
                  <span className="text-red-800 italic">
                    {t('cardAnswerHintR')}
                  </span>
                )}
                lang={getLocaleShortName(data.answerLang, DefaultAnswerLang)}
                soundPlaying={soundPlayingName === SoundPlayingNameEnum.answer}
                onClickSound={(play) => {
                  onClickSound({
                    play,
                    text: data.answer || '',
                    name: SoundPlayingNameEnum.answer,
                    lang: data.answerLang || DefaultAnswerLang
                  })
                }}
              />
            }

            {edit &&
              <div
                className="flex gap-1 w-full"
              >
                <Input
                  type="text"
                  name="answer"
                  maxLength={100}
                  autoComplete="off"
                  placeholder={t('cardAnswerHintW')}
                  defaultValue={data.answer || ''}
                  onChange={(e) => {
                    onChange('answer', e.target.value)
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

                <Dropdown
                  caret
                  className="px-1"
                  items={languages}
                  ref={refAnswerLang}
                  variant={DropdownVariant.gray}
                  onClick={(e) => e.preventDefault()}
                  selected={data.answerLang || DefaultAnswerLang}
                  onSelect={(id) => {
                    onChange('answerLang', id as string)
                  }}
                >
                  <div className="w-6 min-w-6 text-center text-sm uppercase">
                    {getLocaleShortName(data.answerLang, DefaultAnswerLang)}
                  </div>
                </Dropdown>
              </div>
            }
          </div>
        }

        {!collapsed &&
          <div className="flex w-full max-w-full overflow-hidden">
            {!edit &&
              <RowRead
                value={data.association || ''}
                placeholder={(
                  <span className="text-gray-700 italic">
                    {t('cardAssociationHintR')}
                  </span>
                )}
                soundPlaying={soundPlayingName === SoundPlayingNameEnum.association}
                lang={getLocaleShortName(data.associationLang, DefaultAssociationLang)}
                onClickSound={(play) => {
                  onClickSound({
                    play,
                    text: data.association || '',
                    name: SoundPlayingNameEnum.association,
                    lang: data.associationLang || DefaultAssociationLang
                  })
                }}
              />
            }

            {edit &&
              <div
                className="flex gap-1 w-full"
              >
                <Input
                  type="text"
                  maxLength={255}
                  name="association"
                  autoComplete="off"
                  placeholder={t('cardAssociationHintW')}
                  defaultValue={data.association || ''}
                  onChange={(e) => {
                    onChange('association', e.target.value)
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

                <Button
                  disabled
                  rounded={false}
                  onClick={() => {
                  }}
                  size={ButtonSize.H08}
                >
                  AI
                </Button>

                <Dropdown
                  caret
                  className="px-1"
                  items={languages}
                  ref={refAssociationLang}
                  variant={DropdownVariant.gray}
                  onClick={(e) => e.preventDefault()}
                  selected={data.associationLang || DefaultAssociationLang}
                  onSelect={(id) => {
                    onChange('associationLang', id as string)
                  }}
                >
                  <div className="w-6 min-w-6 text-center text-sm uppercase">
                    {getLocaleShortName(data.associationLang, DefaultAssociationLang)}
                  </div>
                </Dropdown>
              </div>
            }
          </div>
        }

      </div>
    </FolderCart>
  )
}
