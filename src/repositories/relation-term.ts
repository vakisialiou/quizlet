import RelationTerm, { RelationTermData } from '@entities/RelationTerm'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type RelationTermSelectType = {
  id: boolean
  order: boolean
  color: boolean
  termId: boolean
  folderId: boolean
  moduleId: boolean
  createdAt: boolean
}

export const RelationTermSelect = {
  id: true,
  order: true,
  color: true,
  termId: true,
  folderId: true,
  moduleId: true,
  createdAt: true
} as RelationTermSelectType

type RelationTermResult = Prisma.RelationTermGetPayload<{
  select: typeof RelationTermSelect
}>

export function createRelationTermSelect(data: RelationTermResult) {
  return new RelationTerm()
    .setId(data.id)
    .setColor(data.color)
    .setOrder(data.order)
    .setTermId(data.termId)
    .setFolderId(data.folderId)
    .setModuleId(data.moduleId)
    .setCreatedAt(data.createdAt)
}

export async function findRelationTermsByUserId(db: PrismaEntry, userId: string) {
  const res = await db.relationTerm.findMany({
    where: { userId },
    select: { ...RelationTermSelect },
  })

  return res.map(item => createRelationTermSelect(item).serialize())
}

export async function findModuleRelationTerms(db: PrismaEntry, moduleId: string) {
  const res = await db.relationTerm.findMany({
    where: { moduleId },
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
        order: item.order,
        color: item.color,
        termId: item.termId,
        folderId: item.folderId,
        moduleId: item.moduleId,
        createdAt: new Date(),
      }
    })
  })

  return res.count
}

export async function updateRelationTerms(db: PrismaEntry, userId: string, item: RelationTermData): Promise<string> {
  const res = await db.relationTerm.update({
    where: { userId, id: item.id },
    data: {
      order: item.order,
      color: item.color,
    }
  })

  return res.id
}

export async function createRelationTerms(db: PrismaEntry, userId: string, item: RelationTermData): Promise<string> {
  const res = await db.relationTerm.create({
    data: {
      userId,
      id: item.id,
      order: item.order,
      color: item.color,
      termId: item.termId,
      folderId: item.folderId,
      moduleId: item.moduleId,
      createdAt: new Date(),
    }
  })

  return res.id
}

export async function removeRelationTerms(db: PrismaEntry, userId: string, id: string): Promise<string> {
  const res = await db.relationTerm.delete({
    where: { userId, id }
  })

  return res.id
}
