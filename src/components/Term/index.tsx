import {useCallback, useEffect, useMemo, useRef} from 'react'
import Button, {ButtonSize} from '@components/Button'
import SVGThreeDots from '@public/svg/three_dots.svg'
import {ClientTermData} from '@entities/ClientTerm'
import Dropdown from '@components/Dropdown'
import Spinner from '@components/Spinner'
import Input from '@components/Input'
import {voices} from '@lib/speech'
import clsx from 'clsx'

export default function Term(
  {
    data,
    edit = false,
    process = false,
    onEdit,
    onRemove,
    onExit,
    onSave,
    onChange
  }:
  {
    data: ClientTermData,
    edit: boolean,
    process: boolean,
    onEdit: () => void,
    onRemove: () => void,
    onExit: () => void,
    onSave: () => void,
    onChange: (prop: string, value: string) => void
  }
) {

  const refQuestionLang = useRef<{ element: HTMLDivElement | null, menu: HTMLDivElement | null }>(null)
  const refAnswerLang = useRef<{ element: HTMLDivElement | null, menu: HTMLDivElement | null }>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  const finishEdit = useCallback((event: MouseEvent) => {
    if (refQuestionLang.current?.menu || refAnswerLang.current?.menu) {
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

  const dropdownLocales = useMemo(() => {
    return voices.map(({ name, lang }) => {
      return { id: lang, name, shortName: lang.split('-')[1] }
    })
  }, [])

  return (
    <div
      ref={ref}
      className={clsx('border rounded w-full border-gray-500 bg-gray-900/50 flex flex-col gap-0.5 p-4 select-none overflow-hidden shadow-inner shadow-gray-500/50')}
      onClick={(e) => {
        if (edit) {
          e.preventDefault()
        }
      }}
    >
      <div className="flex justify-between gap-2 w-full max-w-full overflow-hidden">
        {!edit &&
          <>
            <div
              title={data.question || ''}
              className="inline content-center px-[9px] pt-[1px] h-8 text-gray-400 text-sm truncate ..."
            >
              {data.question || <span className="text-gray-500">Question not set</span>}
            </div>

            <div className="flex gap-2 items-center">

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
                      width={32}
                      height={32}
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
          </>
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
              ref={refQuestionLang}
              items={dropdownLocales}
              onClick={(e) => e.preventDefault()}
              onSelect={(id) => {
                onChange('questionLang', id as string)
              }}
            >
              <div className="w-4 mx-2">
                {dropdownLocales.find(({ id }) => id === data.questionLang)?.shortName}
              </div>
            </Dropdown>
          </div>
        }
      </div>

      <div className="flex w-full max-w-full overflow-hidden">
        {!edit &&
          <div
            title={data.answer || ''}
            className="inline content-center px-[9px] pt-[1px] h-8 text-sm text-gray-400 truncate ..."
          >
            {data.answer || <span className="text-gray-500">Answer not set</span>}
          </div>
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
              ref={refAnswerLang}
              items={dropdownLocales}
              onClick={(e) => e.preventDefault()}
              onSelect={(id) => {
                onChange('answerLang', id as string)
              }}
            >
              <div className="w-4 mx-2">
                {dropdownLocales.find(({id}) => id === data.answerLang)?.shortName}
              </div>
            </Dropdown>
          </div>
        }
      </div>

      <div className="flex w-full max-w-full overflow-hidden">
        {!edit &&
          <div
            title={data.association || ''}
            className="inline content-center px-[9px] pt-[1px] h-8 text-sm text-gray-400 truncate ..."
          >
            {data.association || <span className="text-gray-500">Association not set</span>}
          </div>
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
              onClick={() => {}}
              size={ButtonSize.H08}
            >
              AI
            </Button>
          </div>
        }
      </div>

    </div>
  )
}
