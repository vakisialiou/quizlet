import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import SVGPanelClose from '@public/svg/panel_close.svg'
import SVGLoopBack from '@public/svg/loop_back.svg'
import SVGMuteOn from '@public/svg/mute_ipo_on.svg'
import SVGHelp from '@public/svg/help.svg'
import Button from '@components/Button'
import React from 'react'
import clsx from 'clsx'

export type PanelControlOption = {
  disabled?: boolean,
  active?: boolean
}

export type PanelControlOptions = {
  deactivate?: PanelControlOption,
  sound?: PanelControlOption
  back?: PanelControlOption,
  help?: PanelControlOption,
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
     disabled: !simulator || options.deactivate?.disabled || simulator.status !== SimulatorStatus.PROCESSING,
     active: !!options.deactivate?.active
    },
    back: {
      disabled: !simulator || options.back?.disabled || (simulator.status !== SimulatorStatus.PROCESSING || simulator.historyIds.length === 0),
      active: !!options.back?.active
    },
    sound: {
      disabled: !simulator || options.sound?.disabled || simulator.status !== SimulatorStatus.PROCESSING,
      active: !!options.sound?.active
    },
    help: {
      disabled: !simulator || options.help?.disabled || simulator.status !== SimulatorStatus.PROCESSING,
      active: !!options.help?.active
    }
  }

  return (
    <div
      className={clsx('flex flex-col items-center gap-2', {
        [className]: className
      })}
    >
      <Button
        active={controls.deactivate.active}
        disabled={process || controls.deactivate.disabled}
        onClick={() => onClick('deactivate')}
      >
        <SVGPanelClose
          width={24}
          height={24}
          className={clsx('text-gray-400', {
            ['text-gray-600']: controls.deactivate.disabled
          })}
        />
      </Button>

      <Button
        active={controls.back.active}
        disabled={process || controls.back.disabled}
        onClick={() => onClick('back')}
      >
        <SVGLoopBack
          width={24}
          height={24}
          className={clsx('text-gray-400', {
            ['text-gray-600']: controls.back.disabled
          })}
        />
      </Button>

      <Button
        active={controls.help.active}
        disabled={process || controls.help.disabled}
        onClick={() => onClick('help')}
      >
        <SVGHelp
          width={24}
          height={24}
          className={clsx('text-gray-400', {
            ['text-gray-600']: controls.help.disabled
          })}
        />
      </Button>

      <Button
        active={controls.sound.active}
        disabled={process || controls.sound.disabled}
        onClick={() => onClick('sound')}
      >
        <SVGMuteOn
          width={24}
          height={24}
          className={clsx('text-gray-400', {
            ['text-gray-600']: controls.sound.disabled
          })}
        />
      </Button>
    </div>
  )
}
