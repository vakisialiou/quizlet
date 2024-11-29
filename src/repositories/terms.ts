import ClientTerm, { ClientTermData } from '@entities/ClientTerm'
import { prisma, Term } from '@lib/prisma'

export const findTermsByUserId = async (userId: string): Promise<ClientTermData[]> => {
  const res = await prisma.term.findMany({
    where: { userId },
    select: {
      id: true,
      order: true,
      folderId: true,
      answer: true,
      answerLang: true,
      question: true,
      questionLang: true,
      association: true,
      associationLang: true,
      createdAt: true,
      updatedAt: true
    },
  })

  return res.map(term => {
    return new ClientTerm(term.folderId)
      .setId(term.id)
      .setOrder(term.order)
      .setAnswer(term.answer)
      .setAnswerLang(term.answerLang)
      .setQuestion(term.question)
      .setQuestionLang(term.questionLang)
      .setAssociation(term.association)
      .setAssociationLang(term.associationLang)
      .setCreatedAt(term.createdAt)
      .setUpdatedAt(term.updatedAt)
      .serialize()
  })
}

export const findTermsByFolderId = async (userId: string, folderId: string): Promise<ClientTermData[]> => {
  const res = await prisma.term.findMany({
    where: { userId, folderId },
    select: {
      id: true,
      order: true,
      answer: true,
      answerLang: true,
      question: true,
      questionLang: true,
      association: true,
      associationLang: true,
      folderId: true,
      createdAt: true,
      updatedAt: true
    },
  })

  return res.map(term => {
    return new ClientTerm(term.folderId)
      .setId(term.id)
      .setOrder(term.order)
      .setAnswer(term.answer)
      .setAnswerLang(term.answerLang)
      .setQuestion(term.question)
      .setQuestionLang(term.questionLang)
      .setAssociation(term.association)
      .setAssociationLang(term.associationLang)
      .setCreatedAt(term.createdAt)
      .setUpdatedAt(term.updatedAt)
      .serialize()
  })
}

export const getTermById = async (userId: string, id: string): Promise<ClientTermData[]> => {
  const res = await prisma.term.findMany({
    where: { userId, id },
    select: {
      id: true,
      order: true,
      answer: true,
      answerLang: true,
      question: true,
      questionLang: true,
      association: true,
      associationLang: true,
      folderId: true,
      createdAt: true,
      updatedAt: true
    },
  })

  return res.map(term => {
    return new ClientTerm(term.folderId)
      .setId(term.id)
      .setOrder(term.order)
      .setAnswer(term.answer)
      .setAnswerLang(term.answerLang)
      .setQuestion(term.question)
      .setQuestionLang(term.questionLang)
      .setAssociation(term.association)
      .setAssociationLang(term.associationLang)
      .setCreatedAt(term.createdAt)
      .setUpdatedAt(term.updatedAt)
      .serialize()
  })
}

export const upsertTerm = async (term: Term): Promise<string | null> => {
  const res = await prisma.term.upsert({
    where: { id: term.id },
    update: {
      order: term.order,
      answer: term.answer,
      question: term.question,
      answerLang: term.answerLang,
      questionLang: term.questionLang,
      association: term.association,
      associationLang: term.associationLang,
      updatedAt: term.updatedAt || new Date(),
    },
    create: {
      id: term.id,
      order: term.order,
      userId: term.userId as string,
      answer: term.answer,
      answerLang: term.answerLang,
      question: term.question,
      questionLang: term.questionLang,
      association: term.association,
      associationLang: term.associationLang,
      folderId: term.folderId as string,
      createdAt: term.createdAt || new Date(),
      updatedAt: term.updatedAt || new Date()
    },
  })

  return res.id
}

export const removeTerm = async (id: string): Promise<boolean> => {
  const res = await prisma.term.delete({ where: { id } })
  return !!res?.id
}
