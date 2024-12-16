import ClientRelationFolder, { ClientRelationFolderData } from '@entities/ClientRelationFolder'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type RelationFolderSelectType = {
  id: boolean,
  folderId: boolean,
  folderGroupId: boolean,
  createdAt: boolean,
}

export const RelationFolderSelect = {
  id: true,
  folderId: true,
  folderGroupId: true,
  createdAt: true,
} as RelationFolderSelectType

type RelationFolderResult = Prisma.RelationFolderGetPayload<{
  select: typeof RelationFolderSelect
}>

export const createRelationFolderSelect = (data: RelationFolderResult) => {
  return new ClientRelationFolder()
    .setId(data.id)
    .setFolderId(data.folderId)
    .setFolderGroupId(data.folderGroupId)
    .setCreatedAt(data.createdAt)
}

export const createManyRelationFolders = async (db: PrismaEntry, items: ClientRelationFolderData[]): Promise<number> => {
  const createdAt = new Date()

  const res = await db.relationFolder.createMany({
    data: items.map((item) => {
      return {
        id: item.id,
        folderId: item.folderId,
        folderGroupId: item.folderGroupId,
        createdAt,
      }
    })
  })

  return res.count
}
