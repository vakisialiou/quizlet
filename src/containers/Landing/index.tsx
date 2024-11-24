'use client'

import Button, { ButtonSkin, ButtonSize } from '@components/Button'
import SVGGoogle from '@public/svg/painted/google.svg'
import ContentPage from '@containers/ContentPage'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { signIn } from 'next-auth/react'
import { Session } from 'next-auth'
import { memo } from 'react'
import clsx from 'clsx'

function Landing() {
  const route = useRouter()
  const session = useSelector(({ session }: { session: Session | null }) => session)

  const appName = 'QuizerPlay'

  return (
    <ContentPage
      hideHeader={!session}
    >
      <header
        className={clsx('relative bg-cover bg-fixed', {
          ['h-[calc(100vh-4rem)]']: session,
          ['h-screen']: !session
        })}
        style={{
          backgroundImage: `url('/images/bg-head.avif')`,
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex flex-col gap-8 text-center text-white px-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              Обучение на 100%
            </h1>
            <div
              className="absolute top-4 right-4 text-white bg-yellow-500 text-sm font-bold px-4 py-1 rounded-full"
            >
              Beta
            </div>
            <p className="text-lg md:text-xl mb-6">
              Создавайте модули, папки и карточки для эффективного
              <br/>
              запоминания на платформе
              <br/>
              <span className="font-bold">{appName}</span>!
            </p>
            <div className="flex justify-center">
              <Button
                className="px-6 gap-2 font-medium"
                size={ButtonSize.H12}
                skin={ButtonSkin.WHITE_100}
                onClick={() => {
                  if (!session) {
                    signIn('google')
                  } else {
                    route.push('/private')
                  }
                }}
              >
                {!session &&
                  <>
                    <SVGGoogle
                      width={24}
                      height={24}
                    />
                    Начать с Google
                  </>
                }

                {session && 'Начать обучение сейчас'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="py-20 bg-white text-gray-700">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Лучшая платформа для вас!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Гибкость</h3>
              <p>Структурируйте знания с помощью модулей и папок.</p>
            </div>
            <div className="p-6 bg-gray-50 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Эффективные симуляторы</h3>
              <p>Отработайте вопросы и ответы до автоматизма.</p>
            </div>
            <div className="p-6 bg-gray-50 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Геймификация</h3>
              <p>Зарабатывайте медали за успешное прохождение симуляций.</p>
            </div>
            <div className="p-6 bg-gray-50 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Ассоциации AI</h3>
              <p>Создавайте свои или генерируйте автоматически (премиум).</p>
            </div>
            <div className="p-6 bg-gray-50 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Многоуровневая мотивация</h3>
              <p>Бронза за первый успех, золото за полное освоение.</p>
            </div>
            <div className="p-6 bg-gray-50 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Универсальность</h3>
              <p>Поддержка web, web-extension, android, ios приложений.</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative bg-fixed bg-cover"
        style={{
          backgroundImage: `url('/images/bg-how-it-works.avif')`,
          backgroundPosition: 'center'
        }}
      >
        <div className="bg-black bg-opacity-70 py-36 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Учебный процесс на {appName} в три
              шага</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-400">
              <div className="p-6 bg-gray-900/50 border border-gray-400/50 shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Шаг 1: Создание структуры</h3>
                <p>Создайте модуль и папки для структурирования материалов.</p>
              </div>
              <div className="p-6 bg-gray-900/50 border border-gray-400/50 shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Шаг 2: Выбор симулятора</h3>
                <p>Выбирайте подходящий симулятор: Flashcard или Input, Direct или Inverse.</p>
              </div>
              <div className="p-6 bg-gray-900/50 border border-gray-400/50 shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Шаг 3: Получение наград</h3>
                <p>Получайте награды за прохождение и совершенствуйте знания.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="py-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Достигайте результатов быстрее с {appName}!
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Забудьте про хаотичное обучение — структурируйте знания,
            проходите симуляции, мотивируйте себя наградами.
          </p>

          <div className="flex justify-center gap-8">
            <Button
              className="px-6 gap-2 font-medium"
              size={ButtonSize.H12}
              skin={ButtonSkin.WHITE_100}
              onClick={() => {

              }}
            >
              {!session &&
                <>
                  <SVGGoogle
                    width={24}
                    height={24}
                  />
                  Продолжить с Google
                </>
              }

              {session && 'Продолжить обучение'}
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-6">
        <div className="max-w-6xl mx-auto text-center">
          <p>© 2024. Все права защищены. Платформа {appName} для Обучения.</p>
        </div>
      </footer>
    </ContentPage>
  )
}

export default memo(Landing)
