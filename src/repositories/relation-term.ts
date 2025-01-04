import RelationTerm, { RelationTermData } from '@entities/RelationTerm'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type RelationTermSelectType = {
  id: boolean
  termId: boolean
  folderId: boolean
  moduleId: boolean
}

export const RelationTermSelect = {
  id: true,
  termId: true,
  folderId: true,
  moduleId: true
} as RelationTermSelectType

type RelationTermResult = Prisma.RelationTermGetPayload<{
  select: typeof RelationTermSelect
}>

export function createRelationTermSelect(data: RelationTermResult) {
  return new RelationTerm()
    .setId(data.id)
    .setTermId(data.termId)
    .setFolderId(data.folderId)
    .setModuleId(data.moduleId)
}

export async function findRelationTermsByUserId(db: PrismaEntry, userId: string) {
  const res = await db.relationTerm.findMany({
    where: { userId },
    select: { ...RelationTermSelect },
  })

  return res.map(item => createRelationTermSelect(item).serialize())
}

export async function createManyRelationTerms(db: PrismaEntry, userId: string, items: RelationTermData[]): Promise<number> {
  const res = await db.relationTerm.createMany({
    data: items.map((item) => {
      return {
        userId,
        id: item.id,
        termId: item.termId,
        folderId: item.folderId,
        moduleId: item.moduleId,
      }
    })
  })

  return res.count
}

export async function createRelationTerms(db: PrismaEntry, userId: string, item: RelationTermData): Promise<string> {
  const res = await db.relationTerm.create({
    data: {
      userId,
      id: item.id,
      termId: item.termId,
      folderId: item.folderId,
      moduleId: item.moduleId,
    }
  })

  return res.id
}
