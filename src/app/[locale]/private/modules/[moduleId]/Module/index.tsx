'use client'

import {actionCreateRelationTerm, actionUpdateModule} from '@store/index'
import {findTerms, getModule, RelationProps} from '@helper/relation'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import AchievementIcon from '@containers/AchievementIcon'
import Button, {ButtonVariant} from '@components/Button'
import React, {useCallback, useMemo, useRef, useState} from 'react'
import {useModuleSelect} from '@hooks/useModuleSelect'
import RelatedTerms from '@containers/RelatedTerms'
import {useTermSelect} from '@hooks/useTermSelect'
import ButtonSquare, {ButtonSquareVariant} from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import {filterDeletedTerms} from '@helper/terms'
import ContentPage from '@containers/ContentPage'
import SVGGroups from '@public/svg/syntax_on.svg'
import SVGFileNew from '@public/svg/file_new.svg'
import SVGFileBlank from '@public/svg/file_blank.svg'
import FolderCart from '@components/FolderCart'
import Textarea from '@components/Textarea'
import {useTranslations} from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import {useRouter} from '@i18n/routing'
import Dialog from '@components/Dialog'
import Input from '@components/Input'
import {ModuleData} from "@entities/Module";
import Dropdown from "@components/Dropdown";
import DialogGroups from "@containers/DialogGroups";
import DialogRemoveFolder from "@containers/DialogRemoveFolder";
import {GROUP_SIZE_5, isGenerateGroupDisabled} from "@helper/groups";
import Folders from "@containers/Collection/Folders";
import SVGThreeDots from "@public/svg/three_dots.svg";
import RelationTerm from "@entities/RelationTerm";
import TermsDropdownMenu from "@containers/TermsDropdownMenu";
import {FolderGroupData} from "@entities/FolderGroup";
import {FolderData} from "@entities/Folder";
import FormModule from '@containers/FormModule'


export default function Module({ editable, relation }: { editable: boolean, relation: RelationProps }) {
  const router = useRouter()
  const { terms, relationTerms } = useTermSelect()
  const [ showPartition, setShowPartition ] = useState<Boolean>(false)
  const [ removeFolder, setRemoveFolder ] = useState<{ group: FolderGroupData, folder: FolderData } | null>(null)

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
              <SVGFileBlank
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
              <SVGFileNew
                width={28}
                height={28}
                className="text-gray-700"
              />

              Добавить
              {/*{t('footButtonPlay')}*/}
            </Button>
          </div>
        </div>
      )}
    >
      {module &&
        <div className="flex flex-col gap-2">
          <FormModule
            module={module}
            editable={editable}
          />

          <FolderCart
            hover={false}
            title={'Группы'}
            dropdown={{ hidden: true }}
            controls={(
              <ButtonSquare
                size={24}
                icon={SVGGroups}
                disabled={isGenerateGroupDisabled(relatedTerms, GROUP_SIZE_5)}
                onClick={() => {
                  setShowPartition(true)
                }}
              />
            )}
          >
            <Folders
              module={module}
              onEdit={(group, folder) => {
                router.push(`/private/folders/${folder.id}`)
              }}
              onPlay={(group, folder) => {
                router.push(`/simulator?folderId=${folder.id}`)
              }}
              onRemove={(group, folder) => {
                setRemoveFolder({ group, folder })
              }}
            />
          </FolderCart>


          <FolderCart
            hover={false}
            title={'Термины'}
            dropdown={{
              hidden: true
            }}
            controls={(
              <>
                <ButtonSquare
                  size={18}
                  icon={SVGFileBlank}
                  onClick={() => {
                    if (ref.current?.onCreate) {
                      ref.current?.onCreate()
                    }
                  }}
                />
                <Dropdown
                  caret
                  className="px-2 min-w-8 h-8 items-center"
                  menu={(
                    <TermsDropdownMenu
                      excludeTerms={relatedTerms}
                      className="w-56"
                      onClick={(term) => {
                        const relationTerm = new RelationTerm()
                          .setModuleId(relation.moduleId || null)
                          .setFolderId(relation.folderId || null)
                          .setTermId(term.id)
                          .serialize()

                        actionCreateRelationTerm({ relationTerm, editable })
                      }}
                    />
                  )}
                >
                  <SVGFileNew
                    width={18}
                    height={18}
                  />
                </Dropdown>
              </>
            )}
          >
            {editable && relatedTerms.length === 0 &&
              <div className="flex flex-col w-full items-center justify-center gap-2 p-4">
                <div className="text-white/50 text-sm italic text-center">
                  {t('noCardsHelper', { btnName: t('footButtonCreateTerm') })}
                </div>
              </div>
            }

            <RelatedTerms
              ref={ref}
              shareId={null}
              filter={{ search }}
              editable={editable}
              relation={relation}
              relatedTerms={relatedTerms}
            />
          </FolderCart>
        </div>
      }

      {removeFolder &&
        <DialogRemoveFolder
          editable={editable}
          group={removeFolder.group}
          folder={removeFolder.folder}
          onClose={() => {
            setRemoveFolder(null)
          }}
          onDone={() => {
            setRemoveFolder(null)
          }}
        />
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
