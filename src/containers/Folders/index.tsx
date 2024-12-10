'use client'

import AchievementIcon, { AchievementsSize } from '@containers/AchievementIcon'
import ClientFolder, { ClientFolderData } from '@entities/ClientFolder'
import Achievement, { AchievementData } from '@entities/Achievement'
import MetaLabel, { MetaLabelVariant } from '@components/MetaLabel'
import { filterFolderTerms } from '@containers/Simulator/helpers'
import AchievementDegree from '@containers/AchievementDegree'
import { SimulatorStatus } from '@entities/ClientSimulator'
import Button, { ButtonSkin } from '@components/Button'
import SVGFolderNew from '@public/svg/new_folder.svg'
import { useEffect, useMemo, useState } from 'react'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import { FoldersType } from '@store/initial-state'
import ContentPage from '@containers/ContentPage'
import { useTranslations } from 'next-intl'
import { upsertObject } from '@lib/array'
import { useSelector } from 'react-redux'
import Dialog from '@components/Dialog'
import Search from '@components/Search'
import Folder from '@containers/Folder'
import {
  actionUpdateFolderItem,
  actionDeleteFolder,
  actionFetchFolders,
  actionUpdateFolder,
  actionSaveFolder,
} from '@store/index'

export default function Folders() {
  useEffect(actionFetchFolders, [])

  const [ originItem, setOriginItem ] = useState<ClientFolderData | null>(null)
  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const [showUserHelp, setShowUserHelp] = useState(false)

  const [search, setSearch] = useState<string | null>(null)

  const items = useMemo(() => {
    let rawItems = [...folders.items || []]
    if (search) {
      rawItems = rawItems.filter(({ name }) => `${name}`.toLocaleLowerCase().includes(search))
    }
    return rawItems.sort((a, b) => {
      if (a.order === b.order) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return a.order - b.order
    })
  }, [folders.items, search])

  const [removeFolder, setRemoveFolder] = useState<ClientFolderData | null>(null)

  const achievements = useMemo(() => {
    const res = {} as Partial<{[id: string]: AchievementData}>
    for (const folder of items) {
      res[folder.id] = new Achievement().calculate(folder?.simulators || [])
    }
    return res
  }, [items])

  const t = useTranslations('Folders')

  return (
    <ContentPage
      showHeader
      showFooter
      title={t('headTitle')}
      footer={(
        <div className="flex w-full justify-center lg:justify-end">
          <Button
            skin={ButtonSkin.WHITE}
            className="w-full lg:w-auto px-8 gap-1"
            onClick={() => {
              const folder = new ClientFolder().serialize()
              actionSaveFolder({folder, editId: folder.id})
            }}
          >
            <SVGFolderNew
              width={28}
              height={28}
              className="text-gray-700"
            />

            {t('footButtonCreateFolder')}
          </Button>
        </div>
      )}
      rightControls={(
        <ButtonSquare
          icon={SVGQuestion}
          disabled={showUserHelp}
          onClick={() => setShowUserHelp(true)}
        />
      )}
    >
      <Search
        rounded
        bordered
        value={search || ''}
        className="px-2 pt-2 md:px-4 md:pt-4"
        placeholder={t('searchPlaceholder')}
        onClear={() => setSearch(null)}
        onChange={(e) => {
          setSearch(e.target.value ? `${e.target.value}`.toLocaleLowerCase() : null)
        }}
      />

      <div
        className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 p-2 md:p-4">
        {items.map((folder, index) => {
          let doneSimulators = 0
          let hasActiveSimulator = false
          for (const {active, status} of folder.simulators) {
            if (active) {
              hasActiveSimulator = true
            }
            if (!active && status === SimulatorStatus.DONE) {
              doneSimulators++
            }
          }

          const playTerms = filterFolderTerms(folder)

          return (
            <Folder
              data={folder}
              key={folder.id}
              number={index + 1}
              edit={folder.id === folders.editId}
              hrefEdit={`/private/folder/${folder.id}`}
              hrefPlay={`/private/simulator/${folder.id}`}
              disablePlay={playTerms.length === 0}
              process={folders.processIds.includes(folder.id)}
              dropdownItems={[
                {id: 1, name: t('dropDownEdit')},
                {id: 2, name: t('dropDownRemove'), disabled: (folder.terms.length || 0) > 0},
              ]}
              onDropdownSelect={(id) => {
                switch (id) {
                  case 1:
                    actionUpdateFolder({editId: folder.id}, () => setOriginItem(folder))
                    break
                  case 2:
                    setRemoveFolder(folder)
                    break
                }
              }}
              onSave={() => {
                actionSaveFolder({folder, editId: null}, () => {
                  setOriginItem(null)
                })
              }}
              onExit={() => {
                actionUpdateFolder({
                  editId: null,
                  items: upsertObject([...items], originItem as ClientFolderData)
                }, () => setOriginItem(null))
              }}
              onChange={(prop, value) => {
                actionUpdateFolderItem({...folder, [prop]: value})
              }}
              achievements={(
                <div
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <AchievementIcon
                    className="text-[10px]"
                    size={AchievementsSize.sm}
                    achievementData={achievements[folder.id] as AchievementData}
                  />

                  <AchievementDegree
                    achievementData={achievements[folder.id] as AchievementData}
                    className="ml-2 uppercase font-bold text-gray-700 text-sm"
                  />
                </div>
              )}
              labels={(
                <>
                  {hasActiveSimulator &&
                    <MetaLabel variant={MetaLabelVariant.green}>Playing</MetaLabel>
                  }

                  {(!hasActiveSimulator && doneSimulators > 0) &&
                    <MetaLabel>Attempts {doneSimulators}</MetaLabel>
                  }

                  <MetaLabel>{`Terms ${folder.terms.length || 0}`}</MetaLabel>
                </>
              )}
            />
          )
        })}
      </div>

      {showUserHelp &&
        <Dialog
          title={t('userHelpTitle')}
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

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection4Title')}</div>
                {t('userHelpSection4Text')}
              </div>
            </div>
          )}
        >
          <Button
            className="min-w-28 px-4"
            skin={ButtonSkin.GRAY}
            onClick={() => {
              setShowUserHelp(false)
            }}
          >
            {t('userHelpButtonClose')}
          </Button>
        </Dialog>
      }

      {removeFolder &&
        <Dialog
          title={removeFolder.name || t('removeDialogTitle')}
          text={t('removeDialogText')}
        >
          <Button
            className="min-w-28 px-4"
            skin={ButtonSkin.GRAY}
            onClick={() => {
              actionDeleteFolder(removeFolder, () => {
                setRemoveFolder(null)
                if (originItem && originItem.id === removeFolder.id) {
                  setOriginItem(null)
                }
              })
            }}
          >
            {t('removeDialogButtonApprove')}
          </Button>

          <Button
            className="min-w-28 px-4"
            skin={ButtonSkin.WHITE}
            onClick={() => setRemoveFolder(null)}
          >
            {t('removeDialogButtonCancel')}
          </Button>
        </Dialog>
      }
    </ContentPage>
  )
}
