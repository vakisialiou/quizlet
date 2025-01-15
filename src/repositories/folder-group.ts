import { RelationFolderSelectType, RelationFolderSelect, createRelationFolderSelect } from '@repositories/relation-folder'
import FolderGroup, { FolderGroupData } from '@entities/FolderGroup'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type FolderGroupSelectType = {
  id: boolean,
  name: boolean,
  userId: boolean,
  moduleId: boolean,
  createdAt: boolean,
  updatedAt: boolean,
  relationFolders: {
    select: RelationFolderSelectType
  },
}

export const FolderGroupSelect = {
  id: true,
  name: true,
  userId: true,
  moduleId: true,
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
  return new FolderGroup()
    .setId(data.id)
    .setName(data.name)
    .setModuleId(data.moduleId)
    .setUpdatedAt(data.updatedAt)
    .setRelationFolders(
      data.relationFolders.map((item) => createRelationFolderSelect(item))
    )
}

export const upsertFolderGroup = async (db: PrismaEntry, userId: string, item: FolderGroupData): Promise<string | null> => {
  const res = await db.folderGroup.upsert({
    where: { id: item.id },
    update: {
      name: item.name,
      updatedAt: new Date(),
    },
    create: {
      userId,
      id: item.id,
      name: item.name,
      moduleId: item.moduleId,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  return res.id
}

export async function removeFolderGroupById(db: PrismaEntry, userId: string, id: string): Promise<string | null> {
  const res = await db.folderGroup.delete({ where: { userId, id } })
  return res.id || null
}

export async function findFolderGroupsByUserId(db: PrismaEntry, userId: string) {
  const res = await db.folderGroup.findMany({
    where: { userId },
    select: { ...FolderGroupSelect },
  })

  return res.map(item => createFolderGroupSelect(item).serialize())
}
