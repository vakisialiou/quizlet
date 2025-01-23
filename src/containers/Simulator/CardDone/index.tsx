import { actionUpdateSimulator, actionUpdateFolder, actionUpdateModule } from '@store/action-main'
import { RelationProps, findSimulators, getFolder, getModule } from '@helper/relation'
import React, { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react'
import AchievementDegree from '@containers/AchievementDegree'
import { actionDeactivate } from '@helper/simulators/actions'
import AchievementIcon from '@containers/AchievementIcon'
import AchievementText from '@containers/AchievementText'
import { useMainSelector } from '@hooks/useMainSelector'
import CardEmpty from '@containers/Simulator/CardEmpty'
import { SimulatorData } from '@entities/Simulator'
import Achievement from '@entities/Achievement'
import clsx from 'clsx'

const randFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export default function CardDone(
  {
    relation,
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
    relation: RelationProps
    simulator: SimulatorData
    particlesImage?: string
    particlesCount?: number
    particlesDelay?: number
    particleColumns?: number
    particlesSpreading?: number
    particlesDuration?: { min: number; max: number }
    onAnimationDone?: () => void
  }
) {
  const relationSimulators = useMainSelector(({ relationSimulators }) => relationSimulators)
  const simulators = useMainSelector(({ simulators }) => simulators)
  const folders = useMainSelector(({ folders }) => folders)
  const modules = useMainSelector(({ modules }) => modules)

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

  const relatedSimulators = useMemo(() => {
    return findSimulators(relationSimulators, simulators, relation)
      .map((item) => {
        const active = item.id === simulator.id ? false : item.active
        return { ...item, active }
      })
  }, [relationSimulators, simulators, relation, simulator.id])

  const virtualDegreeRate = useMemo(() => {
    return new Achievement().getRate(relatedSimulators)
  }, [relatedSimulators])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onAnimationDone) {
        onAnimationDone()
      }

      if (relation.moduleId) {
        const course = getModule(modules, relation.moduleId)
        if (course) {
          actionUpdateModule({module: {...course, degreeRate: virtualDegreeRate}, editable, editId: null}, () => {
            actionUpdateSimulator({
              simulator: actionDeactivate(simulator),
              editable
            })
          })
        }
      } else if (relation.folderId) {
        const folder = getFolder(folders, relation.folderId)
        if (folder) {
          actionUpdateFolder({folder: {...folder, degreeRate: virtualDegreeRate}, editable, editId: null}, () => {
            actionUpdateSimulator({
              simulator: actionDeactivate(simulator),
              editable
            })
          })
        }
      }

    }, particlesDelay + particlesDuration.max)

    return () => clearTimeout(timer)
  }, [onAnimationDone, particlesDelay, particlesDuration.max, folders, modules, virtualDegreeRate, simulator, editable, relation])

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
            degreeRate={virtualDegreeRate}
          />
        </div>

        <AchievementDegree
          disableTruncate
          degreeRate={virtualDegreeRate}
          className="flex flex-col gap-2 font-bold text-4xl items-center text-gray-600 uppercase"
        />

        <AchievementText
          degreeRate={virtualDegreeRate}
          className="text-gray-100 text-base font-bold px-4 mt-10"
        />

      </div>
    </CardEmpty>
  )
}
