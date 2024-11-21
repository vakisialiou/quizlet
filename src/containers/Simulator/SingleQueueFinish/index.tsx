import CardEmpty from '@containers/Simulator/CardEmpty'
import { ReactNode } from 'react'

export default function SingleQueueFinish({ children }: { children: ReactNode }) {
  return (
    <CardEmpty>
      <div className="flex flex-col justify-center text-center gap-2">
        <div className="text-gray-300 text-lg">
          Prepare yourself to move forward.
        </div>

        <div className="text-gray-500 text-lg">
          {children}
        </div>
      </div>
    </CardEmpty>
  )
}
