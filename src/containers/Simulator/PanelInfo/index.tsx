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

  const termIds = simulator && !process ? simulator?.termIds : []
  const continueIds = simulator && !process ? simulator?.continueIds : []
  const rememberIds = simulator && !process ? simulator?.rememberIds : []

  return (
    <div
      className={clsx('flex items-center justify-between select-none gap-2', {
        [className]: className
      })}
    >
      <RoundInfo
        title="Total"
        value={termIds.length}
      />

      <RoundInfo
        title="Wait"
        value={Math.max(termIds.length - continueIds.length - rememberIds.length, 0)}
      />

      <RoundInfo
        title="Done"
        value={rememberIds.length}
      />

      <RoundInfo
        title="Time"
        value={<span ref={refTimer}>00:00:00</span>}
      />
    </div>
  )
}
