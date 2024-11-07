import Terms from '@containers/Terms'

export default async function Page({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params
  return (
    <div>
      <Terms folderUUID={uuid} />
    </div>
  )
}
