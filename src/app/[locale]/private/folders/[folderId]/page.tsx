import Folder from './Folder'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ folderId: string }> }) {
  const { folderId } = await params

  return (
    <Folder
      editable={true}
      relation={{ folderId }}
    />
  )
}
