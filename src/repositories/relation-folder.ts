import RelationFolder, { RelationFolderData } from '@entities/RelationFolder'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type RelationFolderSelectType = {
  id: boolean
  order: boolean
  groupId: boolean
  folderId: boolean
  createdAt: boolean
}

export const RelationFolderSelect = {
  id: true,
  order: true,
  groupId: true,
  folderId: true,
  createdAt: true
} as RelationFolderSelectType

type RelationFolderResult = Prisma.RelationFolderGetPayload<{
  select: typeof RelationFolderSelect
}>

export const createRelationFolderSelect = (data: RelationFolderResult) => {
  return new RelationFolder()
    .setId(data.id)
    .setOrder(data.order)
    .setGroupId(data.groupId)
    .setFolderId(data.folderId)
    .setCreatedAt(data.createdAt)
}

export const createManyRelationFolders = async (db: PrismaEntry, userId: string, items: RelationFolderData[]): Promise<number> => {
  const res = await db.relationFolder.createMany({
    data: items.map((item) => {
      return {
        userId,
        id: item.id,
        order: item.order,
        groupId: item.groupId,
        folderId: item.folderId,
        createdAt: new Date(),
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
      order: relation.order,
      groupId: relation.groupId,
      folderId: relation.folderId,
      createdAt: new Date(),
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
