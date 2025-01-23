import {getModule, RelationProps, getFolder } from '@helper/relation'
import { useMainSelector } from '@hooks/useMainSelector'
import TitleModule from '@containers/TitleModule'
import TitleFolder from '@containers/TitleFolder'
import React, { useMemo } from 'react'

export default function TitleSimulator(
  {
    relation,
    className = '',
  }:
  {
    className?: string
    relation: RelationProps,
  }
) {
  const folders = useMainSelector(({folders}) => folders)
  const folder = useMemo(() => {
    return relation.folderId ? getFolder(folders, relation.folderId) : null
  }, [folders, relation.folderId])

  const modules = useMainSelector(({ modules }) => modules)
  const course = useMemo(() => {
    return relation.moduleId ? getModule(modules, relation.moduleId) : null
  }, [modules, relation.moduleId])

  if (relation.folderId) {
    return (
      <TitleFolder
        folder={folder}
        className={className}
      />
    )
  }

  return (
    <TitleModule
      module={course}
      className={className}
    />
  )
}
