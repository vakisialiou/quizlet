import ClientFolder, { ClientFolderData } from '@entities/ClientFolder'
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
  userId: boolean,
  order: boolean,
  parentId: boolean,
  isModule: boolean,
  collapsed: boolean,
  createdAt: boolean,
  updatedAt: boolean,
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
  userId: true,
  order: true,
  parentId: true,
  isModule: true,
  collapsed: true,
  createdAt: true,
  updatedAt: true,
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
  return new ClientFolder()
    .setId(folder.id)
    .setName(folder.name)
    .setOrder(folder.order)
    .setParentId(folder.parentId)
    .setIsModule(folder.isModule)
    .setCollapsed(folder.collapsed)
    .setCreatedAt(folder.createdAt)
    .setUpdatedAt(folder.updatedAt)
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
  const res = await db.folder.upsert({
    where: { userId, id: item.id },
    update: {
      name: item.name,
      order: item.order,
      parentId: item.parentId,
      isModule: item.isModule,
      collapsed: item.collapsed,
      updatedAt: new Date(),
    },
    create: {
      userId,
      id: item.id,
      name: item.name,
      order: item.order,
      parentId: item.parentId,
      isModule: item.isModule,
      collapsed: item.collapsed,
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
      return {
        userId,
        id: item.id,
        name: item.name,
        order: item.order,
        parentId: item.parentId,
        isModule: item.isModule,
        collapsed: item.collapsed,
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
