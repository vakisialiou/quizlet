import RelationFolder, { RelationFolderData } from '@entities/RelationFolder'
import RelationTerm, { RelationTermData } from '@entities/RelationTerm'
import { FolderGroupData } from '@entities/FolderGroup'
import Folder, { FolderData } from '@entities/Folder'
import { splitTermsToChunks } from '@helper/terms'
import { TermData } from '@entities/Term'

export type MultiFolders = {
  folders: FolderData[],
  relationTerms: RelationTermData[],
  relationFolders: RelationFolderData[]
}

export function createMultiFolders(group: FolderGroupData, terms: TermData[], size: number): MultiFolders {
  const res = {
    folders: [],
    relationTerms: [],
    relationFolders: []
  } as MultiFolders

  let i = 0
  const chunks = splitTermsToChunks(terms, size)
  for (const terms of chunks) {
    i++

    const folder = new Folder()
    res.folders.push(folder.serialize())

    const relationFolder = new RelationFolder()
      .setGroupId(group.id)
      .setFolderId(folder.id)
      .setOrder(i++)
      .serialize()

    res.relationFolders.push(relationFolder)

    for (const term of terms) {
      const relationTerm = new RelationTerm()
        .setFolderId(folder.id)
        .setTermId(term.id)
        .setOrder(i++)
        .serialize()
      res.relationTerms.push(relationTerm)
    }
  }
  return res
}
