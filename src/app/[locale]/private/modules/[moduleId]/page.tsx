import Module from './Module'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params

  return (
    <Module
      editable={true}
      relation={{ moduleId }}
    />
  )
}
