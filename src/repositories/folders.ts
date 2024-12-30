import ClientFolder, { ClientFolderData, ClientFolderMarkersEnum } from '@entities/ClientFolder'
import { Prisma, PrismaEntry } from '@lib/prisma'
import {
  RelationTermSelectType,
  RelationTermSelect,
  createRelationTermSelect
} from '@repositories/relation-term'
import {
  SimulatorSelectType,
  SimulatorSelect,
  createSimulatorSelect
} from '@repositories/simulators'
import {
  FolderGroupSelectType,
  FolderGroupSelect,
  createFolderGroupSelect
} from '@repositories/folder-group'
import {
  TermSelectType,
  TermSelect,
  createTermSelect
} from '@repositories/terms'

export type FolderSelectType = {
  id: boolean,
  name: boolean,
  description: boolean,
  userId: boolean,
  order: boolean,
  markers: boolean,
  parentId: boolean,
  isModule: boolean,
  collapsed: boolean,
  createdAt: boolean,
  updatedAt: boolean,
  degreeRate: boolean,
  terms: {
    select: TermSelectType
  },
  simulators: {
    select: SimulatorSelectType
  },
  folderGroups: {
    select: FolderGroupSelectType
  },
  relationTerms: {
    select: RelationTermSelectType
  },
}

export const FolderSelect = {
  id: true,
  name: true,
  description: true,
  userId: true,
  order: true,
  markers: true,
  parentId: true,
  isModule: true,
  collapsed: true,
  createdAt: true,
  updatedAt: true,
  degreeRate: true,
  terms: {
    select: { ...TermSelect }
  },
  simulators: {
    select: { ...SimulatorSelect }
  },
  folderGroups: {
    select: FolderGroupSelect
  },
  relationTerms: {
    select: RelationTermSelect
  },
} as FolderSelectType

type FolderResult = Prisma.FolderGetPayload<{
  select: typeof FolderSelect
}>

export const createFolderSelect = (folder: FolderResult) => {
  const markers = Array.isArray(folder.markers) ? folder.markers as ClientFolderMarkersEnum[] : []
  return new ClientFolder()
    .setId(folder.id)
    .setMarkers(markers)
    .setName(folder.name)
    .setOrder(folder.order)
    .setParentId(folder.parentId)
    .setIsModule(folder.isModule)
    .setCollapsed(folder.collapsed)
    .setCreatedAt(folder.createdAt)
    .setUpdatedAt(folder.updatedAt)
    .setDegreeRate(folder.degreeRate)
    .setDescription(folder.description)
    .setTerms(
      folder.terms.map((item) => createTermSelect(item))
    )
    .setSimulators(
      folder.simulators.map(item => createSimulatorSelect(item))
    )
    .setFolderGroups(
      folder.folderGroups.map((item) => createFolderGroupSelect(item))
    )
    .setRelationTerms(
      folder.relationTerms.map((item) => createRelationTermSelect(item))
    )
}

export const findFoldersByUserId = async (db: PrismaEntry, userId: string): Promise<ClientFolderData[]> => {
  const res = await db.folder.findMany({
    where: { userId },
    select: { ...FolderSelect },
  })

  return res.map(folder => {
    return createFolderSelect(folder).serialize()
  })
}

export const getFolderById = async (db: PrismaEntry, userId: string, id: string): Promise<ClientFolderData | null> => {
  const folder = await db.folder.findUnique({
    where: { userId, id },
    select: { ...FolderSelect },
  })

  if (folder) {
    return createFolderSelect(folder).serialize()
  }

  return null
}

export const upsertFolder = async (db: PrismaEntry, userId: string, item: ClientFolderData): Promise<string | null> => {
  const markers = Array.isArray(item.markers) ? item.markers as string[] : []
  const res = await db.folder.upsert({
    where: { userId, id: item.id },
    update: {
      markers,
      name: item.name,
      order: item.order,
      parentId: item.parentId,
      isModule: item.isModule,
      collapsed: item.collapsed,
      degreeRate: item.degreeRate,
      description: item.description,
      updatedAt: new Date(),
    },
    create: {
      userId,
      markers,
      id: item.id,
      name: item.name,
      order: item.order,
      parentId: item.parentId,
      isModule: item.isModule,
      collapsed: item.collapsed,
      degreeRate: item.degreeRate,
      description: item.description,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  return res.id
}

export const createManyFolder = async (db: PrismaEntry, userId: string, items: ClientFolderData[]): Promise<number> => {
  const createdAt = new Date()
  const updatedAt = new Date()

  const res = await db.folder.createMany({
    data: items.map((item) => {
      const markers = Array.isArray(item.markers) ? item.markers as ClientFolderMarkersEnum[] : []
      return {
        userId,
        markers,
        id: item.id,
        name: item.name,
        order: item.order,
        parentId: item.parentId,
        isModule: item.isModule,
        collapsed: item.collapsed,
        degreeRate: item.degreeRate,
        description: item.description,
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
