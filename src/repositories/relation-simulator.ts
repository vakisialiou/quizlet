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

export const createManyRelationSimulators = async (db: PrismaEntry, userId: string, items: RelationSimulatorData[]): Promise<number> => {
  const res = await db.relationSimulator.createMany({
    data: items.map((item) => {
      return {
        userId,
        id: item.id,
        folderId: item.folderId,
        moduleId: item.moduleId,
        simulatorId: item.simulatorId,
      }
    })
  })

  return res.count
}
