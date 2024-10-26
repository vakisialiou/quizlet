import { findFolders } from '@repositories/folders'
import Folders from '@containers/Folders'

export default async function Page() {
  const folders = await findFolders(1)
  return (
    <div className="flex flex-col">
      <Folders folders={folders}/>
    </div>
  )
}
