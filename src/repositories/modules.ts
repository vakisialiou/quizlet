import Module, { ModuleData, ModuleMarkersEnum } from '@entities/Module'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type ModuleSelectType = {
  id: boolean,
  name: boolean,
  description: boolean,
  order: boolean,
  markers: boolean,
  collapsed: boolean,
  updatedAt: boolean,
  degreeRate: boolean,
}

export const ModuleSelect = {
  id: true,
  name: true,
  description: true,
  order: true,
  markers: true,
  collapsed: true,
  updatedAt: true,
  degreeRate: true,
} as ModuleSelectType

type ModuleResult = Prisma.ModuleGetPayload<{
  select: typeof ModuleSelect
}>

export const createModuleSelect = (data: ModuleResult) => {
  const markers = Array.isArray(data.markers) ? data.markers as ModuleMarkersEnum[] : []
  return new Module()
    .setId(data.id)
    .setMarkers(markers)
    .setName(data.name)
    .setOrder(data.order)
    .setCollapsed(data.collapsed)
    .setUpdatedAt(data.updatedAt)
    .setDegreeRate(data.degreeRate)
    .setDescription(data.description)
}

export const findModulesByUserId = async (db: PrismaEntry, userId: string): Promise<ModuleData[]> => {
  const res = await db.module.findMany({
    where: { userId },
    select: { ...ModuleSelect },
  })

  return res.map(data => {
    return createModuleSelect(data).serialize()
  })
}

export const getModuleById = async (db: PrismaEntry, userId: string, id: string): Promise<ModuleData | null> => {
  const data = await db.module.findUnique({
    where: { userId, id },
    select: { ...ModuleSelect },
  })

  if (data) {
    return createModuleSelect(data).serialize()
  }

  return null
}

export const upsertModule = async (db: PrismaEntry, userId: string, item: ModuleData): Promise<string | null> => {
  const markers = Array.isArray(item.markers) ? item.markers as string[] : []
  const res = await db.module.upsert({
    where: { userId, id: item.id },
    update: {
      markers,
      name: item.name,
      order: item.order,
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
      collapsed: item.collapsed,
      degreeRate: item.degreeRate,
      description: item.description,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  return res.id
}

export const createManyModules = async (db: PrismaEntry, userId: string, items: ModuleData[]): Promise<number> => {
  const createdAt = new Date()
  const updatedAt = new Date()

  const res = await db.module.createMany({
    data: items.map((item) => {
      const markers = Array.isArray(item.markers) ? item.markers as ModuleMarkersEnum[] : []
      return {
        userId,
        markers,
        id: item.id,
        name: item.name,
        order: item.order,
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

export const removeModule = async (db: PrismaEntry, userId: string, id: string): Promise<boolean> => {
  const res = await db.module.delete({ where: { userId, id } })
  return !!res?.id
}

export const removeModules = async (db: PrismaEntry, userId: string, ids: string[]): Promise<boolean> => {
  const res = await db.module.deleteMany({ where: { userId, id: { in: ids } } })
  return res.count > 0
}
