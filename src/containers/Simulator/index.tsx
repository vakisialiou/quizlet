'use client'

import { DataStateSimulatorsType, useSimulatorActions } from '@store/reducers/simulators'
import { DataStateFoldersType } from '@store/reducers/folders'
import { DataStateTermsType } from '@store/reducers/terms'
import SVGRightArrow from '@public/svg/rightarrow.svg'
import { useSelector } from 'react-redux'
import {useEffect, useMemo} from 'react'
import Button from '@components/Button'
import Card from '@components/Card'
import Link from 'next/link'

export default function Simulator({ folderUUID }: { folderUUID: string }) {
  const actions = useSimulatorActions()

  const simulators = useSelector(({ simulators }: { simulators: DataStateSimulatorsType }) => simulators)
  const folders = useSelector(({ folders }: { folders: DataStateFoldersType }) => folders)
  const terms = useSelector(({ terms }: { terms: DataStateTermsType }) => terms[folderUUID])

  const folder = useMemo(() => {
    return folders.items.find(({ uuid }) => uuid === folderUUID)
  }, [folders.items, folderUUID])

  useEffect(() => {
    if (simulators[folderUUID] === undefined && terms && terms.items.length > 0) {
      actions.updateSimulator({ folderUUID, termUUID: terms.items[0]['uuid'] })
    }
  }, [folderUUID])

  console.log({ simulators, folders, terms, d: simulators[folderUUID] })

  const term = (terms?.items || []).find((item) => {
    return item.uuid === simulators[folderUUID]?.termUUID
  }) || terms?.items[0] || null

  console.log({ term })

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

      <div className="flex justify-center w-full py-20">
        <div className="flex flex-col">
          <Card
            answer={term?.answer}
            question={term?.question}
          />

          <div className="flex gap-2 justify-between grid grid-cols-2 py-6">
            <div>
              <Button
                className="flex items-center justify-center"
                onClick={() => {

                }}
              >
                Remembered
              </Button>
            </div>
            <div>
              <Button
                className="flex items-center justify-center"
                onClick={() => {

                }}
              >
                Repeat
              </Button>
            </div>
          </div>
        </div>

        <div
          className="absolute flex items-center justify-center rounded-full border border-gray-600 text-gray-600 w-12 h-12 right-2"
        >
          {terms?.items.length || 0}
        </div>
      </div>

    </div>
  )
}
