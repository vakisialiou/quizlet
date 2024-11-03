'use client'

import { DataStateSimulatorsType, useSimulatorActions } from '@store/reducers/simulators'
import { filterActiveTerm, filterTerms } from '@containers/Simulator/filter'
import { DataStateFoldersType } from '@store/reducers/folders'
import { DataStateTermsType } from '@store/reducers/terms'
import SVGRightArrow from '@public/svg/rightarrow.svg'
import SVGLoopBack from '@public/svg/loop_back.svg'
import { useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react'
import Button from '@components/Button'
import Card from '@components/Card'
import Link from 'next/link'

export default function Simulator({ folderUUID }: { folderUUID: string }) {
  const actions = useSimulatorActions()

  const simulators = useSelector(({ simulators }: { simulators: DataStateSimulatorsType }) => simulators)
  const folders = useSelector(({ folders }: { folders: DataStateFoldersType }) => folders)
  const terms = useSelector(({ terms }: { terms: DataStateTermsType }) => terms[folderUUID])
console.log(simulators)
  const folder = useMemo(() => {
    return folders.items.find(({ uuid }) => uuid === folderUUID)
  }, [folders, folderUUID])

  const { activeTerm, termItems } = useMemo(() => {
    const termItems = filterTerms(terms?.items || [], simulators[folderUUID])
    return {
      termItems,
      activeTerm: termItems.find((item) => {
        return item.uuid === simulators[folderUUID]?.termUUID
      }) || termItems[0] || null
    }
  }, [folders, simulators])

  // useEffect(() => {
  //   if (simulators[folderUUID] === undefined && termItems.length > 0) {
  //     actions.updateSimulator({
  //       folderUUID,
  //       termUUID: termItems[0]['uuid'],
  //     })
  //   }
  // }, [folderUUID])

  const isProcess = folderUUID in simulators && !!simulators[folderUUID].termUUID

  return (
    <div
      className="flex flex-col px-4 gap-2"
      onClick={() => {
        console.log('+++')
      }}
    >
      <div className="flex items-center text-gray-400 font-semibold gap-1">
        <Link href="/" className="text-gray-400 hover:text-gray-500">
          Folders
        </Link>

        <SVGRightArrow
          width={24}
          height={24}
          className="text-gray-600"
        />

        <span className="text-gray-600">{folder?.name}</span>
      </div>

      {!isProcess &&
        <>
          {termItems.length > 0 &&
            <div>
              Are you ready?

              <Button
                onClick={() => {
                  actions.updateSimulator({ folderUUID, termUUID: termItems[0]['uuid'] })
                }}
              >
                Start learn
              </Button>
            </div>
          }

          {termItems.length === 0 &&
            <div>You have no any terms yet.</div>
          }
        </>
      }

      {isProcess &&
        <div className="flex justify-center w-full py-20">
          <div className="flex flex-col">
            <Card
              answer={activeTerm?.answer}
              question={activeTerm?.question}
            />

            <div className="flex gap-2 justify-between grid grid-cols-2 py-6">
              <div>
                <Button
                  className="flex items-center justify-center"
                  onClick={() => {
                    const items = filterActiveTerm(termItems, simulators[folderUUID])
                    actions.remember({ folderUUID, termUUID: items[0]?.uuid || null })
                  }}
                >
                  Remembered
                </Button>
              </div>
              <div>
                <Button
                  className="flex items-center justify-center"
                  onClick={() => {
                    const items = filterActiveTerm(termItems, simulators[folderUUID])
                    actions.continue({ folderUUID, termUUID: items[0]?.uuid || null })
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>

          <div
            className="absolute flex items-center justify-center rounded-full bg-gray-900 hover:bg-gray-800 cursor-pointer w-8 h-8 left-2"
          >
            <SVGLoopBack
              width={24}
              height={24}
              className="text-gray-600"
            />
          </div>

          <div
            className="absolute flex items-center justify-center rounded-full border border-gray-600 text-gray-600 w-12 h-12 right-2"
          >
            {terms?.items.length || 0}
          </div>
        </div>
      }

    </div>
  )
}
