import { useEffect, useState, useCallback } from 'react'
import Button from '@components/Button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: string; platform: string }>
}

export default function ButtonPWA({ className = '' }: { className?: string }) {
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
      console.log(choiceResult.outcome)
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
    <div>
      {data.showButton &&
        <Button
          className={className}
          onClick={handleClick}
        >
          Установить
        </Button>
      }
      {!data.showButton &&
        <Button
          disabled
          className={className}
        >
          Установлено
        </Button>
      }
    </div>
  )
}
