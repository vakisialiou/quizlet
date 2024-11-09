import ServerFolder, { ServerFolderType } from '@entities/ServerFolder'
import ClientFolder from '@entities/ClientFolder'
import { prisma } from '@lib/prisma'

export const findFoldersByUserId = async (userId: number): Promise<ClientFolder[]> => {
  const res = await prisma.folder.findMany({
    where: { userId },
    select: {
      uuid: true,
      name: true,
    },
  })

  return res.map(item => {
    return new ClientFolder()
      .setUUID(item.uuid)
      .setName(item.name)
  })
}

export const getFolderByUUID = async (userId: number, uuid: string): Promise<ServerFolder | null> => {
  const res = await prisma.folder.findUnique({
    where: { userId, uuid },
    select: {
      id: true,
      userId: true,
      uuid: true,
      name: true,
      createdAt: true,
      updatedAt: true
    },
  })

  if (res) {
    return new ServerFolder()
      .setId(res.id)
      .setUUID(res.uuid)
      .setName(res.name)
      .setUserId(res.userId)
      .setCreatedAt(res.createdAt)
      .setUpdatedAt(res.updatedAt)
  }

  return null
}

export const upsertFolder = async (folder: ServerFolder): Promise<number | null> => {
  const res = await prisma.folder.upsert({
    where: { uuid: folder.uuid },
    update: {
      name: folder.name,
      updatedAt: folder.updatedAt,
    },
    create: {
      uuid: folder.uuid,
      name: folder.name,
      userId: folder.userId,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt
    },
  })

  return res.id
}

export const removeFolder = async (uuid: string): Promise<boolean> => {
  const res = await prisma.folder.delete({ where: { uuid } })
  return !!res?.id
}
