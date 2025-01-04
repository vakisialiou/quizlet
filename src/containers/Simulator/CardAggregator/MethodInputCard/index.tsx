import InputCard, {
  CardSelection,
  CardSelectedValue
} from '@containers/Simulator/CardAggregator/MethodInputCard/InputCard'
import { DefaultAnswerLang, DefaultQuestionLang } from '@entities/Term'
import { getSimulatorNameById } from '@containers/Simulator/constants'
import { SimulatorMethod } from '@entities/SimulatorSettings'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ClientSimulatorData } from '@entities/Simulator'
import { ClientTermData } from '@entities/Term'
import { shuffle } from '@lib/array'
import {
  CardStatus,
  HelpDataType,
  ExtraInputCardType
} from '@containers/Simulator/CardAggregator/types'

type onSubmitCallback = (data: HelpDataType) => void

export default function MethodInputCard(
  {
    terms,
    onSubmit,
    simulator,
    activeTerm,
  }:
    {
      terms: ClientTermData[],
      onSubmit: onSubmitCallback,
      activeTerm?: ClientTermData,
      simulator: ClientSimulatorData,
    }
)
{
  const { inverted } = simulator.settings

  const cardSide = useMemo(() => {
    const items = shuffle([...terms])
      .filter(({ id, answer, question }) => {
        const str = inverted ? question : answer
        return !(id === activeTerm?.id || !str)
      })

    const selections = shuffle([...items.slice(0, 3), { ...activeTerm }])

    return {
      signature: getSimulatorNameById(simulator.settings.id),
      association: activeTerm?.association || null,
      question: {
        id: activeTerm?.id,
        text: inverted
          ? activeTerm?.answer
          : activeTerm?.question,
        lang: inverted
          ? activeTerm?.answerLang || DefaultAnswerLang
          : activeTerm?.questionLang || DefaultQuestionLang,
      } as CardSelection,
      answer: {
        id: activeTerm?.id,
        text: inverted
          ? activeTerm?.question
          : activeTerm?.answer,
        lang: inverted
          ? activeTerm?.questionLang || DefaultQuestionLang
          : activeTerm?.answerLang || DefaultAnswerLang,
      } as CardSelection,
      selections: selections.map((selection) => {
        return {
          id: selection.id,
          text: inverted
            ? selection?.question
            : selection?.answer,
          lang: inverted
            ? selection?.questionLang ||DefaultQuestionLang
            : selection?.answerLang || DefaultAnswerLang,
        } as CardSelection
      }),
    }
  }, [simulator.settings.id, inverted, activeTerm, terms])

  const generateHelpData = useCallback((status: CardStatus) => {
    return {
      association: cardSide.association,
      lang: inverted ? cardSide.question.lang : cardSide.answer.lang,
      text: inverted ? cardSide.question.text : cardSide.answer.text,
      extra: { method: SimulatorMethod.INPUT, status } as ExtraInputCardType
    }
  }, [cardSide, inverted])

  const [selectedValue, setSelectedValue] = useState<CardSelectedValue>({ text: '', status: CardStatus.none })

  useEffect(() => {
    setSelectedValue({ text: '', status: CardStatus.none })
  }, [activeTerm?.id])

  useEffect(() => {
    onSubmit(generateHelpData(selectedValue.status))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue.status])

  const checkAnswer = useCallback((userInput: string, correctAnswer: string) => {
    let normalizedUserInput = userInput.toLowerCase()
    let normalizedCorrectAnswer = correctAnswer.toLowerCase()

    normalizedUserInput = normalizedUserInput.trim()
    normalizedCorrectAnswer = normalizedCorrectAnswer.trim()

    return normalizedUserInput === normalizedCorrectAnswer ? CardStatus.success : CardStatus.error
  }, [])

  return (
    <InputCard
      cardSide={cardSide}
      key={activeTerm?.id}
      className="w-72 h-96"
      value={selectedValue}
      onChange={(e) => {
        setSelectedValue({ ...selectedValue, text: e.target.value })
      }}
      onSubmit={() => {
        setSelectedValue({
          ...selectedValue,
          status: checkAnswer(selectedValue.text || '', cardSide.answer.text || '')
        })
      }}
    />
  )
}
