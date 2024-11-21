import Simulator from '@containers/Simulator'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ folderId: string }> }) {
  const { folderId } = await params
  return (
    <Simulator folderId={folderId}/>
  )
}
