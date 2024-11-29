import { ClientSettingsSimulatorData } from '@entities/ClientSettingsSimulator'
import ClientSimulator, { SimulatorStatus } from '@entities/ClientSimulator'
import ClientFolder, { ClientFolderData } from '@entities/ClientFolder'
import { ProgressTrackerData } from '@entities/ProgressTracker'
import ClientTerm from '@entities/ClientTerm'
import { prisma, Folder } from '@lib/prisma'

export const findFoldersByUserId = async (userId: string): Promise<ClientFolderData[]> => {
  const res = await prisma.folder.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      order: true,
      createdAt: true,
      updatedAt: true,
      terms: {
        select: {
          id: true,
          order: true,
          answer: true,
          answerLang: true,
          question: true,
          questionLang: true,
          association: true,
          associationLang: true,
          createdAt: true,
          updatedAt: true
        }
      },
      simulators: {
        select: {
          id: true,
          termId: true,
          active: true,
          status: true,
          folderId: true,
          termIds: true,
          historyIds: true,
          continueIds: true,
          rememberIds: true,
          settings: true,
          tracker: true
        }
      }
    },
  })

  return res.map(folder => {
    return new ClientFolder()
      .setId(folder.id)
      .setName(folder.name)
      .setOrder(folder.order)
      .setCreatedAt(folder.createdAt)
      .setUpdatedAt(folder.updatedAt)
      .setTerms(
        folder.terms.map(term => {
          return new ClientTerm(folder.id)
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
        })
      )
      .setSimulators(
        folder.simulators.map(simulator => {
          const termIds = Array.isArray(simulator.termIds) ? simulator.termIds as string[] : []
          const historyIds = Array.isArray(simulator.historyIds) ? simulator.historyIds as string[] : []
          const continueIds = Array.isArray(simulator.continueIds) ? simulator.continueIds as string[] : []
          const rememberIds = Array.isArray(simulator.rememberIds) ? simulator.rememberIds as string[] : []

          return new ClientSimulator(simulator.folderId, simulator.status as SimulatorStatus)
            .setId(simulator.id)
            .setTermId(simulator.termId)
            .setActive(simulator.active)
            .setTermIds(termIds)
            .setHistoryIds(historyIds)
            .setContinueIds(continueIds)
            .setRememberIds(rememberIds)
            .setTracker(simulator.tracker as ProgressTrackerData)
            .setSettings(simulator.settings as ClientSettingsSimulatorData)
        })
      )
      .serialize()
  })
}

export const getFolderById = async (userId: string, id: string): Promise<ClientFolderData | null> => {
  const folder = await prisma.folder.findUnique({
    where: { userId, id },
    select: {
      id: true,
      name: true,
      order: true,
      createdAt: true,
      updatedAt: true,
      terms: {
        select: {
          id: true,
          order: true,
          answer: true,
          answerLang: true,
          question: true,
          questionLang: true,
          association: true,
          associationLang: true,
          createdAt: true,
          updatedAt: true
        }
      },
      simulators: {
        select: {
          id: true,
          termId: true,
          active: true,
          status: true,
          folderId: true,
          termIds: true,
          historyIds: true,
          continueIds: true,
          rememberIds: true,
          settings: true,
          tracker: true
        }
      }
    },
  })

  if (folder) {
    return new ClientFolder()
      .setId(folder.id)
      .setName(folder.name)
      .setOrder(folder.order)
      .setCreatedAt(folder.createdAt)
      .setUpdatedAt(folder.updatedAt)
      .setTerms(
        folder.terms.map(term => {
          return new ClientTerm(folder.id)
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
        })
      )
      .setSimulators(
        folder.simulators.map(simulator => {
          const termIds = Array.isArray(simulator.termIds) ? simulator.termIds as string[] : []
          const historyIds = Array.isArray(simulator.historyIds) ? simulator.historyIds as string[] : []
          const continueIds = Array.isArray(simulator.continueIds) ? simulator.continueIds as string[] : []
          const rememberIds = Array.isArray(simulator.rememberIds) ? simulator.rememberIds as string[] : []

          return new ClientSimulator(simulator.folderId, simulator.status as SimulatorStatus)
            .setId(simulator.id)
            .setTermId(simulator.termId)
            .setActive(simulator.active)
            .setTermIds(termIds)
            .setHistoryIds(historyIds)
            .setContinueIds(continueIds)
            .setRememberIds(rememberIds)
            .setTracker(simulator.tracker as ProgressTrackerData)
            .setSettings(simulator.settings as ClientSettingsSimulatorData)
        })
      )
      .serialize()
  }

  return null
}

export const upsertFolder = async (userId: string, folder: Folder): Promise<string | null> => {
  const res = await prisma.folder.upsert({
    where: { userId, id: folder.id },
    update: {
      name: folder.name,
      order: folder.order,
      updatedAt: new Date(),
    },
    create: {
      userId,
      id: folder.id,
      name: folder.name,
      order: folder.order,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  return res.id
}

export const removeFolder = async (userId: string, id: string): Promise<boolean> => {
  const res = await prisma.folder.delete({ where: { userId, id } })
  return !!res?.id
}
