import {SimulatorData, SimulatorStatus} from '@entities/Simulator'
import SVGPanelClose from '@public/svg/panel_close.svg'
import SVGLoopBack from '@public/svg/loop_back.svg'
import ButtonSquare from '@components/ButtonSquare'
import React from 'react'
import clsx from 'clsx'

export type PanelControlOption = {
  disabled?: boolean,
  active?: boolean
}

export type PanelControlOptions = {
  deactivate?: PanelControlOption,
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
    process?: boolean
    onClick: (name: string) => void
    simulator?: SimulatorData | null
    className?: string
    options?: Partial<PanelControlOptions>
  }
) {
  const controls = {
    deactivate: {
     disabled: !simulator || options.deactivate?.disabled || simulator.status !== SimulatorStatus.PROCESSING,
     active: !!options.deactivate?.active
    },
    back: {
      disabled: !simulator || options.back?.disabled || (simulator.status !== SimulatorStatus.PROCESSING || simulator.historyIds.length === 0),
      active: !!options.back?.active
    },
  }

  return (
    <div
      className={clsx('flex w-full justify-between items-center gap-2', {
        [className]: className
      })}
    >
      <div className="flex gap-2">
        <ButtonSquare
          icon={SVGPanelClose}
          onClick={() => onClick('deactivate')}
          disabled={process || controls.deactivate.disabled}
        />
      </div>

      <div className="flex gap-2">
        <ButtonSquare
          size={24}
          icon={SVGLoopBack}
          onClick={() => onClick('back')}
          disabled={process || controls.back.disabled}
        />
      </div>
    </div>
  )
}
