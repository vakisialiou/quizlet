import { ClientTermData, DefaultAnswerLang, DefaultQuestionLang, DefaultAssociationLang, languages } from '@entities/ClientTerm'
import Dropdown, { DropdownSkin } from '@components/Dropdown'
import { useCallback, useEffect, useRef } from 'react'
import Button, {ButtonSize} from '@components/Button'
import SVGThreeDots from '@public/svg/three_dots.svg'
import RowRead from '@containers/Term/RowRead'
import Spinner from '@components/Spinner'
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

export default function Term(
  {
    data,
    edit = false,
    process = false,
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
    process: boolean
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

  return (
    <div
      ref={ref}
      className={clsx('border rounded w-full border-gray-500 bg-black/50 flex flex-col select-none overflow-hidden shadow-inner shadow-gray-500/50')}
      onClick={(e) => {
        if (edit) {
          e.preventDefault()
        }
      }}
    >
      <div className="flex items-center justify-between w-full bg-gray-500/20 px-2 h-8">
        <div
          className="bg-gray-300 text-gray-900 rounded-sm flex items-center justify-center px-2 text-xs">
          #{number}
        </div>

        <div className="flex gap-2">
          <Dropdown
            onClick={(e) => e.preventDefault()}
            items={[
              {id: 1, name: 'Edit'},
              {id: 2, name: 'Remove'},
            ]}
            onSelect={(id) => {
              switch (id) {
                case 1:
                  onEdit()
                  break
                case 2:
                  onRemove()
                  break
              }
            }}
          >
            {!process &&
              <SVGThreeDots
                width={23}
                height={23}
                className="text-gray-700"
              />
            }

            {process &&
              <div className="flex items-center justify-center w-8 h-8">
                <Spinner/>
              </div>
            }
          </Dropdown>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-2">

        <div className="flex justify-between gap-2 w-full max-w-full overflow-hidden">
          {!edit &&
            <RowRead
              value={data.question || ''}
              placeholder="Question not set"
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
                autoComplete="off"
                placeholder="Question not set"
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
              placeholder="Answer not set"
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
                autoComplete="off"
                placeholder="Answer not set"
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
              placeholder="Association not set"
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
                name="association"
                autoComplete="off"
                placeholder="Association not set"
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

    </div>
  )
}
