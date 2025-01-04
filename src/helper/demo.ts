import Simulator, { SimulatorStatus } from '@entities/Simulator'
import SimulatorSettings from '@entities/SimulatorSettings'
import Folder, { ClientFolderData } from '@entities/Folder'
import {getTranslations} from 'next-intl/server'
import { LanguageEnums } from '@i18n/constants'
import Term from '@entities/Term'

export const DEMO_FOLDER_ID = '263f57eb-967d-47fd-84a7-0d424be143dc'

export const getDemoFoldersInitialData = async (locale: LanguageEnums): Promise<ClientFolderData[]> => {
  const t = await getTranslations({ locale, namespace: 'Landing' })

  const terms = [
    new Term()
      .setOrder(1)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Study')
      .setQuestion('Изучать')
      .setAssociation('Absorb knowledge through reading books or listening to lectures.'),
    new Term()
      .setOrder(2)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Memorize')
      .setQuestion('Запоминать')
      .setAssociation('Repeat difficult words and phrases to solidify them in your memory.'),
    new Term()
      .setOrder(3)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Repeat')
      .setQuestion('Повторять')
      .setAssociation('Regularly repeat words and phrases to improve memorization.'),
    new Term()
      .setOrder(4)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Retain')
      .setQuestion('Усваивать')
      .setAssociation('Cement information in your memory through repetition and practice.'),
    new Term()
      .setOrder(5)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Translate')
      .setQuestion('Переводить')
      .setAssociation('Translate words from one language to another for better understanding.'),
    new Term()
      .setOrder(6)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Teach')
      .setQuestion('Учить')
      .setAssociation('Explain the material to others to strengthen your own knowledge.'),
    new Term()
      .setOrder(7)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Assess')
      .setQuestion('Оценивать')
      .setAssociation('Test your knowledge and track your progress.'),
    new Term()
      .setOrder(8)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Use')
      .setQuestion('Использовать')
      .setAssociation('Apply new words in real-life situations to keep them in your memory.'),
    new Term()
      .setOrder(9)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Improve')
      .setQuestion('Улучшать')
      .setAssociation('Enhance your knowledge through daily practice.'),
    new Term()
      .setOrder(10)
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Query')
      .setQuestion('Запрашивать')
      .setAssociation('Search for information or ask questions to deepen your understanding.')
  ]

  const folder = new Folder()
    .setId(DEMO_FOLDER_ID)
    .setCollapsed(false)
    .setName(t('section0Block1Title'))

  const simulator = new Simulator(SimulatorStatus.PROCESSING)
    .setActive(true)
    .setTermId(terms[0].id)
    .setTermIds(terms.map(({ id }) => id))
    .setSettings(new SimulatorSettings()
      .setExtraTermIds([
        terms[3].id,
        terms[2].id,
        terms[0].id,
        terms[1].id
      ]))

  return [folder.serialize()]
}
