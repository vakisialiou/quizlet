import ClientPageFolder from './ClientPageFolder'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ groupId: string, folderId: string }> }) {
  const { groupId, folderId } = await params

  return (
    <ClientPageFolder
      editable={true}
      groupId={groupId}
      folderId={folderId}
    />
  )
}
