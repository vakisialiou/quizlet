import PickCard, {
  CardSelection,
  CardSelectedValue,
} from '@containers/Simulator/CardAggregator/MethodPickCard/PickCard'
import {
  CardStatus,
  HelpDataType,
  ExtraPickCardType,
} from '@containers/Simulator/CardAggregator/types'
import { DefaultAnswerLang, DefaultQuestionLang } from '@entities/ClientTerm'
import { getSimulatorNameById } from '@containers/Simulator/constants'
import { SimulatorMethod } from '@entities/ClientSettingsSimulator'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ClientSimulatorData } from '@entities/ClientSimulator'
import { ClientTermData } from '@entities/ClientTerm'
import { shuffle } from '@lib/array'

export default function MethodPickCard(
  {
    terms,
    onChange,
    onSound,
    simulator,
    activeTerm,
    soundSelection
  }:
    {
      terms: ClientTermData[]
      activeTerm?: ClientTermData
      simulator: ClientSimulatorData
      soundSelection: CardSelection | null
      onChange: (data: HelpDataType) => void
      onSound: (selection: CardSelection | null) => void
    }
) {
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
      lang: status === CardStatus.none
        ? (inverted ? cardSide.question.lang : null)
        : (inverted ? cardSide.question.lang : cardSide.answer.lang),
      text: status === CardStatus.none
        ? (inverted ? cardSide.question.text : null)
        : (inverted ? cardSide.question.text : cardSide.answer.text),
      extra: { method: SimulatorMethod.PICK, status } as ExtraPickCardType
    }
  }, [cardSide, inverted])

  const [selectedValue, setSelectedValue] = useState<CardSelectedValue>({ id: null, status: CardStatus.none })

  useEffect(() => {
    setSelectedValue({ id: null, status: CardStatus.none })
  }, [activeTerm?.id])

  useEffect(() => {
    onChange(generateHelpData(selectedValue.status))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue])

  return (
    <PickCard
      cardSide={cardSide}
      key={activeTerm?.id}
      className="w-72 h-96"
      value={selectedValue}
      soundSelection={soundSelection}
      onSelect={(selection) => {
        setSelectedValue({
          id: selection.id,
          status: selection.id === activeTerm?.id ? CardStatus.success : CardStatus.error
        })
      }}
      onSound={(selection) => {
        onSound(selection.id !== soundSelection?.id ? selection : null)
      }}
    />
  )
}
