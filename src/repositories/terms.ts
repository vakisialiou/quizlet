import Term, { TermData } from '@entities/Term'
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
  collapsed: boolean,
  updatedAt: boolean
}

export const TermSelect = {
  id: true,
  order: true,
  answer: true,
  answerLang: true,
  question: true,
  questionLang: true,
  association: true,
  associationLang: true,
  deleted: true,
  collapsed: true,
  updatedAt: true
} as TermSelectType

type TermResult = Prisma.TermGetPayload<{
  select: typeof TermSelect
}>

export const createTermSelect = (term: TermResult): Term => {
  return new Term()
    .setId(term.id)
    .setOrder(term.order)
    .setAnswer(term.answer)
    .setAnswerLang(term.answerLang)
    .setQuestion(term.question)
    .setQuestionLang(term.questionLang)
    .setAssociation(term.association)
    .setAssociationLang(term.associationLang)
    .setDeleted(term.deleted)
    .setCollapsed(term.collapsed)
    .setUpdatedAt(term.updatedAt)
}

export const getTermById = async (db: PrismaEntry, id: string): Promise<TermData[]> => {
  const res = await db.term.findMany({
    where: { id },
    select: { ...TermSelect },
  })

  return res.map(term => createTermSelect(term).serialize())
}

export async function findTermsByUserId(db: PrismaEntry, userId: string) {
  const res = await db.term.findMany({
    where: {
      relationTerms: {
        some: { userId },
      },
    },
    select: { ...TermSelect },
    distinct: ['id'],
  })
  return res.map(term => createTermSelect(term).serialize())
}

export const createTerm = async (db: PrismaEntry, term: TermData): Promise<string | null> => {
  const res = await db.term.create({
    data: {
      id: term.id,
      order: term.order,
      answer: term.answer,
      answerLang: term.answerLang,
      question: term.question,
      questionLang: term.questionLang,
      association: term.association,
      associationLang: term.associationLang,
      deleted: term.deleted,
      collapsed: term.collapsed,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  return res.id
}

export const updateTerm = async (db: PrismaEntry, term: TermData): Promise<string | null> => {
  const res = await db.term.update({
    where: { id: term.id },
    data: {
      order: term.order,
      answer: term.answer,
      deleted: term.deleted,
      question: term.question,
      collapsed: term.collapsed,
      answerLang: term.answerLang,
      association: term.association,
      questionLang: term.questionLang,
      associationLang: term.associationLang,
      updatedAt: new Date(),
    }
  })

  return res.id
}

export const removeTerm = async (db: PrismaEntry, id: string): Promise<boolean> => {
  const res = await db.term.delete({ where: { id } })
  return !!res?.id
}
