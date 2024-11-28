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
      terms: {
        select: {
          id: true,
          sort: true,
          answer: true,
          question: true,
          answerLang: true,
          questionLang: true,
          association: true,
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
      .setTerms(
        folder.terms.map(term => {
          return new ClientTerm(folder.id)
            .setId(term.id)
            .setSort(term.sort)
            .setAnswer(term.answer)
            .setQuestion(term.question)
            .setAnswerLang(term.answerLang)
            .setQuestionLang(term.questionLang)
            .setAssociation(term.association)
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
      terms: {
        select: {
          id: true,
          sort: true,
          answer: true,
          question: true,
          answerLang: true,
          questionLang: true,
          association: true,
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
      .setTerms(
        folder.terms.map(term => {
          return new ClientTerm(folder.id)
            .setId(term.id)
            .setSort(term.sort)
            .setAnswer(term.answer)
            .setQuestion(term.question)
            .setAnswerLang(term.answerLang)
            .setQuestionLang(term.questionLang)
            .setAssociation(term.association)
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
      updatedAt: new Date(),
    },
    create: {
      userId,
      id: folder.id,
      name: folder.name,
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
