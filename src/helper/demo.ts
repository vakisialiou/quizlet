import ClientSimulator, { SimulatorStatus } from '@entities/ClientSimulator'
import ClientSettingsSimulator from '@entities/ClientSettingsSimulator'
import ClientFolder, { ClientFolderData } from '@entities/ClientFolder'
import {getTranslations} from 'next-intl/server'
import { LanguageEnums } from '@i18n/constants'
import ClientTerm from '@entities/ClientTerm'

export const DEMO_FOLDER_ID = '263f57eb-967d-47fd-84a7-0d424be143dc'

export const getDemoFoldersInitialData = async (locale: LanguageEnums): Promise<ClientFolderData[]> => {
  const t = await getTranslations({ locale, namespace: 'Landing' })

  const terms = [
    new ClientTerm()
      .setOrder(1)
      .setFolderId(DEMO_FOLDER_ID)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Study')
      .setQuestion('Изучать')
      .setAssociation('Absorb knowledge through reading books or listening to lectures.'),
    new ClientTerm()
      .setOrder(2)
      .setFolderId(DEMO_FOLDER_ID)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Memorize')
      .setQuestion('Запоминать')
      .setAssociation('Repeat difficult words and phrases to solidify them in your memory.'),
    new ClientTerm()
      .setOrder(3)
      .setFolderId(DEMO_FOLDER_ID)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Repeat')
      .setQuestion('Повторять')
      .setAssociation('Regularly repeat words and phrases to improve memorization.'),
    new ClientTerm()
      .setOrder(4)
      .setFolderId(DEMO_FOLDER_ID)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Retain')
      .setQuestion('Усваивать')
      .setAssociation('Cement information in your memory through repetition and practice.'),
    new ClientTerm()
      .setOrder(5)
      .setFolderId(DEMO_FOLDER_ID)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Translate')
      .setQuestion('Переводить')
      .setAssociation('Translate words from one language to another for better understanding.'),
    new ClientTerm()
      .setOrder(6)
      .setFolderId(DEMO_FOLDER_ID)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Teach')
      .setQuestion('Учить')
      .setAssociation('Explain the material to others to strengthen your own knowledge.'),
    new ClientTerm()
      .setOrder(7)
      .setFolderId(DEMO_FOLDER_ID)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Assess')
      .setQuestion('Оценивать')
      .setAssociation('Test your knowledge and track your progress.'),
    new ClientTerm()
      .setOrder(8)
      .setFolderId(DEMO_FOLDER_ID)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Use')
      .setQuestion('Использовать')
      .setAssociation('Apply new words in real-life situations to keep them in your memory.'),
    new ClientTerm()
      .setOrder(9)
      .setFolderId(DEMO_FOLDER_ID)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Improve')
      .setQuestion('Улучшать')
      .setAssociation('Enhance your knowledge through daily practice.'),
    new ClientTerm()
      .setOrder(10)
      .setFolderId(DEMO_FOLDER_ID)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Query')
      .setQuestion('Запрашивать')
      .setAssociation('Search for information or ask questions to deepen your understanding.')
  ]

  const folder = new ClientFolder()
    .setId(DEMO_FOLDER_ID)
    .setIsModule(true)
    .setCollapsed(false)
    .setName(t('section0Block1Title'))
    .addSimulator(
      new ClientSimulator(DEMO_FOLDER_ID, SimulatorStatus.PROCESSING)
        .setActive(true)
        .setTermId(terms[0].id)
        .setSettings(new ClientSettingsSimulator())
        .setTermIds(terms.map(({ id }) => id))
    )
    .setTerms(terms)

  return [folder.serialize()]
}
