import Simulator from '@containers/Simulator'

export default async function Page({ params }: { params: { uuid: string } }) {
  return (
    <div>
      <Simulator folderUUID={params.uuid} />
    </div>
  )
}
