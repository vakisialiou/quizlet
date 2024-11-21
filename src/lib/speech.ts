
export const voices = [
  {"name":"Google Deutsch","lang":"de-DE"},
  {"name":"Google US English","lang":"en-US"},
  {"name":"Google UK English Male","lang":"en-GB"},
  {"name":"Google UK English Female","lang":"en-GB"},
  {"name":"Google español","lang":"es-ES"},
  {"name":"Google español de Estados Unidos","lang":"es-US"},
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
  {"name":"Google 普通话（中国大陆）","lang":"zh-CN"},
  {"name":"Google 粤語（香港）","lang":"zh-HK"},
  {"name":"Google 國語（臺灣）","lang":"zh-TW"}
]

export default class TextToSpeech {
  private synth: SpeechSynthesis
  private voices: SpeechSynthesisVoice[]
  private voice: SpeechSynthesisVoice | null
  private rate: number
  private volume: number
  private lang: string | null

  constructor() {
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
  }

  hasVoice() {
    return !!this.voice
  }

  loadVoices() {
    this.voices = this.synth.getVoices()
    if (!this.voices.length) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = this.synth.getVoices()
      }
    }
    return this
  }

  setVoice(value: string) {
    this.voice = this.voices.find((voice) => {
      return voice.name === value || voice.lang === value
    }) || null
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
