import SVGOffline from '@public/svg/offline.svg'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'

export default function Offline({ className = '' }: { className?: string }) {
  const t = useTranslations('Offline')
  return (
    <div
      className={clsx('flex flex-col gap-14 items-center justify-center', {
        [className]: className
      })}
    >
      <SVGOffline
        width={48}
        height={48}
        className="text-gray-400"
      />

      <div className="text-base text-gray-300 text-center">
        <span dangerouslySetInnerHTML={{__html: t('warn')}}/>
      </div>
    </div>
  )
}
