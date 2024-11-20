import { useState } from 'react'
import clsx from 'clsx'
import './style.css'

export default function Card({ question, answer, association, back = false }: { question: string | null, answer: string | null, association: string | null, back?: boolean }) {
  const [isBackSideVisible, setBackSideVisible] = useState(back)

  return (
    <div
      className="card w-72 h-96 group cursor-pointer select-none"
      onClick={() => {
        setBackSideVisible((prevState) => {
          return !prevState
        })
      }}
    >
      <div
        className={clsx('card__inner relative w-full h-full transition-colors', {
          ['card__inner_back']: isBackSideVisible
        })}
      >
        <div className="card__front absolute w-full h-full flex flex-col gap-4 items-center justify-center p-6 border border-gray-600 bg-gray-900">
          <p className="text-gray-500 group-hover:text-gray-400 transition-colors font-semibold text-lg">
            {question || 'not set yet'}
          </p>

          {association &&
            <p className="text-gray-600 font-semibold text-sm">{association}</p>
          }
        </div>
        <div className="card__back absolute w-full h-full flex items-center justify-center p-6 border border-gray-800 bg-gray-900">
          <p className="text-gray-600 group-hover:text-gray-500 transition-colors font-semibold text-lg">
            {answer || 'not set yet'}
          </p>
        </div>
      </div>
    </div>
  )
}
