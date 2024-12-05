
export const voices = [
  {"name":"Google Deutsch","lang":"de-DE"},
  {"name":"Google UK English Male","lang":"en-GB"},
  {"name":"Google español","lang":"es-ES"},
  {"name":"Google français","lang":"fr-FR"},
  {"name":"Google हिन्दी","lang":"hi-IN"},
  {"name":"Google Bahasa Indonesia","lang":"id-ID"},
  {"name":"Google italiano","lang":"it-IT"},
  {"name":"Google 日本語","lang":"ja-JP"},
  {"name":"Google 한국의","lang":"ko-KR"},
  {"name":"Google Nederlands","lang":"nl-NL"},
  {"name":"Google polski","lang":"pl-PL"},
  {"name":"Google português do Brasil","lang":"pt-BR"},
  {"name":"Google русский","lang":"ru-RU"},
  {"name":"Google 普通话（中国大陆","lang":"zh-CN"},
]

export enum TextToSpeechEvents {
  start = 'start',
  end = 'end'
}

export default class TextToSpeech {
  private synth!: SpeechSynthesis
  private voices!: SpeechSynthesisVoice[]
  private voice!: SpeechSynthesisVoice | null
  private rate!: number
  private volume!: number
  private lang!: string | null
  private events!: { eventName: TextToSpeechEvents, callback: () => void }[]
  private static inst?: TextToSpeech

  constructor() {
    if (TextToSpeech.inst) {
      return TextToSpeech.inst
    }

    TextToSpeech.inst = this

    if (!window.speechSynthesis) {
      throw new Error('Ваш браузер не поддерживает SpeechSynthesis.')
    }

    this.synth = window.speechSynthesis as SpeechSynthesis
    this.voices = []

    this.voice = null

    // Speed (1 - normal, 0.5 - slow, 2 - fast)
    this.rate = 1
    // (0.1 - quiet, 1 - loud)
    this.volume = 1

    this.lang = 'en-GB'

    this.init()

    this.events = []
  }

  addEventListener(eventName: TextToSpeechEvents, callback: () => void): TextToSpeech {
    this.events.push({ eventName, callback })
    return this
  }

  removeEventListener(eventName: TextToSpeechEvents, callback: () => void): TextToSpeech {
    const index = this.events.findIndex((event) => {
      return event.eventName === eventName && event.callback === callback
    })
    if (index !== -1) {
      this.events.splice(index, 1)
    }
    return this
  }

  init() {
    this.voices = this.synth.getVoices()
    if (!this.voices.length) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = this.synth.getVoices()
      }
    }

    let speaking = this.synth.speaking
    setInterval(() => {
      if (speaking !== this.synth.speaking) {

        for (const { eventName, callback } of this.events) {
          if (this.synth.speaking && eventName === TextToSpeechEvents.start) {
            callback()
          }
          if (!this.synth.speaking && eventName === TextToSpeechEvents.end) {
            callback()
          }
        }
        speaking = this.synth.speaking
      }
    }, 1000 / 60)
    return this
  }

  selectVoice(lang: string, priorities: string[] = []) {
    const filtered = this.voices.filter(voice => voice.lang.startsWith(lang));

    // Сортируем по приоритету
    filtered.sort((a, b) => {
      const indexA = priorities.indexOf(a.lang)
      const indexB = priorities.indexOf(b.lang)
      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB)
    })

    return filtered[0] || null
  }

  setVoice(voice: SpeechSynthesisVoice | null) {
    this.voice = voice
    return this
  }

  setLang(lang: string | null) {
    this.lang = lang
    return this
  }

  setRate(rate: number) {
    this.rate = rate
    return this
  }

  setVolume(volume: number) {
    this.volume = volume
    return this
  }

  speak(text: string) {
    if (!text) {
      throw new Error(`Text can't be empty.`)
    }

    const utterance = new SpeechSynthesisUtterance(text)

    if (this.lang) {
      utterance.lang = this.lang
    }

    if (this.voice) {
      utterance.voice = this.voice
    }

    utterance.rate = this.rate
    utterance.volume = this.volume

    this.synth.speak(utterance)
    return this
  }

  get isSpeaking() {
    return this.synth.speaking
  }

  stop() {
    if (this.isSpeaking) {
      this.synth.cancel()
    }
    return this
  }
}
