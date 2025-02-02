import clsx from 'clsx'

export default function Signature(
  {
    inverted,
    signature,
    className = '',
  }:
  {
    inverted?: boolean
    className?: string
    signature: string | null
  }
) {
  return (
    <div
      className={clsx('flex w-full items-center justify-between py-2 px-3 text-gray-700/50 uppercase font-bold text-[10px]', {
        [className]: className
      })}
    >
      {signature &&
        <span>{signature}</span>
      }

      {inverted &&
        <span>inversion</span>
      }
    </div>
  )
}
