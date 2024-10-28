import Terms from '@containers/Terms'

export default async function Page({ params }: { params: { uuid: string } }) {
  return (
    <div>
      <Terms folderUUID={params.uuid} />
    </div>
  )
}
