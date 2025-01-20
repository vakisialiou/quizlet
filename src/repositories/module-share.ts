import ModuleShare, { ModuleShareData, ModuleShareEnum } from '@entities/ModuleShare'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type ModuleShareSelectType = {
  id: boolean
  ownerId: boolean
  moduleId: boolean
  access: boolean
}

export const ModuleShareSelect = {
  id: true,
  access: true,
  ownerId: true,
  moduleId: true,
} as ModuleShareSelectType

type ModuleShareResult = Prisma.ModuleShareGetPayload<{
  select: typeof ModuleShareSelect
}>

export const createModuleShareSelect = (data: ModuleShareResult) => {
  return new ModuleShare()
    .setId(data.id)
    .setOwnerId(data.ownerId)
    .setModuleId(data.moduleId)
    .setAccess(data.access as ModuleShareEnum)
}

export const getModuleShareById = async (db: PrismaEntry, id: string): Promise<ModuleShareData | null> => {
  const data = await db.moduleShare.findUnique({
    where: { id },
    select: { ...ModuleShareSelect },
  })

  if (data) {
    return createModuleShareSelect(data).serialize()
  }

  return null
}

export const findModuleSharesByOwnerId = async (db: PrismaEntry, ownerId: string): Promise<ModuleShareData[]> => {
  const data = await db.moduleShare.findMany({
    where: { ownerId },
    select: { ...ModuleShareSelect },
  })

  return data.map((item) => {
    return createModuleShareSelect(item).serialize()
  })
}

export const upsertModuleShare = async (db: PrismaEntry, userId: string, item: ModuleShareData): Promise<string | null> => {
  const res = await db.moduleShare.create({
    data: {
      id: item.id,
      ownerId: userId,
      access: item.access,
      moduleId: item.moduleId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  return res.id
}
