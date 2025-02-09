'use client'

import {
  actionUpdateFolder,
  actionCreateRelationFolder,
  actionCreateRelationTerm,
} from '@store/action-main'
import React, {useMemo, useState, useRef, useEffect, useCallback} from 'react'
import { findTermsWithRelations, getFolder } from '@helper/relation'
import Button, {ButtonSize, ButtonVariant} from '@components/Button'
import FilterRelatedTerm from '@containers/FilterRelatedTerm'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import { useMainSelector } from '@hooks/useMainSelector'
import SVGArrowDown from '@public/svg/downarrow_hlt.svg'
import RelationFolder from '@entities/RelationFolder'
import { COLOR_DEFAULT } from '@components/ColorLabel'
import Folder, { FolderData } from '@entities/Folder'
import SVGFileSearch from '@public/svg/zoom_all.svg'
import RelatedTerms from '@containers/RelatedTerms'
import ButtonSquare from '@components/ButtonSquare'
import RelationTerm from '@entities/RelationTerm'
import ContentPage from '@containers/ContentPage'
import SVGFileNew from '@public/svg/file_new.svg'
import FolderCart from '@components/FolderCart'
import { getGroupById } from '@helper/relation'
import FormFolder from '@containers/FormFolder'
import MetaLabel from '@components/MetaLabel'
import TermsMenu from '@containers/TermsMenu'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import SVGPlay from '@public/svg/play.svg'
import { OrderEnum } from '@helper/sort'
import {useRouter} from '@i18n/routing'
import clsx from 'clsx'

export default function ClientPageFolder(
  {
    groupId,
    folderId,
    editable
  }:
  {
    groupId: string,
    folderId: string,
    editable: boolean,
  }
) {
  const router = useRouter()

  const folderGroups = useMainSelector(({ folderGroups }) => folderGroups)
  const group = useMemo(() => {
    return getGroupById(folderGroups, groupId)
  }, [folderGroups, groupId])

  const folders = useMainSelector(({ folders }) => folders)
  const folder = useMemo(() => {
    return getFolder(folders, folderId)
  }, [folders, folderId])

  const [searchTerm, setSearchTerm] = useState(false)

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

  const terms = useMainSelector(({ terms }) => terms)
  const relationTerms = useMainSelector(({ relationTerms }) => relationTerms)

  const relatedTerms = useMemo(() => {
    return findTermsWithRelations(relationTerms, terms, { folderId })
  }, [relationTerms, terms, folderId])

  const excludeTermIds = useMemo(() => {
    return relatedTerms.map(({ term }) => term.id)
  }, [relatedTerms])

  const [ search, setSearch ] = useState<string>('')

  const t = useTranslations('Folder')

  const ref = useRef<{ onCreate?: (color?: number) => void }>({})

  const onCreateTerm = useCallback((folderData: FolderData, callback?: () => void) => {
    const { color } = folderData.termSettings.filter

    if (folderData.termsCollapsed) {
      actionUpdateFolder({
        editable,
        editId: null,
        folder: {...folderData, termsCollapsed: false}
      }, () => {
        if (ref.current?.onCreate) {
          ref.current?.onCreate(color)
        }
        if (callback) {
          callback()
        }
      })
    } else {
      if (ref.current?.onCreate) {
        ref.current?.onCreate(color)
      }
      if (callback) {
        callback()
      }
    }
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
            className="gap-2 w-full max-w-96"
            variant={ButtonVariant.GREEN}
            disabled={relatedTerms.length === 0}
            onClick={() => {
              router.push(`/private/simulator/folder/${folderId}`)
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
        <>
          <div className="flex flex-col gap-2">
            <FormFolder
              folder={folder}
              editable={editable}
            />

            <FolderCart
              hover={false}
              title={t('termsTitle')}
              dropdown={{
                hidden: !folder,
                items: [
                  {id: 1, name: t('btnAddCard'), icon: SVGFileSearch},
                  {id: 2, name: t('btnCreateCard'), icon: SVGFileNew},
                ],
                onSelect: (id) => {
                  if (!folder) {
                    return
                  }
                  switch (id) {
                    case 1:
                      setSearchTerm(true)
                      break
                    case 2:
                      onCreateTerm(folder)
                      break
                  }
                }
              }}
              labels={<MetaLabel>{relatedTerms.length}</MetaLabel>}
              controls={(
                <>
                  <ButtonSquare
                    size={24}
                    icon={SVGArrowDown}
                    onClick={() => {
                      actionUpdateFolder({
                        editable,
                        editId: null,
                        folder: {...folder, termsCollapsed: !folder.termsCollapsed}
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
                  <FilterRelatedTerm
                    className="border-b pb-2 border-white/15"
                    selectedOrderId={folder.termSettings.order}
                    selectedFilterId={folder.termSettings.filter.color}
                    onFilterSelect={(color) => {
                      actionUpdateFolder({
                        editable,
                        editId: null,
                        folder: {
                          ...folder,
                          termSettings: {
                            ...folder.termSettings,
                            filter: {...folder.termSettings.filter, color: color as number}
                          }
                        }
                      })
                    }}
                    onOrderSelect={(order) => {
                      actionUpdateFolder({
                        editable,
                        editId: null,
                        folder: {
                          ...folder,
                          termSettings: {...folder.termSettings, order: order as OrderEnum}
                        }
                      })
                    }}
                  />

                  {editable && relatedTerms.length === 0 &&
                    <div className="italic text-xs text-center text-white/50">
                      {t('noCardsHelper')}
                    </div>
                  }

                  <RelatedTerms
                    ref={ref}
                    search={search}
                    editable={editable}
                    relation={{folderId}}
                    relatedTerms={relatedTerms}
                    order={folder.termSettings.order}
                    filter={folder.termSettings.filter}
                  />
                </>
              }

              <div
                className="flex w-full mt-2 gap-2 justify-between sm:justify-end items-center">
                <Button
                  size={ButtonSize.H08}
                  className="px-1 w-1/2 sm:w-auto sm:px-4 gap-1"
                  variant={ButtonVariant.WHITE}
                  onClick={() => setSearchTerm(true)}
                >
                  <SVGFileSearch
                    width={18}
                    height={18}
                  />

                  {t('btnAddCard')}
                </Button>

                <Button
                  size={ButtonSize.H08}
                  variant={ButtonVariant.WHITE}
                  onClick={() => onCreateTerm(folder)}
                  className="px-1 w-1/2 sm:w-auto sm:px-4 gap-1"
                >
                  <SVGFileNew
                    width={18}
                    height={18}
                  />

                  {t('btnCreateCard')}
                </Button>
              </div>
            </FolderCart>
          </div>

          {searchTerm &&
            <TermsMenu
              moduleId={group?.moduleId}
              excludeTermIds={excludeTermIds}
              onClose={() => setSearchTerm(false)}
              onCreate={() => {
                onCreateTerm(folder, () => {
                  setSearchTerm(false)
                })
              }}
              onClick={(term) => {
                const { color } = folder.termSettings.filter

                const relationTerm = new RelationTerm()
                  .setOrder(relatedTerms.length + 1)
                  .setColor(color === -1 ? COLOR_DEFAULT : color)
                  .setFolderId(folderId)
                  .setTermId(term.id)
                  .serialize()

                actionCreateRelationTerm({relationTerm, editable})
              }}
            />
          }
        </>
      }
    </ContentPage>
  )
}
