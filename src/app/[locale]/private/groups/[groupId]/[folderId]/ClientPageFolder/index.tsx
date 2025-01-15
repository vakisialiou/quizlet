'use client'

import {
  actionUpdateFolder,
  actionCreateRelationFolder,
  actionCreateRelationTerm
} from '@store/index'
import React, { useMemo, useState, useRef, useEffect } from 'react'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import Button, {ButtonVariant} from '@components/Button'
import { useFolderSelect } from '@hooks/useFolderSelect'
import { findTerms, getFolder } from '@helper/relation'
import RelationFolder from '@entities/RelationFolder'
import SVGFileBlank from '@public/svg/file_blank.svg'
import { useTermSelect } from '@hooks/useTermSelect'
import RelatedTerms from '@containers/RelatedTerms'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import { filterDeletedTerms } from '@helper/terms'
import ContentPage from '@containers/ContentPage'
import FolderTitle from '@containers/FolderTitle'
import FormFolder from '@containers/FormFolder'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import {useRouter} from '@i18n/routing'
import Dialog from '@components/Dialog'
import Folder from '@entities/Folder'
import FolderCart from '@components/FolderCart'
import Dropdown from "@components/Dropdown";
import TermsDropdownMenu from "@containers/TermsDropdownMenu";
import RelationTerm from "@entities/RelationTerm";
import SVGFileNew from "@public/svg/file_new.svg";

export default function ClientPageFolder({ editable, groupId, folderId }: { editable: boolean, groupId: string, folderId: string }) {
  const router = useRouter()

  const folders = useFolderSelect()
  const folder = useMemo(() => {
    return getFolder(folders, folderId)
  }, [folders, folderId])

  const initRef = useRef(true)

  useEffect(() => {
    if (folder) {
      return
    }

    if (!initRef.current) {
      return
    }

    initRef.current = false

    const newFolder = new Folder().setId(folderId).serialize()
    const relationFolder = new RelationFolder()
      .setFolderId(newFolder.id)
      .setGroupId(groupId)
      .serialize()

    actionUpdateFolder({ editable, editId: null, folder: newFolder }, () => {
      actionCreateRelationFolder({ editable, relationFolder })
    })
  }, [folder, folderId])

  const { terms, relationTerms } = useTermSelect()

  const relatedTerms = useMemo(() => {
    return filterDeletedTerms(findTerms(relationTerms, terms, { folderId }))
  }, [relationTerms, terms, folderId])

  const [ search, setSearch ] = useState<string>('')
  const [ showUserHelp, setShowUserHelp ] = useState(false)

  const t = useTranslations('Folder')

  const ref = useRef<{ onCreate?: () => void }>({})

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
          title={t('headTitle')}
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
          <Button
            variant={ButtonVariant.WHITE}
            className="w-full max-w-96"
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
            {t('footButtonCreateTerm')}
          </Button>
        </div>
      )}
    >
      {folder &&
        <div className="flex flex-col gap-2">
          <FolderTitle
            className="mb-4"
            relation={{ folderId }}
          />

          <FormFolder
            folder={folder}
            editable={editable}
          />

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
                          .setFolderId(folderId)
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
            <RelatedTerms
              ref={ref}
              shareId={null}
              filter={{search}}
              editable={editable}
              relation={{ folderId }}
              relatedTerms={relatedTerms}
            />
          </FolderCart>
        </div>
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
