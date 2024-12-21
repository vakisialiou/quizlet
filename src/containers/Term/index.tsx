import { ClientTermData, DefaultAnswerLang, DefaultQuestionLang, DefaultAssociationLang, languages } from '@entities/ClientTerm'
import Dropdown, { DropdownSkin } from '@components/Dropdown'
import { useCallback, useEffect, useRef } from 'react'
import Button, {ButtonSize} from '@components/Button'
import FolderCart from '@components/FolderCart'
import RowRead from '@containers/Term/RowRead'
import { useTranslations } from 'next-intl'
import SVGFile from '@public/svg/file.svg'
import Input from '@components/Input'

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

export default function Term(
  {
    data,
    edit = false,
    number,
    onEdit,
    onRemove,
    onExit,
    onSave,
    onChange,
    onClickSound,
    soundPlayingName
  }:
  {
    data: ClientTermData
    number: number,
    edit: boolean
    onEdit: () => void
    onRemove: () => void
    onExit: () => void
    onSave: () => void
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
          <SVGFile
            width={16}
            height={16}
          />
          <span>#{number}</span>
        </div>
      )}
      dropdown={{
        items: [
          {id: 1, name: t('cardDropDownEdit')},
          {id: 2, name: t('cardDropDownRemove')},
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
                skin={DropdownSkin.gray}
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
                skin={DropdownSkin.gray}
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
                skin={DropdownSkin.gray}
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

      </div>
    </FolderCart>
  )
}
