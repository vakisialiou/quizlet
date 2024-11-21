'use client'

import { ClientSimulatorData } from '@entities/ClientSimulator'
import { actionFetchSimulators } from '@store/index'
import { FoldersType } from '@store/initial-state'
import HeaderPage from '@containers/HeaderPage'
import { useEffect, useMemo } from 'react'
import {useSelector} from 'react-redux'
import SingleQueue from './SingleQueue'

export default function Simulator({ folderId }: { folderId: string }) {
  useEffect(() => actionFetchSimulators({ folderId }), [folderId])

  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)
  const folder = useMemo(() => {
    return folders.items.find(({ id }) => id === folderId)
  }, [folders.items, folderId])

  const simulators = useMemo(() => {
    return folder?.simulators || []
  }, [folder?.simulators])

  const simulator = useMemo(() => {
    return simulators.find(({ active }) => active)
  }, [simulators])

  const ready = folder && simulator

  return (
    <div
      className="flex flex-col px-2 md:px-4 gap-4"
    >
      <HeaderPage
        breadcrumbs={[
          {id: 1, name: 'Home', href: '/'},
          {id: 2, name: 'Folders', href: '/private'},
          {id: 3, name: folder?.name},
        ]}
      />

      {folders.process &&
        <div>Skeleton</div>
      }

      {!folders.process &&
        <>
          {!ready &&
            <div>
              Something went wrong while processing.
            </div>
          }

          {ready &&
            <SingleQueue
              folder={folder}
              simulator={simulator as ClientSimulatorData}
            />
          }
        </>
      }

    </div>
  )
}
