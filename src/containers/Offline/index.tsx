import { useTranslations } from 'next-intl'

export default function Offline() {
  const t = useTranslations('Offline')
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="text-2xl text-gray-500 text-center">
        <span dangerouslySetInnerHTML={{ __html: t('warn') }} />
      </div>
    </div>
  )
}
