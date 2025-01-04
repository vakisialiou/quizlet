import Folder, { FolderData, FolderMarkersEnum } from '@entities/Folder'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type FolderSelectType = {
  id: boolean,
  name: boolean,
  order: boolean,
  markers: boolean,
  collapsed: boolean,
  updatedAt: boolean,
  degreeRate: boolean,
}

export const FolderSelect = {
  id: true,
  name: true,
  order: true,
  markers: true,
  collapsed: true,
  updatedAt: true,
  degreeRate: true,
} as FolderSelectType

type FolderResult = Prisma.FolderGetPayload<{
  select: typeof FolderSelect
}>

export const createFolderSelect = (folder: FolderResult) => {
  const markers = Array.isArray(folder.markers) ? folder.markers as FolderMarkersEnum[] : []
  return new Folder()
    .setId(folder.id)
    .setMarkers(markers)
    .setName(folder.name)
    .setOrder(folder.order)
    .setCollapsed(folder.collapsed)
    .setUpdatedAt(folder.updatedAt)
    .setDegreeRate(folder.degreeRate)
}

export const findFoldersByUserId = async (db: PrismaEntry, userId: string): Promise<FolderData[]> => {
  const res = await db.folder.findMany({
    where: { userId },
    select: { ...FolderSelect },
  })

  return res.map(folder => {
    return createFolderSelect(folder).serialize()
  })
}

export const getFolderById = async (db: PrismaEntry, userId: string, id: string): Promise<FolderData | null> => {
  const folder = await db.folder.findUnique({
    where: { userId, id },
    select: { ...FolderSelect },
  })

  if (folder) {
    return createFolderSelect(folder).serialize()
  }

  return null
}

export const upsertFolder = async (db: PrismaEntry, userId: string, item: FolderData): Promise<string | null> => {
  const markers = Array.isArray(item.markers) ? item.markers as string[] : []
  const res = await db.folder.upsert({
    where: { userId, id: item.id },
    update: {
      markers,
      name: item.name,
      order: item.order,
      collapsed: item.collapsed,
      degreeRate: item.degreeRate,
      updatedAt: new Date(),
    },
    create: {
      userId,
      markers,
      id: item.id,
      name: item.name,
      order: item.order,
      collapsed: item.collapsed,
      degreeRate: item.degreeRate,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  return res.id
}

export const createManyFolder = async (db: PrismaEntry, userId: string, items: FolderData[]): Promise<number> => {
  const createdAt = new Date()
  const updatedAt = new Date()

  const res = await db.folder.createMany({
    data: items.map((item) => {
      const markers = Array.isArray(item.markers) ? item.markers as FolderMarkersEnum[] : []
      return {
        userId,
        markers,
        id: item.id,
        name: item.name,
        order: item.order,
        collapsed: item.collapsed,
        degreeRate: item.degreeRate,
        createdAt,
        updatedAt
      }
    })
  })

  return res.count
}

export const removeFolder = async (db: PrismaEntry, userId: string, id: string): Promise<boolean> => {
  const res = await db.folder.delete({ where: { userId, id } })
  return !!res?.id
}

export const removeFolders = async (db: PrismaEntry, userId: string, ids: string[]): Promise<boolean> => {
  const res = await db.folder.deleteMany({ where: { userId, id: { in: ids } } })
  return res.count > 0
}
