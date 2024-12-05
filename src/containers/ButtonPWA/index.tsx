import { useCallback, useEffect, useState } from 'react'
import Button, { ButtonSize } from '@components/Button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: string; platform: string }>
}

export default function ButtonPWA({
  className = '',
  textInstall,
}: {
  className?: string
  textInstall: string,
}) {
  const [ data, setData ] = useState<{ prompt: BeforeInstallPromptEvent | null, showButton: boolean }>({ prompt: null, showButton: false })

  const handleClick = useCallback(async () => {
    if (!data.prompt) {
      return
    }

    // Скрыть кнопку
    setData({ showButton: false, prompt: data.prompt })
    // Показать диалог установки
    await data.prompt.prompt()
    // Ждем ответ от пользователя
    data.prompt.userChoice.then((choiceResult) => {
      console.log(choiceResult.outcome, choiceResult)
    })
  }, [data.prompt])

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setData({ showButton: true, prompt: e as BeforeInstallPromptEvent })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  return (
    <>
      {data.showButton &&
        <Button
          size={ButtonSize.H10}
          className={className}
          onClick={handleClick}
        >
          {textInstall}
        </Button>
      }
    </>
  )
}
