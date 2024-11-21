import { filterFolderTerms } from '@containers/Simulator/helpers'
import { ClientFolderData } from '@entities/ClientFolder'
import CardEmpty from '@containers/Simulator/CardEmpty'
import { actionStartSimulators } from '@store/index'
import Button from '@components/Button'
import React from "react";

export default function SingleQueueStart({ process = false, folder }: { process?: boolean, folder?: ClientFolderData | null }) {
  return (
    <CardEmpty>
      {(process || !folder) &&
        <div className="animate-pulse flex w-full">
          <div className="flex flex-col w-full gap-8 items-center">
            <div className="h-3 bg-slate-700 w-1/3"></div>
            <div className="flex flex-col w-full gap-2 items-center">
              <div className="h-2 bg-slate-700 w-1/2"></div>
              <div className="h-2 bg-slate-700 w-44"></div>
            </div>
          </div>
        </div>
      }

      {(!process && folder) &&
        <div className="flex flex-col justify-center text-center gap-2">
          <div className="text-gray-300 text-lg">
            Time to learn!
          </div>

          <br/>

          <div className="text-gray-500 text-sm">
            Ready to get started?
          </div>

          <Button
            onClick={() => {
              const terms = filterFolderTerms(folder)
              if (terms.length > 0) {
                const termIds = terms.map(({id}) => id)
                actionStartSimulators({folderId: folder.id, termIds})
              }
            }}
          >
            Start
          </Button>
        </div>
      }
    </CardEmpty>
  )
}
