import clsx from 'clsx'

export default function Divide(
  {
    vertical = false,
    className = ''
  }:
  {
    className?: string
    vertical?: boolean
  }
) {
  return (
    <div
      className={clsx('flex flex-col', {
        ['divide-x w-[1px]']: vertical,
        ['divide-y h-[1px]']: !vertical,
        [className || '']: className
      })}
    >
      <div
        className={clsx('', {
          ['h-full w-[1px]']: vertical,
          ['w-full h-[1px]']: !vertical,
        })}
      />
      <div
        className={clsx('', {
          ['h-full w-[1px]']: vertical,
          ['w-full h-[1px]']: !vertical,
        })}
      />
    </div>
  )
}
