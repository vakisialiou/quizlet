import Simulator from '@containers/Simulator'
import React from 'react'

export default async function Page(
  {
    params
  }:
  {
    params: Promise<{ moduleId: string }>
  }
) {
  const { moduleId } = (await params)

  return (
    <Simulator
      editable={true}
      relation={{ moduleId, folderId: null }}
    />
  )
}
