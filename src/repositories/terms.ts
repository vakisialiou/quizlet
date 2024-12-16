import ClientTerm, { ClientTermData } from '@entities/ClientTerm'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type TermSelectType = {
  id: boolean,
  order: boolean,
  folderId: boolean,
  answer: boolean,
  answerLang: boolean,
  question: boolean,
  questionLang: boolean,
  association: boolean,
  associationLang: boolean,
  deleted: boolean,
  createdAt: boolean,
  updatedAt: boolean
}

export const TermSelect = {
  id: true,
  order: true,
  folderId: true,
  answer: true,
  answerLang: true,
  question: true,
  questionLang: true,
  association: true,
  associationLang: true,
  deleted: true,
  createdAt: true,
  updatedAt: true
} as TermSelectType

type TermResult = Prisma.TermGetPayload<{
  select: typeof TermSelect
}>

export const createTermSelect = (term: TermResult): ClientTerm => {
  return new ClientTerm(term.folderId)
    .setId(term.id)
    .setOrder(term.order)
    .setAnswer(term.answer)
    .setAnswerLang(term.answerLang)
    .setQuestion(term.question)
    .setQuestionLang(term.questionLang)
    .setAssociation(term.association)
    .setAssociationLang(term.associationLang)
    .setDeleted(term.deleted)
    .setCreatedAt(term.createdAt)
    .setUpdatedAt(term.updatedAt)
}

export const findTermsByUserId = async (db: PrismaEntry, userId: string): Promise<ClientTermData[]> => {
  const res = await db.term.findMany({
    where: { userId },
    select: { ...TermSelect },
  })

  return res.map(term => createTermSelect(term).serialize())
}

export const findTermsByFolderId = async (db: PrismaEntry, userId: string, folderId: string): Promise<ClientTermData[]> => {
  const res = await db.term.findMany({
    where: { userId, folderId },
    select: { ...TermSelect },
  })

  return res.map(term => createTermSelect(term).serialize())
}

export const getTermById = async (db: PrismaEntry, userId: string, id: string): Promise<ClientTermData[]> => {
  const res = await db.term.findMany({
    where: { userId, id },
    select: { ...TermSelect },
  })

  return res.map(term => createTermSelect(term).serialize())
}

export const upsertTerm = async (db: PrismaEntry, userId: string, term: ClientTermData): Promise<string | null> => {
  const res = await db.term.upsert({
    where: { id: term.id },
    update: {
      order: term.order,
      answer: term.answer,
      question: term.question,
      answerLang: term.answerLang,
      questionLang: term.questionLang,
      association: term.association,
      associationLang: term.associationLang,
      deleted: term.deleted,
      updatedAt: term.updatedAt || new Date(),
    },
    create: {
      userId,
      id: term.id,
      order: term.order,
      answer: term.answer,
      answerLang: term.answerLang,
      question: term.question,
      questionLang: term.questionLang,
      association: term.association,
      associationLang: term.associationLang,
      folderId: term.folderId as string,
      deleted: term.deleted,
      createdAt: term.createdAt || new Date(),
      updatedAt: term.updatedAt || new Date()
    },
  })

  return res.id
}

export const removeTerm = async (db: PrismaEntry, id: string): Promise<boolean> => {
  const res = await db.term.delete({ where: { id } })
  return !!res?.id
}
