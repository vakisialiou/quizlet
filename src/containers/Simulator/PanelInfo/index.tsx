import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import RoundInfo from '@components/RoundInfo'
import { useTranslations } from 'next-intl'
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
        return
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

  const t = useTranslations('Simulators')

  return (
    <div
      className={clsx('flex items-center justify-between select-none gap-2', {
        [className]: className
      })}
    >
      <RoundInfo
        title={t('simulatorPanelTotal')}
        value={termIds.length}
      />

      <RoundInfo
        title={t('simulatorPanelWait')}
        value={Math.max(termIds.length - continueIds.length - rememberIds.length, 0)}
      />

      <RoundInfo
        title={t('simulatorPanelDone')}
        value={rememberIds.length}
      />

      <RoundInfo
        title={t('simulatorPanelTime')}
        value={<span key={simulator?.id || 0} ref={refTimer}>00:00:00</span>}
      />
    </div>
  )
}
