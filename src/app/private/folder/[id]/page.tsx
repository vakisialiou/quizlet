import Terms from '@containers/Terms'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <Terms folderId={id} />
  )
}
