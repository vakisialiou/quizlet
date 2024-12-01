import PickCard, {
  CardSelectedValue,
  CardSelection
} from '@containers/Simulator/CardAggregator/MethodPickCard/PickCard'
import {
  CardStatus,
  ExtraPickCardType,
  HelpDataType
} from '@containers/Simulator/CardAggregator/types'
import {DefaultAnswerLang, DefaultQuestionLang} from '@entities/ClientTerm'
import {getSimulatorNameById} from '@containers/Simulator/constants'
import {SimulatorMethod} from '@entities/ClientSettingsSimulator'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {ClientSimulatorData} from '@entities/ClientSimulator'
import {ClientFolderData} from '@entities/ClientFolder'
import {shuffle} from '@lib/array'

type onChangeCallback = (data: HelpDataType) => void

export default function MethodPickCard(
  {
    folder,
    onChange,
    simulator,
  }:
    {
      folder: ClientFolderData,
      onChange: onChangeCallback,
      simulator: ClientSimulatorData,
    }
) {
  const terms = useMemo(() => [...folder?.terms || []], [folder?.terms])

  const activeTerm = useMemo(() => {
    return terms.find(({ id }) => id === simulator.termId)
  }, [terms, simulator.termId])

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
      lang: status === CardStatus.none ? null : cardSide.answer.lang,
      text: status === CardStatus.none ? null : cardSide.answer.text,
      extra: { method: SimulatorMethod.PICK, status } as ExtraPickCardType
    }
  }, [cardSide])

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
      onSelect={(selection) => {
        setSelectedValue({
          id: selection.id,
          status: selection.id === activeTerm?.id ? CardStatus.success : CardStatus.error
        })
      }}
    />
  )
}
