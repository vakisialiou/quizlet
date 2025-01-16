'use client'

import {
  actionUpdateFolder,
  actionCreateRelationFolder,
  actionCreateRelationTerm
} from '@store/index'
import React, { useMemo, useState, useRef, useEffect } from 'react'
import TermsDropdownMenu from '@containers/TermsDropdownMenu'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import Button, {ButtonVariant} from '@components/Button'
import { useFolderSelect } from '@hooks/useFolderSelect'
import SVGArrowDown from '@public/svg/downarrow_hlt.svg'
import { findTerms, getFolder } from '@helper/relation'
import RelationFolder from '@entities/RelationFolder'
import { useTermSelect } from '@hooks/useTermSelect'
import RelatedTerms from '@containers/RelatedTerms'
import ButtonSquare from '@components/ButtonSquare'
import { filterDeletedTerms } from '@helper/terms'
import SVGFileNew from '@public/svg/file_new.svg'
import RelationTerm from '@entities/RelationTerm'
import ContentPage from '@containers/ContentPage'
import FolderCart from '@components/FolderCart'
import FormFolder from '@containers/FormFolder'
import Dropdown from '@components/Dropdown'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import SVGPlay from '@public/svg/play.svg'
import {useRouter} from '@i18n/routing'
import Folder from '@entities/Folder'
import clsx from 'clsx'

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
  }, [folder, folderId, editable, groupId])

  const { terms, relationTerms } = useTermSelect()

  const relatedTerms = useMemo(() => {
    return filterDeletedTerms(findTerms(relationTerms, terms, { folderId }))
  }, [relationTerms, terms, folderId])

  const [ search, setSearch ] = useState<string>('')

  const t = useTranslations('Folder')

  const ref = useRef<{ onCreate?: () => void }>({})
  const refDropdownTerms = useRef<{ close?: () => void }>({})

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
            icon={SVGBack}
            onClick={() => router.back()}
          />
        </>
      )}
      footer={(
        <div className="flex w-full justify-center text-center">
          <Button
            className="w-full max-w-96"
            variant={ButtonVariant.GREEN}
            disabled={relatedTerms.length === 0}
            onClick={() => {
              router.push(`/simulator?folderId=${folderId}`)
            }}
          >
            <SVGPlay
              width={28}
              height={28}
            />
            {t('btnPlay')}
          </Button>
        </div>
      )}
    >
      {folder &&
        <div className="flex flex-col gap-2">
          <FormFolder
            folder={folder}
            editable={editable}
          />

          <FolderCart
            hover={false}
            title={t('termsTitle')}
            dropdown={{
              hidden: true
            }}
            controls={(
              <>
                <Dropdown
                  caret
                  ref={refDropdownTerms}
                  className="px-1 min-w-8 h-8 items-center"
                  menu={(
                    <TermsDropdownMenu
                      excludeTerms={relatedTerms}
                      className="w-56"
                      onCreate={() => {
                        if (refDropdownTerms.current.close) {
                          refDropdownTerms.current.close()
                        }

                        actionUpdateFolder({ editable, editId: null, folder: { ...folder, termsCollapsed: false } }, () => {
                          if (ref.current?.onCreate) {
                            ref.current?.onCreate()
                          }
                        })
                      }}
                      onClick={(term) => {
                        actionUpdateFolder({ editable, editId: null, folder: { ...folder, termsCollapsed: false } }, () => {
                          const relationTerm = new RelationTerm()
                            .setFolderId(folderId)
                            .setTermId(term.id)
                            .serialize()

                          actionCreateRelationTerm({ relationTerm, editable })
                        })
                      }}
                    />
                  )}
                >
                  <SVGFileNew
                    width={18}
                    height={18}
                  />
                </Dropdown>

                <ButtonSquare
                  size={24}
                  icon={SVGArrowDown}
                  onClick={() => {
                    actionUpdateFolder({
                      editable,
                      editId: null,
                      folder: { ...folder, termsCollapsed: !folder.termsCollapsed }
                    })
                  }}
                  classNameIcon={clsx('', {
                    ['rotate-180']: !folder.termsCollapsed
                  })}
                />
              </>
            )}
          >
            {!folder.termsCollapsed &&
              <>
                {editable && relatedTerms.length === 0 &&
                  <div className="italic text-xs text-center text-white/50">
                    {t('noCardsHelper')}
                  </div>
                }

                <RelatedTerms
                  ref={ref}
                  shareId={null}
                  filter={{search}}
                  editable={editable}
                  relation={{ folderId }}
                  relatedTerms={relatedTerms}
                />
              </>
            }
          </FolderCart>
        </div>
      }
    </ContentPage>
  )
}
