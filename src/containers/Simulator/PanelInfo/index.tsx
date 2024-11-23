import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import RoundInfo from '@components/RoundInfo'
import { useRef, useEffect } from 'react'
import { getDuration } from '@lib/date'
import clsx from 'clsx'

export default function PanelInfo(
  { process = false, simulator, className = '' }:
  { process?: boolean, simulator?: ClientSimulatorData | null, className?: string }
) {

  const refTimer = useRef<HTMLDivElement|null>(null)
  const refTimerIntervalId = useRef<NodeJS.Timeout|number|undefined>(undefined)
  const refTimerDuration = useRef<number>(0)

  useEffect(() => {
    clearInterval(refTimerIntervalId.current)
    refTimerIntervalId.current = setInterval(() => {
      if (!simulator?.status) {
        refTimerDuration.current = 0
      }

      if (simulator?.status && [SimulatorStatus.WAITING, SimulatorStatus.FINISHING, SimulatorStatus.DONE].includes(simulator?.status)) {
        return
      }

      if (!refTimer.current) {
        return
      }

      refTimerDuration.current += 1000
      refTimer.current.innerText = getDuration(refTimerDuration.current)

    }, 1000)

    return () => {
      clearInterval(refTimerIntervalId.current)
    }
  }, [simulator?.status])

  return (
    <div
      className={clsx('flex items-center justify-between select-none gap-2 h-16', {
        [className]: className
      })}
    >
      {(!process && simulator) &&
        <>
          <RoundInfo
            title="Total"
            value={simulator.termIds.length}
          />

          <RoundInfo
            title="Wait"
            value={Math.max(simulator.termIds.length - simulator.continueIds.length - simulator.rememberIds.length, 0)}
          />

          <RoundInfo
            title="Done"
            value={simulator.rememberIds.length}
          />

          <RoundInfo
            title="Time"
            value={<span ref={refTimer}>00:00:00</span>}
          />
        </>
      }

      {(process || !simulator) &&
        <>
          <div
            className="bg-gray-900 border border-gray-600 w-16 h-16 rounded-full flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center justify-center gap-2">
              <div className="h-1.5 w-10 bg-slate-700"/>
              <div className="h-1.5 w-8 bg-slate-700"/>
            </div>
          </div>

          <div
            className="bg-gray-900 border border-gray-600 w-16 h-16 rounded-full flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center justify-center gap-2">
              <div className="h-1.5 w-10 bg-slate-700"/>
              <div className="h-1.5 w-8 bg-slate-700"/>
            </div>
          </div>

          <div
            className="bg-gray-900 border border-gray-600 w-16 h-16 rounded-full flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center justify-center gap-2">
              <div className="h-1.5 w-10 bg-slate-700"/>
              <div className="h-1.5 w-8 bg-slate-700"/>
            </div>
          </div>

          <div
            className="bg-gray-900 border border-gray-600 w-16 h-16 rounded-full flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center justify-center gap-2">
              <div className="h-1.5 w-10 bg-slate-700"/>
              <div className="h-1.5 w-8 bg-slate-700"/>
            </div>
          </div>
        </>
      }
    </div>
  )
}
