import Settings, { SettingsData, ModuleSettingsData, TermSettingsData } from '@entities/Settings'
import { SimulatorSettingsData } from '@entities/SimulatorSettings'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type SettingsSelectType = {
  id: boolean,
  terms: boolean,
  modules: boolean,
  simulator: boolean,
}

export const SettingsSelect = {
  id: true,
  terms: true,
  modules: true,
  simulator: true
} as SettingsSelectType

type SettingsResult = Prisma.SettingsGetPayload<{
  select: typeof SettingsSelect
}>

export const createSettingsSelect = (data: SettingsResult): Settings => {
  return new Settings()
    .setId(data.id)
    .setTerms(data?.terms as TermSettingsData)
    .setModules(data?.modules as ModuleSettingsData)
    .setSimulator(data?.simulator as SimulatorSettingsData)
}

export const upsertSettingsSimulator = async (db: PrismaEntry, userId: string, data: SettingsData) => {
  const res = await db.settings.upsert({
    where: { userId },
    update: {
      simulator: data.simulator,
      modules: data.modules,
      terms: data.terms,
      updatedAt: new Date(),
    },
    create: {
      userId,
      simulator: data.simulator,
      modules: data.modules,
      terms: data.terms,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  return res.id
}

export const getSettings = async (db: PrismaEntry, userId: string): Promise<SettingsData | null> => {
  if (!userId) {
    return null
  }

  const settings = await db.settings.findUnique({
    where: { userId },
    select: { ...SettingsSelect }
  })

  if (!settings) {
    return null
  }

  return createSettingsSelect(settings as Settings).serialize()
}
