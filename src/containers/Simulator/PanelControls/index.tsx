import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import SVGPanelClose from '@public/svg/panel_close.svg'
import SVGLoopBack from '@public/svg/loop_back.svg'
import SVGMuteOn from '@public/svg/mute_ipo_on.svg'
import Button from '@components/Button'
import React from 'react'
import clsx from 'clsx'

export type PanelControlOption = {
  disabled: boolean
}

export type PanelControlOptions = {
  deactivate?: PanelControlOption,
  sound?: PanelControlOption
  back?: PanelControlOption,
}

export default function PanelControls(
  {
    simulator,
    process = false,
    onClick,
    className = '',
    options = {}
  }:
  {
    process?: boolean,
    onClick: (name: string) => void,
    simulator?: ClientSimulatorData | null,
    className?: string,
    options?: Partial<PanelControlOptions>
  }
) {
  const controls = {
    deactivate: {
     disabled: !simulator || options.deactivate?.disabled || simulator.status === SimulatorStatus.WAITING
    },
    back: {
      disabled: !simulator || options.back?.disabled || (simulator.status !== SimulatorStatus.PROCESSING || simulator.historyIds.length === 0)
    },
    sound: {
      disabled: !simulator || options.sound?.disabled || simulator.status !== SimulatorStatus.PROCESSING
    }
  }

  const showSkeleton = process || !simulator

  return (
    <div
      className={clsx('flex flex-col items-center gap-1', {
        [className]: className
      })}
    >
      <Button
        disabled={process || controls.deactivate.disabled}
        onClick={() => onClick('deactivate')}
      >
        {!showSkeleton &&
          <SVGPanelClose
            width={24}
            height={24}
            className={clsx('text-gray-400', {
              ['text-gray-600']: controls.deactivate.disabled
            })}
          />
        }

        {showSkeleton &&
          <div className="animate-pulse flex">
            <div className="h-6 w-6 bg-slate-700" />
          </div>
        }
      </Button>

      <Button
        disabled={process || controls.back.disabled}
        onClick={() => onClick('back')}
      >
        {!showSkeleton &&
          <SVGLoopBack
            width={24}
            height={24}
            className={clsx('text-gray-400', {
              ['text-gray-600']: controls.back.disabled
            })}
          />
        }

        {showSkeleton &&
          <div className="animate-pulse flex">
            <div className="h-6 w-6 bg-slate-700" />
          </div>
        }
      </Button>

      <Button
        disabled={process || controls.sound.disabled}
        onClick={() => onClick('sound')}
      >
        {!showSkeleton &&
          <SVGMuteOn
            width={24}
            height={24}
            className={clsx('text-gray-400', {
              ['text-gray-600']: controls.sound.disabled
            })}
          />
        }

        {showSkeleton &&
          <div className="animate-pulse flex">
            <div className="h-6 w-6 bg-slate-700" />
          </div>
        }
      </Button>
    </div>
  )
}
