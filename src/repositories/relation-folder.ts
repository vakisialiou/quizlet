import RelationFolder, { RelationFolderData } from '@entities/RelationFolder'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type RelationFolderSelectType = {
  id: boolean
  groupId: boolean
  folderId: boolean
}

export const RelationFolderSelect = {
  id: true,
  groupId: true,
  folderId: true,
} as RelationFolderSelectType

type RelationFolderResult = Prisma.RelationFolderGetPayload<{
  select: typeof RelationFolderSelect
}>

export const createRelationFolderSelect = (data: RelationFolderResult) => {
  return new RelationFolder()
    .setId(data.id)
    .setGroupId(data.groupId)
    .setFolderId(data.folderId)
}

export const createManyRelationFolders = async (db: PrismaEntry, userId: string, items: RelationFolderData[]): Promise<number> => {
  const res = await db.relationFolder.createMany({
    data: items.map((item) => {
      return {
        userId,
        id: item.id,
        groupId: item.groupId,
        folderId: item.folderId,
      }
    })
  })

  return res.count
}

export const createRelationFolder = async (db: PrismaEntry, userId: string, relation: RelationFolderData): Promise<string> => {
  const res = await db.relationFolder.create({
    data: {
      userId,
      id: relation.id,
      groupId: relation.groupId,
      folderId: relation.folderId,
    }
  })

  return res.id
}

export const removeRelationFolder = async (db: PrismaEntry, userId: string, id: string): Promise<string> => {
  const res = await db.relationFolder.delete({
    where: { userId, id }
  })

  return res.id
}

export const removeRelationFoldersByGroupId = async (db: PrismaEntry, userId: string, groupId: string): Promise<number> => {
  const res = await db.relationFolder.deleteMany({
    where: { userId, groupId }
  })

  return res.count
}

export async function getRelationFolder(db: PrismaEntry, groupId: string, folderId: string): Promise<RelationFolderData | null> {
  const res = await db.relationFolder.findFirst({
    where: { groupId, folderId },
    select: { ...RelationFolderSelect },
  })

  return res ? createRelationFolderSelect(res).serialize() : null
}

export async function findRelationFoldersByUserId(db: PrismaEntry, userId: string): Promise<RelationFolderData[]> {
  const res = await db.relationFolder.findMany({
    where: { userId },
    select: { ...RelationFolderSelect },
  })

  return res.map(item => createRelationFolderSelect(item).serialize())
}
