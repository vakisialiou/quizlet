import { ClientSimulatorData } from '@entities/ClientSimulator'
import RoundInfo from '@components/RoundInfo'
import { getDuration } from '@lib/date'
import clsx from 'clsx'
import React from "react";

export default function PanelInfo(
  { process = false, simulator, className = '' }:
  { process?: boolean, simulator?: ClientSimulatorData | null, className?: string }
) {
  return (
    <div
      className={clsx('flex items-center justify-between select-none gap-2 h-16', {
        [className]: className
      })}
    >
      {(!process && simulator) &&
        <>
          <RoundInfo
            title="Terms"
            value={simulator.termIds.length}
          />

          <RoundInfo
            title="Queue"
            value={Math.max(simulator.termIds.length - simulator.continueIds.length - simulator.rememberIds.length - 1, 0)}
          />

          <RoundInfo
            title="Done"
            value={simulator.rememberIds.length}
          />

          <RoundInfo
            title="Time"
            value={getDuration(simulator.duration)}
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
