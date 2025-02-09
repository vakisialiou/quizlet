import { RelatedTermData, RelationTermData } from '@entities/RelationTerm'
import { RelationSimulatorData } from '@entities/RelationSimulator'
import { RelationFolderData } from '@entities/RelationFolder'
import { FolderGroupData } from '@entities/FolderGroup'
import { SimulatorData } from '@entities/Simulator'
import { ModuleData } from '@entities/Module'
import { FolderData } from '@entities/Folder'
import { TermData } from '@entities/Term'

export type RelationProps = {
  folderId?: string | null,
  moduleId?: string | null,
}

export function getModuleByFolderId(folderGroups: FolderGroupData[], relationFolders: RelationFolderData[], modules: ModuleData[], folderId: string): ModuleData | null {
  const group = getGroupByFolderId(folderGroups, relationFolders, folderId)
  return group ? getModule(modules, group.moduleId) : null
}

export function getGroupByFolderId(folderGroups: FolderGroupData[], relationFolders: RelationFolderData[], folderId: string): FolderGroupData | null {
  const relationFolder = relationFolders.find((item) => item.folderId === folderId)
  if (relationFolder) {
    return getGroupById(folderGroups, relationFolder.groupId)
  }
  return null
}

export function getGroupById(folderGroups: FolderGroupData[], groupId: string): FolderGroupData | null {
  return folderGroups.find(({ id }) => id === groupId) || null
}

export function findFolderGroups(folderGroups: FolderGroupData[], moduleId: string): FolderGroupData[] {
  return folderGroups.filter((item) => item.moduleId === moduleId)
}

export function findRelationFolders(relationFolders: RelationFolderData[], groupId: string): RelationFolderData[] {
  return relationFolders.filter((item) => item.groupId === groupId)
}

export function getRelationFolder(relationFolders: RelationFolderData[], groupId: string, folderId: string): RelationFolderData | null {
  return relationFolders.find((item) => item.groupId === groupId && item.folderId === folderId) || null
}

export function findGroupFolders(relationFolders: RelationFolderData[], folders: FolderData[], groupId: string): FolderData[] {
  const folderIds = findRelationFolders(relationFolders, groupId)
    .map((relation) => relation.folderId)

  return folders.filter((item) => folderIds.includes(item.id))
}

export function getModule(modules: ModuleData[], moduleId: string): ModuleData | null {
  return modules.find(({ id }) => id === moduleId) || null
}

export function getFolder(folders: FolderData[], folderId: string): FolderData | null {
  return folders.find(({ id }) => id === folderId) || null
}

export function findSimulators(relationSimulators: RelationSimulatorData[], simulators: SimulatorData[], relation: RelationProps): SimulatorData[] {
  const simulatorIds = relationSimulators
    .filter(({ folderId, moduleId }) => {
      return (relation.folderId && folderId === relation.folderId)
        || (relation.moduleId && moduleId === relation.moduleId)
    })
    .map((relation) => relation.simulatorId)

  return simulators.filter((simulator) => simulatorIds.includes(simulator.id))
}

export function findTerms(relationTerms: RelationTermData[], terms: TermData[], relation: RelationProps): TermData[] {
  const termIds = findRelationTerms(relationTerms, relation)
    .map((relation) => relation.termId)

  return terms.filter((term) => termIds.includes(term.id))
}

export function findTermsWithRelations(relationTerms: RelationTermData[], terms: TermData[], relation: RelationProps): RelatedTermData[] {
  const map = terms.reduce((map, term) => {
    map[term.id] = term
    return map
  }, {} as {[key: string]: TermData})

  return findRelationTerms(relationTerms, relation)
    .map((relation) => {
      const term = map[relation.termId] || null
      return { relation, term }
    })
    .filter(({ term }) => term)
}

export function findRelationTerm(relationTerms: RelationTermData[], relation: RelationProps, termId: string): RelationTermData | null {
  return findRelationTerms(relationTerms, relation)
    .find((relationTerm) => relationTerm.termId === termId) || null
}

export function findRelationTerms(relationTerms: RelationTermData[], relation: RelationProps): RelationTermData[] {
  return relationTerms
    .filter(({ folderId, moduleId }) => {
      return (relation.folderId && folderId === relation.folderId)
        || (relation.moduleId && moduleId === relation.moduleId)
    })
}
