'use client'

import { ClientFolderShareData, ClientFolderShareEnum } from '@entities/ModuleShare'
import Button, { ButtonVariant } from '@components/Button'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import {ClientFolderData} from '@entities/Folder'
import SVGFileNew from '@public/svg/file_new.svg'
import ContentPage from '@containers/ContentPage'
import React, { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Grid from '@containers/Terms/Grid'
import { useSelector } from 'react-redux'

export default function Share() {
  const editTermId = useSelector(({ editTermId }: { editTermId: string | null }) => editTermId)
  const share = useSelector(({ share }: { share: ClientFolderShareData }) => share)
  const folders = useSelector(({ folders }: { folders: ClientFolderData[] }) => folders)

  const folder = folders.find(({ id }) => id === share.folderId)

  const [ search, setSearch ] = useState<string>('')

  const t = useTranslations('Terms')

  const ref = useRef<{ onCreate?: () => void }>({})
  const editable = share.access === ClientFolderShareEnum.editable

  return (
    <ContentPage
      showHeader
      showFooter={editable}
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
      footer={(
        <>
          <div className="flex w-full justify-center text-center">
            <div className="flex gap-2 w-full max-w-96">
              <Button
                variant={ButtonVariant.WHITE}
                className="w-full gap-1"
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
                {t('footButtonCreateTerm')}
              </Button>
            </div>
          </div>
        </>
      )}
    >
      {folder &&
        <Grid
          ref={ref}
          folder={folder}
          shareId={share.id}
          filter={{ search }}
          editable={editable}
          editTermId={editTermId}
        />
      }
    </ContentPage>
  )
}
