import ClientRelationTerm, { ClientRelationTermData } from '@entities/ClientRelationTerm'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type RelationTermSelectType = {
  id: boolean,
  termId: boolean,
  folderId: boolean,
  createdAt: boolean,
}

export const RelationTermSelect = {
  id: true,
  termId: true,
  folderId: true,
  createdAt: true,
} as RelationTermSelectType

type RelationTermResult = Prisma.RelationTermGetPayload<{
  select: typeof RelationTermSelect
}>

export const createRelationTermSelect = (data: RelationTermResult) => {
  return new ClientRelationTerm()
    .setId(data.id)
    .setTermId(data.termId)
    .setFolderId(data.folderId)
    .setCreatedAt(data.createdAt)
}

export const createManyRelationTerms = async (db: PrismaEntry, items: ClientRelationTermData[]): Promise<number> => {
  const createdAt = new Date()

  const res = await db.relationTerm.createMany({
    data: items.map((item) => {
      return {
        id: item.id,
        termId: item.termId,
        folderId: item.folderId,
        createdAt,
      }
    })
  })

  return res.count
}
