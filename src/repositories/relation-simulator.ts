import RelationSimulator, { RelationSimulatorData } from '@entities/RelationSimulator'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type RelationSimulatorSelectType = {
  id: boolean
  folderId: boolean
  moduleId: boolean
  simulatorId: boolean
}

export const RelationSimulatorSelect = {
  id: true,
  folderId: true,
  moduleId: true,
  simulatorId: true
} as RelationSimulatorSelectType

type RelationSimulatorResult = Prisma.RelationSimulatorGetPayload<{
  select: typeof RelationSimulatorSelect
}>

export const createRelationSimulatorSelect = (data: RelationSimulatorResult) => {
  return new RelationSimulator()
    .setId(data.id)
    .setFolderId(data.folderId)
    .setModuleId(data.moduleId)
    .setSimulatorId(data.simulatorId)
}

export const createRelationSimulator = async (db: PrismaEntry, userId: string, item: RelationSimulatorData): Promise<string | null> => {
  const res = await db.relationSimulator.create({
    data: {
      userId,
      id: item.id,
      folderId: item.folderId,
      moduleId: item.moduleId,
      simulatorId: item.simulatorId,
    }
  })

  return res.id || null
}

export async function findRelationSimulatorsByUserId(db: PrismaEntry, userId: string) {
  const res = await db.relationSimulator.findMany({
    where: { userId },
    select: { ...RelationSimulatorSelect },
  })

  return res.map(item => createRelationSimulatorSelect(item).serialize())
}
