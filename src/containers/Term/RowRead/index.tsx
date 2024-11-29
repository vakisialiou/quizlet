import { ReactNode } from 'react'

export default function RowReadonly({ value, placeholder, lang, controls }: { value?: string, placeholder: string, lang: string, controls?: ReactNode }) {
  return (
    <div className="flex items-center gap-1 justify-between w-full max-w-full overflow-hidden">
      <div
        title={value || ''}
        className="inline w-full content-center px-[9px] pt-[1px] h-8 text-sm text-gray-400 truncate ..."
      >
        {value || <span className="text-gray-500">{placeholder}</span>}
      </div>

      <div className="w-6 min-w-6 mr-1 text-center text-xs text-gray-400 font-semibold uppercase">{lang}</div>

      {controls &&
      <div className="flex w-[32px] min-w-[32px] h-[32px] gap-2 items-center">
        {controls}
      </div>}
    </div>
  )
}
