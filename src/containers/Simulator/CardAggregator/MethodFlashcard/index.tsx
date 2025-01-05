import { CardStatus, ExtraFlashcardType, HelpDataType } from '@containers/Simulator/CardAggregator/types'
import Flashcard from '@containers/Simulator/CardAggregator/MethodFlashcard/Flashcard'
import { DefaultAnswerLang, DefaultQuestionLang } from '@entities/Term'
import { getSimulatorNameById } from '@containers/Simulator/constants'
import { SimulatorMethod } from '@entities/SimulatorSettings'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SimulatorData } from '@entities/Simulator'
import { TermData } from '@entities/Term'

type onChangeCallback = (data: HelpDataType) => void

export default function MethodFlashcard(
  {
    onChange,
    simulator,
    activeTerm,
  }:
  {
    onChange: onChangeCallback,
    activeTerm?: TermData,
    simulator: SimulatorData,
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
        lang: inverted ? (activeTerm?.answerLang || DefaultAnswerLang) : (activeTerm?.questionLang || DefaultQuestionLang),
      },
      backSide: {
        signature,
        association: activeTerm?.association || null,
        text: inverted ? activeTerm?.question : activeTerm?.answer,
        lang: inverted ? (activeTerm?.questionLang || DefaultQuestionLang) : (activeTerm?.answerLang || DefaultAnswerLang),
      }
    }
  }, [inverted, activeTerm, signature])

  const generateHelpData = useCallback((back: boolean) => {
    return {
      lang: back ? backSide.lang : faceSide.lang,
      text: back ? backSide.text : faceSide.text,
      association: back ? backSide.association : faceSide.association,
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
