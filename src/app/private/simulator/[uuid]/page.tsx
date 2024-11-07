import Simulator from '@containers/Simulator'

export default async function Page({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params
  return (
    <div>
      <Simulator folderUUID={uuid} />
    </div>
  )
}
