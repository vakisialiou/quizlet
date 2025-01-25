'use client'

import {
  actionUpdateFolder,
  actionCreateRelationFolder,
  actionCreateRelationTerm
} from '@store/action-main'
import { findTermsWithRelations, getFolder } from '@helper/relation'
import React, { useMemo, useState, useRef, useEffect } from 'react'
import { sortTermsWithRelations } from '@helper/sort-terms'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import Button, {ButtonVariant} from '@components/Button'
import { useMainSelector } from '@hooks/useMainSelector'
import SVGArrowDown from '@public/svg/downarrow_hlt.svg'
import {DropdownPlacement} from '@components/Dropdown'
import TermsDropdown from '@containers/TermsDropdown'
import RelationFolder from '@entities/RelationFolder'
import RelatedTerms from '@containers/RelatedTerms'
import ButtonSquare from '@components/ButtonSquare'
import RelationTerm from '@entities/RelationTerm'
import ContentPage from '@containers/ContentPage'
import FolderCart from '@components/FolderCart'
import { getGroupById } from '@helper/relation'
import FormFolder from '@containers/FormFolder'
import MetaLabel from '@components/MetaLabel'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import SVGPlay from '@public/svg/play.svg'
import {useRouter} from '@i18n/routing'
import Folder from '@entities/Folder'
import clsx from 'clsx'

export default function ClientPageFolder({ editable, groupId, folderId }: { editable: boolean, groupId: string, folderId: string }) {
  const router = useRouter()

  const folderGroups = useMainSelector(({ folderGroups }) => folderGroups)
  const group = useMemo(() => {
    return getGroupById(folderGroups, groupId)
  }, [folderGroups, groupId])

  const folders = useMainSelector(({ folders }) => folders)
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

  const terms = useMainSelector(({ terms }) => terms)
  const relationTerms = useMainSelector(({ relationTerms }) => relationTerms)

  const relatedTerms = useMemo(() => {
    return sortTermsWithRelations(findTermsWithRelations(relationTerms, terms, { folderId }))
  }, [relationTerms, terms, folderId])

  const excludeTermIds = useMemo(() => {
    return relatedTerms.map(({ term }) => term.id)
  }, [relatedTerms])

  const [ search, setSearch ] = useState<string>('')

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
            labels={<MetaLabel>{relatedTerms.length}</MetaLabel>}
            controls={(
              <>
                <TermsDropdown
                  excludeTermIds={excludeTermIds}
                  moduleId={group?.moduleId}
                  onCreate={() => {
                    actionUpdateFolder({ editable, editId: null, folder: { ...folder, termsCollapsed: false } }, () => {
                      if (ref.current?.onCreate) {
                        ref.current?.onCreate()
                      }
                    })
                  }}
                  onSelect={(term) => {
                    actionUpdateFolder({ editable, editId: null, folder: { ...folder, termsCollapsed: false } }, () => {
                      const relationTerm = new RelationTerm()
                        .setFolderId(folderId)
                        .setTermId(term.id)
                        .serialize()

                      actionCreateRelationTerm({ relationTerm, editable })
                    })
                  }}
                />

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
                  filter={{search}}
                  editable={editable}
                  relation={{ folderId }}
                  relatedTerms={relatedTerms}
                />

                <div className="flex w-full mt-2">
                  <TermsDropdown
                    moduleId={group?.moduleId}
                    excludeTermIds={excludeTermIds}
                    placement={DropdownPlacement.topStart}
                    onCreate={() => {
                      actionUpdateFolder({ editable, editId: null, folder: { ...folder, termsCollapsed: false } }, () => {
                        if (ref.current?.onCreate) {
                          ref.current?.onCreate()
                        }
                      })
                    }}
                    onSelect={(term) => {
                      actionUpdateFolder({ editable, editId: null, folder: { ...folder, termsCollapsed: false } }, () => {
                        const relationTerm = new RelationTerm()
                          .setFolderId(folderId)
                          .setTermId(term.id)
                          .serialize()

                        actionCreateRelationTerm({ relationTerm, editable })
                      })
                    }}
                  >
                    {t('btnAddCard')}
                  </TermsDropdown>
                </div>
              </>
            }
          </FolderCart>
        </div>
      }
    </ContentPage>
  )
}
