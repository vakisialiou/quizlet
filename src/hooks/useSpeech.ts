import TextToSpeech, { TextToSpeechEvents } from '@lib/speech'
import {useEffect, useMemo, useState} from 'react'

export function useSpeech<T>(state: T): { speech: TextToSpeech | null, soundInfo: T, setSoundInfo: (state: T) => void } {
  const speech = useMemo(() => {
    return typeof(window) === 'object' ? new TextToSpeech() : null
  }, [])

  const [ soundInfo, setSoundInfo ] = useState(state)

  useEffect(() => {
    if (speech) {
      const onEndCallback = () => setSoundInfo(state)
      speech.addEventListener(TextToSpeechEvents.end, onEndCallback)
      return () => {
        speech.removeEventListener(TextToSpeechEvents.end, onEndCallback)
      }
    }
  }, [speech, setSoundInfo, state])

  return { speech, soundInfo, setSoundInfo }
}
