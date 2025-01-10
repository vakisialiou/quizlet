'use client'

import { actionCreateRelationTerm, actionUpdateModule } from '@store/index'
import { findTerms, getModule, RelationProps } from '@helper/relation'
import AchievementDegree from '@containers/AchievementDegree'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import AchievementIcon from '@containers/AchievementIcon'
import Button, {ButtonVariant} from '@components/Button'
import React, {useMemo, useState, useRef, useCallback} from 'react'
import { useModuleSelect } from '@hooks/useModuleSelect'
import ModuleTerms from '@containers/Module/ModuleTerms'
import SearchTermList from '@containers/SearchTermList'
import { useTermSelect } from '@hooks/useTermSelect'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import { filterDeletedTerms } from '@helper/terms'
import RelationTerm from '@entities/RelationTerm'
import ContentPage from '@containers/ContentPage'
import SVGGroups from '@public/svg/syntax_on.svg'
import SVGFileNew from '@public/svg/file_new.svg'
import SVGZoomIn from '@public/svg/zoom_in.svg'
import FolderCart from '@components/FolderCart'
import Collapse from '@components/Collapse'
import Textarea from '@components/Textarea'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import {useRouter} from '@i18n/routing'
import Dialog from '@components/Dialog'
import Input from '@components/Input'
import FolderTitle from '@containers/FolderTitle'
import clsx from 'clsx'
import {ModuleData} from "@entities/Module";
import Dropdown from "@components/Dropdown";
import DialogGroups from "@containers/Collection/DialogGroups";
import {GROUP_SIZE_5, isGenerateGroupDisabled} from "@helper/groups";
import Folders from "@containers/Collection/Folders";

export default function Module({ editable, relation }: { editable: boolean, relation: RelationProps }) {
  const router = useRouter()
  const { terms, relationTerms } = useTermSelect()
  const [ showPartition, setShowPartition ] = useState<Boolean>(false)

  const modules = useModuleSelect()
  const module = useMemo(() => {
    return relation.moduleId ? getModule(modules, relation.moduleId) : null
  }, [modules, relation])


  const relatedTerms = useMemo(() => {
    return filterDeletedTerms(findTerms(relationTerms, terms, relation))
  }, [relationTerms, terms, relation])

  const [ search, setSearch ] = useState<string>('')
  const [ showUserHelp, setShowUserHelp ] = useState(false)

  const t = useTranslations('Module')

  const ref = useRef<{ onCreate?: () => void, onToggleAdd?: () => void }>({})

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

  return (
    <ContentPage
      showHeader
      showFooter
      options={{
        padding: true,
        scrollbarGutter: true,
      }}
      title={(
        <HeaderPageTitle
          title={(
            <div className="flex gap-2 items-center">
              <AchievementIcon
                degreeRate={module ? module.degreeRate : 0}
                showDefault
                size={18}
              />
              {t('headTitle')}
            </div>
          )}
          search={{
            value: search || '',
            placeholder: t('searchPlaceholder'),
            onClear: () => setSearch(''),
            onChange: ({ formattedValue }) => setSearch(formattedValue)
          }}
        />
      )}
      rightControls={(
        <>
          <ButtonSquare
            icon={SVGQuestion}
            disabled={showUserHelp}
            onClick={() => setShowUserHelp(true)}
          />

          <ButtonSquare
            icon={SVGBack}
            onClick={() => {
              router.push(`/private`)
            }}
          />
        </>
      )}
      footer={(
        <>
          <div className="flex w-full justify-center text-center">
            <div className="flex gap-2 w-full max-w-96">
              <Button
                variant={ButtonVariant.WHITE}
                className="w-1/2 gap-1"
                onClick={() => {
                  if (ref.current?.onCreate) {
                    ref.current?.onCreate()
                  }
                }}
              >
                <SVGFileNew
                  width={28}
                  height={28}
                  className="text-gray-700"
                />
                Создать
                {/*{t('footButtonCreateTerm')}*/}
              </Button>

              <Button
                variant={ButtonVariant.WHITE}
                className="w-1/2 gap-1"
                onClick={() => {
                  if (ref.current?.onToggleAdd) {
                    ref.current?.onToggleAdd()
                  }
                }}
              >
                <SVGZoomIn
                  width={28}
                  height={28}
                  className="text-gray-700"
                />

                Добавить
                {/*{t('footButtonPlay')}*/}
              </Button>
            </div>
          </div>
        </>
      )}
    >
      {module &&
        <div className="flex flex-col gap-2">
          <Input
            autoFocus
            value={module.name || ''}
            onBlur={() => onChangeSave(module)}
            onChange={(e) => onChangeUpdate({ ...module, name: e.target.value })}
          />

          <Textarea
            value={module.description || ''}
            onBlur={() => onChangeSave(module)}
            onChange={(e) => onChangeUpdate({ ...module, description: e.target.value })}
          />

          <Collapse
            title={'Группы'}
            controls={(
              <ButtonSquare
                size={24}
                icon={SVGGroups}
                disabled={isGenerateGroupDisabled(relatedTerms, GROUP_SIZE_5)}
                onClick={() => {

                }}
              />
            )}
          >
            <Folders
              module={module}
              onPlay={() => {

              }}
              onRemove={() => {

              }}
            />
          </Collapse>


          <Collapse
            title={'Термины'}
            controls={(
              <>
                <ButtonSquare
                  size={24}
                  icon={SVGFileNew}
                  onClick={() => {
                    if (ref.current?.onCreate) {
                      ref.current?.onCreate()
                    }
                  }}
                />
                <ButtonSquare
                  size={24}
                  icon={SVGZoomIn}
                  onClick={() => {
                    if (ref.current?.onToggleAdd) {
                      ref.current?.onToggleAdd()
                    }
                  }}
                />
              </>
            )}
          >
            {editable && relatedTerms.length === 0 &&
              <div className="flex flex-col items-center justify-center gap-2 p-4">
                <div className="text-white/50 text-sm italic text-center">
                  {t('noCardsHelper', { btnName: t('footButtonCreateTerm') })}
                </div>
              </div>
            }

            <ModuleTerms
              ref={ref}
              shareId={null}
              filter={{ search }}
              editable={editable}
              relation={relation}
              relatedTerms={relatedTerms}
            />
          </Collapse>
        </div>
      }

      {(module && showPartition) &&
        <DialogGroups
          module={module}
          onClose={() => {
            setShowPartition(false)
          }}
        />
      }

      {showUserHelp &&
        <Dialog
          title={t('userHelpTitle')}
          onClose={() => setShowUserHelp(false)}
          text={(
            <div className="flex flex-col gap-4 text-gray-800">

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection1Title')}</div>
                {t('userHelpSection1Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection2Title')}</div>
                {t('userHelpSection2Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection3Title')}</div>
                {t('userHelpSection3Text')}
              </div>
            </div>
          )}
        >
          <Button
            className="min-w-28 px-4"
            variant={ButtonVariant.GRAY}
            onClick={() => setShowUserHelp(false)}
          >
            {t('userHelpButtonClose')}
          </Button>
        </Dialog>
      }
    </ContentPage>
  )
}
