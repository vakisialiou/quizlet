import ClientFolderShare, { ClientFolderShareData, ClientFolderShareEnum } from '@entities/ClientFolderShare'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type FolderShareSelectType = {
  id: boolean
  ownerUserId: boolean
  folderId: boolean
  access: boolean
  createdAt: boolean
  updatedAt: boolean
}

export const FolderShareSelect = {
  id: true,
  ownerUserId: true,
  folderId: true,
  access: true,
  createdAt: true,
  updatedAt: true,
} as FolderShareSelectType

type FolderShareResult = Prisma.FolderShareGetPayload<{
  select: typeof FolderShareSelect
}>

export const createFolderShareSelect = (data: FolderShareResult) => {
  return new ClientFolderShare(data.ownerUserId, data.folderId)
    .setId(data.id)
    .setAccess(data.access as ClientFolderShareEnum)
    .setCreatedAt(data.createdAt)
    .setUpdatedAt(data.updatedAt)
}

export const getFolderShareById = async (db: PrismaEntry, id: string): Promise<ClientFolderShareData | null> => {
  const folder = await db.folderShare.findUnique({
    where: { id },
    select: { ...FolderShareSelect },
  })

  if (folder) {
    return createFolderShareSelect(folder).serialize()
  }

  return null
}

export const upsertFolderShare = async (db: PrismaEntry, item: ClientFolderShareData): Promise<string | null> => {
  const res = await db.folderShare.upsert({
    where: {
      folderId_access: {
        folderId: item.folderId,
        access: item.access
      },
    },
    update: {
      updatedAt: new Date(),
    },
    create: {
      id: item.id,
      access: item.access,
      folderId: item.folderId,
      ownerUserId: item.ownerUserId,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  return res.id
}
