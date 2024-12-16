import { RelationFolderSelectType, RelationFolderSelect, createRelationFolderSelect } from '@repositories/relation-folder'
import ClientFolderGroup, { ClientFolderGroupData } from '@entities/ClientFolderGroup'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type FolderGroupSelectType = {
  id: boolean,
  name: boolean,
  folderId: boolean,
  createdAt: boolean,
  updatedAt: boolean,
  relationFolders: {
    select: RelationFolderSelectType
  },
}

export const FolderGroupSelect = {
  id: true,
  name: true,
  folderId: true,
  createdAt: true,
  updatedAt: true,
  relationFolders: {
    select: { ...RelationFolderSelect }
  },
} as FolderGroupSelectType

type FolderGroupResult = Prisma.FolderGroupGetPayload<{
  select: typeof FolderGroupSelect
}>

export const createFolderGroupSelect = (data: FolderGroupResult) => {
  return new ClientFolderGroup()
    .setId(data.id)
    .setName(data.name)
    .setFolderId(data.folderId)
    .setCreatedAt(data.createdAt)
    .setUpdatedAt(data.updatedAt)
    .setRelationFolders(
      data.relationFolders.map((item) => createRelationFolderSelect(item))
    )
}

export const upsertFolderGroup = async (db: PrismaEntry, item: ClientFolderGroupData): Promise<string | null> => {
  const res = await db.folderGroup.upsert({
    where: { id: item.id },
    update: {
      name: item.name,
      folderId: item.folderId,
      updatedAt: new Date(),
    },
    create: {
      id: item.id,
      name: item.name,
      folderId: item.folderId,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  return res.id
}

export const removeFolderGroup = async (db: PrismaEntry, id: string): Promise<boolean> => {
  const res = await db.folderGroup.delete({ where: { id } })
  return !!res?.id
}

export const removeFolderGroups = async (db: PrismaEntry, ids: string[]): Promise<boolean> => {
  const res = await db.folderGroup.deleteMany({ where: { id: { in: ids } } })
  return res.count > 0
}
