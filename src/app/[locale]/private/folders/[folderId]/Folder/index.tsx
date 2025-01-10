'use client'

import {findTerms, getFolder, RelationProps} from '@helper/relation'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import Button, {ButtonVariant} from '@components/Button'
import React, { useMemo, useState, useRef } from 'react'
import { actionCreateRelationTerm } from '@store/index'
// import SearchTermList from '@containers/SearchTermList'
import { useTermSelect } from '@hooks/useTermSelect'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import { filterDeletedTerms } from '@helper/terms'
import RelationTerm from '@entities/RelationTerm'
import ContentPage from '@containers/ContentPage'
import SVGFileNew from '@public/svg/file_new.svg'
import FolderTitle from '@containers/FolderTitle'
import SVGZoomIn from '@public/svg/zoom_in.svg'
// import Grid from '@containers/Module/ModuleTerms'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import {useRouter} from '@i18n/routing'
import Dialog from '@components/Dialog'
import clsx from 'clsx'
import RelatedTerms from "@containers/RelatedTerms";
import FormFolder from '@containers/FormFolder'
import { useFolderSelect } from "@hooks/useFolderSelect";

export default function Folder({ editable, relation }: { editable: boolean, relation: RelationProps }) {
  const router = useRouter()

  const folders = useFolderSelect()
  const folder = useMemo(() => {
    return relation.folderId ? getFolder(folders, relation.folderId) : null
  }, [folders, relation])

  const { terms, relationTerms } = useTermSelect()

  const relatedTerms = useMemo(() => {
    return filterDeletedTerms(findTerms(relationTerms, terms, relation))
  }, [relationTerms, terms, relation])

  const [ search, setSearch ] = useState<string>('')
  const [ showUserHelp, setShowUserHelp ] = useState(false)
  const [ showSearchTerms, setShowSearchTerms ] = useState(false)

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
                onClick={() => setShowSearchTerms(true)}
              >
                <SVGZoomIn
                  width={28}
                  height={28}
                  className={clsx('text-gray-100')}
                />

                Добавить
                {/*{t('footButtonPlay')}*/}
              </Button>
            </div>
          </div>
        </>
      )}
    >
      {folder &&
        <div className="flex flex-col gap-2">
          <FolderTitle
            className="mb-4"
            relation={relation}
          />

          <FormFolder
            folder={folder}
            editable={editable}
          />

          <RelatedTerms
            ref={ref}
            shareId={null}
            filter={{ search }}
            editable={editable}
            relation={relation}
            relatedTerms={relatedTerms}
          />
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
