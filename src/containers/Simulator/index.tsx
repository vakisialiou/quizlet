'use client'

import { DataStateSimulatorsType, useSimulatorActions } from '@store/reducers/simulators'
import { DataStateFoldersType } from '@store/reducers/folders'
import { DataStateTermsType } from '@store/reducers/terms'
import { useSelector } from 'react-redux'

export default function Simulator({ folderUUID }: { folderUUID: string }) {
  const actions = useSimulatorActions()

  const simulators = useSelector(({ simulators }: { simulators: DataStateSimulatorsType }) => simulators)
  const folders = useSelector(({ folders }: { folders: DataStateFoldersType }) => folders)
  const terms = useSelector(({ terms }: { terms: DataStateTermsType }) => terms[folderUUID])

  console.log({ simulators, folders, terms })

  return (
    <div
      onClick={() => {
        console.log('+++')
      }}
    >
      Simulator: {folderUUID}
    </div>
  )
}
