import { filterFolderTerms } from '@containers/Simulator/helpers'
import { ClientFolderData } from '@entities/ClientFolder'
import CardEmpty from '@containers/Simulator/CardEmpty'
import { actionStartSimulators } from '@store/index'
import Button from '@components/Button'

export default function SingleQueueDone({ folder }: { folder: ClientFolderData}) {
  return (
    <CardEmpty>
        <div className="flex flex-col justify-center text-center gap-2">
          <div className="text-gray-300 text-lg">
            Training completed!
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
    </CardEmpty>
  )
}
