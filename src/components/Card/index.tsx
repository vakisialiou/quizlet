import './style.css'

export default function Card({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="card w-72 h-96 group cursor-pointer select-none">
      <div className="card__inner relative w-full h-full transition-colors">
        <div className="card__front absolute w-full h-full flex items-center justify-center p-6 border border-gray-600 rounded bg-gray-900">
          <p className="text-gray-500 group-hover:text-gray-400 transition-colors font-semibold text-lg">{question}</p>
        </div>
        <div className="card__back absolute w-full h-full flex items-center justify-center p-6 border border-gray-600 rounded bg-gray-700">
          <p className="text-gray-500 group-hover:text-gray-300 transition-colors font-semibold text-lg">{answer}</p>
        </div>
      </div>
    </div>
  )
}
