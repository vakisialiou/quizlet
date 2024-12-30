import {ReactNode, useEffect, useRef, useState} from 'react'
import clsx from 'clsx'

export default function Clamp(
  {
    rows,
    title,
    children,
    btnClumpMore,
    btnClumpLess,
    className = ''
  }:
  {
    rows: number
    children: string
    title?: ReactNode
    btnClumpMore: ReactNode
    btnClumpLess: ReactNode
    className?: string
  }
) {
  const [ showMore, setShowMore ] = useState(false)
  const [isClamped, setIsClamped] = useState(false)
  const textRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight)
      const maxHeight = lineHeight * rows
      if (textRef.current.scrollHeight > maxHeight) {
        setIsClamped(true)
      } else {
        setIsClamped(false)
      }
    }
  }, [rows, children])

  return (
    <div
      className={clsx('flex flex-col gap-1', {
        [className]: className
      })}
    >
      {title}

      <div
        ref={textRef}
        className={clsx('whitespace-pre-line', {
          [`line-clamp-1`]: rows === 1 && !showMore,
          [`line-clamp-2`]: rows === 2 && !showMore,
          [`line-clamp-3`]: rows === 3 && !showMore,
          [`line-clamp-4`]: rows === 4 && !showMore,
          [`line-clamp-5`]: rows === 5 && !showMore,
          [`line-clamp-6`]: rows === 6 && !showMore,
        })}
      >
        {children}
      </div>

      <div
        className={clsx('flex justify-end transition-all', {
          ['opacity-0 pointer-events-none']: !isClamped,
          ['opacity-1']: isClamped,
        })}
      >
        <div
          className="flex hover:opacity-90 cursor-pointer text-xs leading-3 text-white/25"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? btnClumpLess : btnClumpMore}
        </div>
      </div>
    </div>
  )
}
