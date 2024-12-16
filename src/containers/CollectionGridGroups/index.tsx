'use client'

import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import AchievementIcon, {AchievementsSize} from '@containers/AchievementIcon'
import Button, { ButtonSize, ButtonSkin } from '@components/Button'
import MetaLabel, { MetaLabelVariant } from '@components/MetaLabel'
import AchievementDegree from '@containers/AchievementDegree'
import { ClientFolderData } from '@entities/ClientFolder'
import { Fragment, useCallback, useMemo } from 'react'
import SVGRefresh from '@public/svg/file_refresh.svg'
import SVGAssets from '@public/svg/asset_manager.svg'
import { FoldersType } from '@store/initial-state'
import FolderCart from '@components/FolderCart'
import SVGTrash from '@public/svg/trash.svg'
import { useTranslations } from 'next-intl'
import SVGPlay from '@public/svg/play.svg'
import { useSelector } from 'react-redux'

enum DropDownIdEnums {
  REMOVE_FOLDER = 'REMOVE_FOLDER',
  STUDY = 'STUDY',
}

export default function Collections(
  {
    folder,
    onPlay,
    onRemove,
    onGenerate,
  }:
  {
    folder: ClientFolderData
    onPlay?: (folder: ClientFolderData) => void
    onRemove?: (folder: ClientFolderData) => void,
    onGenerate?: (folder: ClientFolderData) => void
  }
) {
  const t = useTranslations('Folders')

  const dropdownChildrenItems = [
    {id: DropDownIdEnums.STUDY, name: t('dropDownEditGroup'), icon: SVGPlay },
    {id: '1', divider: true },
    {id: DropDownIdEnums.REMOVE_FOLDER, name: t('dropDownRemoveGroup'), icon: SVGTrash },
  ]

  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const relatedItems = useMemo(() => {
    const res = {} as { [key: string]: ClientFolderData }

    const rawItems = [...folders.items || []]
    for (const item of rawItems) {
      if (!item.isModule) {
        res[item.id] = item
      }
    }

    return res
  }, [folders.items])

  const getSimulatorsInfo = useCallback((simulators: ClientSimulatorData[]): { hasActive: boolean, countDone: number } => {
    let countDone = 0
    let hasActive = false
    for (const {active, status} of simulators) {
      if (active) {
        hasActive = true
      }
      if (!active && status === SimulatorStatus.DONE) {
        countDone++
      }
    }
    return { countDone, hasActive }
  }, [])

  const folderGroups = [...folder.folderGroups].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  return (
    <div className="flex flex-col gap-2">
      {(folder.terms.length === 0) &&
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-white/50 text-sm italic text-center">
            {t('warnGridGroup1')}
          </div>
        </div>
      }

      {(folder.terms.length > 0 && folderGroups.length === 0) &&
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <div className="text-white/50 text-sm italic text-center">
            {t('warnGridGroup2')}
          </div>

          <Button
            className="px-4 gap-2"
            size={ButtonSize.H10}
            skin={ButtonSkin.GREEN}
            onClick={() => {
              if (onGenerate) {
                onGenerate(folder)
              }
            }}
          >
            <SVGRefresh
              width={18}
              height={18}
              className="text-white"
            />

            {t('warnGridGroup2Button')}
          </Button>
        </div>
      }

      {folderGroups.map((group, gIndex) => {
        return (
          <Fragment
            key={gIndex}
          >
            <div className="flex items-center justify-between w-full p-2">
              <span className="text-white/55 font-bold text-xs">
                {group.name}
              </span>
            </div>
            <div
              className="gap-2 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">

              {group.relationFolders.map((relation, index) => {
                const childFolder = relatedItems[relation.folderId] as ClientFolderData
                if (!childFolder) {
                  return
                }

                const { hasActive, countDone } = getSimulatorsInfo(childFolder.simulators)
                return (
                  <FolderCart
                    key={index}
                    hover={true}
                    process={false}
                    dropdown={{
                      items: dropdownChildrenItems,
                      onSelect: (id) => {
                        switch (id) {
                          case DropDownIdEnums.STUDY:
                            if (onPlay) {
                              onPlay(childFolder)
                            }
                            break
                          case DropDownIdEnums.REMOVE_FOLDER:
                            if (onRemove) {
                              onRemove(childFolder)
                            }
                            break
                        }
                      }
                    }}
                    title={(
                      <div className="flex gap-2 items-center font-bold">
                        <SVGAssets
                          width={16}
                          height={16}
                        />
                        <span>#{index + 1}</span>
                      </div>
                    )}
                    labels={(
                      <>
                        {hasActive &&
                          <MetaLabel
                            variant={MetaLabelVariant.amber}
                          >
                            {t('groupLabelActive')}
                          </MetaLabel>
                        }
                        <MetaLabel
                          variant={MetaLabelVariant.gray}
                        >
                          {t('groupLabelDone', {count: countDone})}
                        </MetaLabel>
                        <MetaLabel>
                          {t('groupLabelTerms', { count: childFolder.relationTerms.length })}
                        </MetaLabel>
                      </>
                    )}
                    onClickBody={() => {
                      if (onPlay) {
                        onPlay(childFolder)
                      }
                    }}
                  >
                    <div
                      className="flex gap-2 items-center justify-between w-full p-2">
                      <div className="flex items-center gap-4">
                        <AchievementIcon
                          folder={childFolder}
                          size={AchievementsSize.sm}
                        />
                        <AchievementDegree
                          hideDegree
                          folder={childFolder}
                          className="text-sm font-bold uppercase text-white/50"
                        />
                      </div>
                      <div className="flex gap-2 items-center text-base text-white/50">
                        <SVGPlay
                          width={18}
                          height={18}
                        />
                        {t('groupButtonStartStudy')}
                      </div>
                    </div>
                  </FolderCart>
                )
              })}
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
