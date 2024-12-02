import { CardStatus, ExtraFlashcardType, HelpDataType } from '@containers/Simulator/CardAggregator/types'
import Flashcard from '@containers/Simulator/CardAggregator/MethodFlashcard/Flashcard'
import { DefaultAnswerLang, DefaultQuestionLang } from '@entities/ClientTerm'
import { getSimulatorNameById } from '@containers/Simulator/constants'
import { SimulatorMethod } from '@entities/ClientSettingsSimulator'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ClientSimulatorData } from '@entities/ClientSimulator'
import { ClientTermData } from '@entities/ClientTerm'

type onChangeCallback = (data: HelpDataType) => void

export default function MethodFlashcard(
  {
    onChange,
    simulator,
    activeTerm,
  }:
  {
    onChange: onChangeCallback,
    activeTerm?: ClientTermData,
    simulator: ClientSimulatorData,
  }
) {
  const [ isBackSide, setIsBackSide ] = useState(false)

  const { inverted } = simulator.settings

  const signature = useMemo(() => {
    return getSimulatorNameById(simulator.settings.id)
  }, [simulator.settings.id])

  const { faceSide, backSide } = useMemo(() => {
    return {
      faceSide: {
        signature,
        association: activeTerm?.association || null,
        text: inverted ? activeTerm?.answer : activeTerm?.question,
        lang: inverted ? activeTerm?.answerLang : activeTerm?.questionLang,
      },
      backSide: {
        signature,
        association: activeTerm?.association || null,
        text: inverted ? activeTerm?.question : activeTerm?.answer,
        lang: inverted ? activeTerm?.questionLang : activeTerm?.answerLang,
      }
    }
  }, [inverted, activeTerm, signature])

  const generateHelpData = useCallback((back: boolean) => {
    return {
      text: back ? backSide.text : faceSide.text,
      association: back ? backSide.association : faceSide.association,
      lang: back ? (backSide.lang || DefaultAnswerLang) : (faceSide.lang || DefaultQuestionLang),
      extra: { method: SimulatorMethod.FLASHCARD, status: CardStatus.none } as ExtraFlashcardType
    }
  }, [backSide, faceSide])

  useEffect(() => {
    onChange(generateHelpData(isBackSide))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTerm?.id, isBackSide])

  return (
    <Flashcard
      className="w-72 h-96"
      faceSide={faceSide}
      backSide={backSide}
      isBackSide={isBackSide}
      onClick={() => {
        setIsBackSide((prevState) => !prevState)
      }}
    />
  )
}
