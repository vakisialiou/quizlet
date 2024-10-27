import { findFolders } from '@repositories/folders'
import Folders from '@containers/Folders'
import ReduxProvider from './provider'

export default async function Page() {
  const folders = await findFolders(1)

  return (
    <ReduxProvider preloadedState={{ folders: { items: folders, editUUID: null, processUUIDs: [] }}} >
      <div className="flex flex-col">
        <Folders />
      </div>
    </ReduxProvider>
  )
}
