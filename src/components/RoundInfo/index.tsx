import { ReactNode } from 'react'

export default function RoundInfo({ title, value }: { title?: string, value?: ReactNode | string | number }) {
  return (
    <div
      className="flex rounded-full items-center justify-center bg-gray-500/10 w-20 h-20 shadow-sm shadow-gray-400"
    >
      <div className="flex flex-col w-full h-full items-center justify-center border border-gray-500/50 rounded-full shadow-inner shadow-gray-500/10">
        {title &&
          <span className="uppercase text-gray-600 text-xs">
            {title}
          </span>
        }

        {value &&
          <span className="text-base">
            {value}
          </span>
        }
      </div>
    </div>
  )
}
