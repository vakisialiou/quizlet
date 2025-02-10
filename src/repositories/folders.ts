import Folder, { FolderData } from '@entities/Folder'
import { Prisma, PrismaEntry } from '@lib/prisma'
import { MarkersEnum } from '@entities/Marker'
import {TermSettingsData} from "@entities/TermSettings";

export type FolderSelectType = {
  id: boolean,
  name: boolean,
  order: boolean,
  markers: boolean,
  collapsed: boolean,
  updatedAt: boolean,
  createdAt: boolean,
  degreeRate: boolean,
  termSettings: boolean,
}

export const FolderSelect = {
  id: true,
  name: true,
  order: true,
  markers: true,
  collapsed: true,
  updatedAt: true,
  createdAt: true,
  degreeRate: true,
  termSettings: true,
} as FolderSelectType

type FolderResult = Prisma.FolderGetPayload<{
  select: typeof FolderSelect
}>

export const createFolderSelect = (data: FolderResult) => {
  const markers = Array.isArray(data.markers) ? data.markers as MarkersEnum[] : []
  return new Folder()
    .setId(data.id)
    .setMarkers(markers)
    .setName(data.name)
    .setOrder(data.order)
    .setCollapsed(data.collapsed)
    .setUpdatedAt(data.updatedAt)
    .setCreatedAt(data.createdAt)
    .setDegreeRate(data.degreeRate)
    .setTermSettings(data.termSettings as TermSettingsData | null)
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
      termSettings: item.termSettings,
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
      termSettings: item.termSettings,
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
      const markers = Array.isArray(item.markers) ? item.markers as MarkersEnum[] : []
      return {
        userId,
        markers,
        id: item.id,
        name: item.name,
        order: item.order,
        collapsed: item.collapsed,
        degreeRate: item.degreeRate,
        termSettings: item.termSettings,
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
