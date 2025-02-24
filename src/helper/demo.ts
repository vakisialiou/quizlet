import { ConfigType, getInitialState } from '@store/initial-state-main'
import Simulator, { SimulatorStatus } from '@entities/Simulator'
import SimulatorSettings from '@entities/SimulatorSettings'
import RelationSimulator from '@entities/RelationSimulator'
import { COLOR_DEFAULT } from '@components/ColorLabel'
import RelationTerm from '@entities/RelationTerm'
import {getTranslations} from 'next-intl/server'
import { LanguageEnums } from '@i18n/constants'
import Module from '@entities/Module'
import Term from '@entities/Term'

export const DEMO_MODULE_ID = '263f57eb-967d-47fd-84a7-0d424be143dc'

export const getDemoInitialData = async (locale: LanguageEnums): Promise<ConfigType> => {
  const t = await getTranslations({ locale, namespace: 'Landing' })

  const course = new Module()
    .setId(DEMO_MODULE_ID)
    .setCollapsed(false)
    .setName(t('section0Block1Title'))
    .serialize()

  const terms = [
    new Term()
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Study')
      .setQuestion('Изучать')
      .setAssociation('Absorb knowledge through reading books or listening to lectures.')
      .serialize(),
    new Term()
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Memorize')
      .setQuestion('Запоминать')
      .setAssociation('Repeat difficult words and phrases to solidify them in your memory.')
      .serialize(),
    new Term()
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Repeat')
      .setQuestion('Повторять')
      .setAssociation('Regularly repeat words and phrases to improve memorization.')
      .serialize(),
    new Term()
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Retain')
      .setQuestion('Усваивать')
      .setAssociation('Cement information in your memory through repetition and practice.')
      .serialize(),
    new Term()
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Translate')
      .setQuestion('Переводить')
      .setAssociation('Translate words from one language to another for better understanding.')
      .serialize(),
    new Term()
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Teach')
      .setQuestion('Учить')
      .setAssociation('Explain the material to others to strengthen your own knowledge.')
      .serialize(),
    new Term()
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Assess')
      .setQuestion('Оценивать')
      .setAssociation('Test your knowledge and track your progress.')
      .serialize(),
    new Term()
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Use')
      .setQuestion('Использовать')
      .setAssociation('Apply new words in real-life situations to keep them in your memory.')
      .serialize(),
    new Term()
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Improve')
      .setQuestion('Улучшать')
      .setAssociation('Enhance your knowledge through daily practice.')
      .serialize(),
    new Term()
      .setAnswerLang('en')
      .setQuestionLang('ru')
      .setAssociationLang('en')
      .setAnswer('Query')
      .setQuestion('Запрашивать')
      .setAssociation('Search for information or ask questions to deepen your understanding.')
      .serialize()
  ]

  const relationTerms = terms.map(({ id }, index) => {
    return new RelationTerm()
      .setColor(COLOR_DEFAULT)
      .setModuleId(course.id)
      .setOrder(index)
      .setTermId(id)
      .serialize()
  })

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
      ])
    )
    .serialize()

  const relationSimulators = [
    new RelationSimulator()
      .setSimulatorId(simulator.id)
      .setModuleId(course.id)
      .serialize()
  ]

  return getInitialState({
    terms,
    relationTerms,
    modules: [course],
    relationSimulators,
    simulators: [simulator],
  })
}
