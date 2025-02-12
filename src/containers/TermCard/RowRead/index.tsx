import SVGMuteOff from '@public/svg/mute_ipo_off.svg'
import SVGMuteOn from '@public/svg/mute_ipo_on.svg'
import ButtonSquare from '@components/ButtonSquare'
import { ReactNode } from 'react'

export default function RowReadonly({
  value,
  placeholder,
  lang,
  controls,
  soundPlaying,
  onClickSound
}: {
  value?: string,
  placeholder: ReactNode,
  lang: string,
  controls?: ReactNode,
  soundPlaying?: boolean,
  onClickSound: (play: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between w-full max-w-full overflow-hidden">
      <div
        title={value || ''}
        className="inline w-full content-center px-[9px] pt-[1px] h-8 text-sm text-gray-200 truncate ..."
      >
        {value || placeholder}
      </div>

      <div>
        {value &&
          <ButtonSquare
            iconSize={20}
            icon={soundPlaying ? SVGMuteOn : SVGMuteOff}
            onClick={() => onClickSound(!soundPlaying)}
          />
        }
      </div>

      <div className="w-6 min-w-6 mr-1 text-center text-xs text-gray-400 font-semibold uppercase">{lang}</div>

      {controls &&
      <div className="flex w-[32px] min-w-[32px] h-[32px] gap-2 items-center">
        {controls}
      </div>}
    </div>
  )
}
