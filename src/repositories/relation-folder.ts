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

export async function findRelationFoldersByUserId(db: PrismaEntry, userId: string) {
  const res = await db.relationFolder.findMany({
    where: { userId },
    select: { ...RelationFolderSelect },
  })

  return res.map(item => createRelationFolderSelect(item).serialize())
}
