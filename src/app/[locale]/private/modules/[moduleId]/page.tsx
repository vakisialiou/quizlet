import ClientPageModule from './ClientPageModule'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params

  return (
    <ClientPageModule
      editable={true}
      moduleId={moduleId}
    />
  )
}
