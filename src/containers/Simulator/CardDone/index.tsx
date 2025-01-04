import React, { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react'
import { ClientSimulatorData } from '@entities/Simulator'
import AchievementDegree from '@containers/AchievementDegree'
import AchievementIcon from '@containers/AchievementIcon'
import { actionDeactivateSimulators } from '@store/index'
import { ClientFolderData } from '@entities/Folder'
import AchievementText from '@containers/AchievementText'
import CardEmpty from '@containers/Simulator/CardEmpty'
import Achievement from '@entities/Achievement'
import clsx from 'clsx'

const randFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export default function CardDone(
  {
    folder,
    editable,
    simulator,
    particlesImage,
    particlesCount = 24,
    particleColumns = 4,
    particlesDelay = 3000,
    particlesSpreading = 200,
    particlesDuration = { min: 1000, max: 1500 },
    onAnimationDone
  }:
  {
    editable: boolean
    folder: ClientFolderData
    simulator: ClientSimulatorData
    particlesImage?: string
    particlesCount?: number
    particlesDelay?: number
    particleColumns?: number
    particlesSpreading?: number
    particlesDuration?: { min: number; max: number }
    onAnimationDone?: () => void
  }
) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [ exploded, setExploded ] = useState(false)
  const [ containerSize, setContainerSize ] = useState({ width: 0, height: 0 })

  const tiles = useMemo(() => {
    return Array.from({ length: particlesCount }, () => {
      const duration = randFloat(particlesDuration.min, particlesDuration.max)
      const delay = randFloat(duration / 10, duration / 2)
      return {
        delay,
        duration: duration - delay,
        directionX: (Math.random() * 2 - 1) * particlesSpreading,
        directionY: (Math.random() * 2 - 1) * particlesSpreading,
      }
    })
  }, [ particlesCount, particlesDuration, particlesSpreading ])

  const rows = Math.ceil(tiles.length / particleColumns)

  useLayoutEffect(() => {
    if (ref.current) {
      setContainerSize({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      })
    }

    const timer = setTimeout(() => {
      setExploded(true)
    }, particlesDelay)

    return () => clearTimeout(timer)
  }, [particlesDelay])

  const simulators = useMemo(() => {
    return [...folder.simulators || []].map((item) => {
      return {
        ...item,
        active: item.id === simulator.id ? false : item.active
      }
    })
  }, [folder.simulators, simulator.id])

  const virtualFolder = useMemo(() => {
    const degreeRate = new Achievement().getRate(simulators)
    return { ...folder, degreeRate }
  }, [folder, simulators])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onAnimationDone) {
        onAnimationDone()
      }

      actionDeactivateSimulators({ folderId: folder.id, degreeRate: virtualFolder.degreeRate, editable })

    }, particlesDelay + particlesDuration.max)

    return () => clearTimeout(timer)
  }, [onAnimationDone, particlesDelay, particlesDuration.max, folder.id, virtualFolder.degreeRate])

  return (
    <CardEmpty
      classNameContent={clsx('relative', {
        ['overflow-hidden']: !exploded
      })}
    >
      <div
        ref={ref}
        data-attr="container"
        className={clsx('absolute left-0 top-0 w-full h-full')}
      >
        {tiles.map(({duration, delay, directionX, directionY}, index) => {
          const width = containerSize.width / particleColumns
          const height = containerSize.height / rows

          const left = (index % particleColumns) * width
          const top = Math.floor(index / particleColumns) * height

          return (
            <div
              key={index}
              className="absolute will-change-contents"
              style={{
                top: `${top}px`,
                left: `${left}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundRepeat: 'no-repeat',
                backgroundImage: particlesImage,
                backgroundPosition: `${-left}px ${-top}px`,
                transform: exploded
                  ? `translate(${directionX}px, ${directionY}px) scale3d(0, 0, 0)`
                  : `translate(0, 0) scale3d(1, 1, 1)`,
                backgroundSize: `${containerSize.width}px ${containerSize.height}px`,

                transition: exploded ? `transform ${duration}ms ease ${delay}ms` : undefined,
              } as React.CSSProperties}
            />
          )
        })}
      </div>

      <div
        className="absolute left-0 top-0 w-full h-full flex flex-col items-center gap-4 py-4"
        style={{
          opacity: exploded ? `0` : `1`,
          transition: `opacity ${particlesDuration.min}ms ease`,
        }}
      >
        <div className="h-[140px] w-full flex items-center justify-center mt-4">
          <AchievementIcon
            size={72}
            showDefault
            folder={virtualFolder}
          />
        </div>

        <AchievementDegree
          disableTruncate
          folder={virtualFolder}
          className="flex flex-col gap-2 font-bold text-4xl items-center text-gray-600 uppercase"
        />

        <AchievementText
          folder={virtualFolder}
          className="text-gray-100 text-base font-bold px-4 mt-10"
        />

      </div>
    </CardEmpty>
  )
}
