import ButtonSquare from '@components/ButtonSquare'
import SVGClose from '@public/svg/x.svg'

import { ReactNode, BaseSyntheticEvent } from 'react'

export default function Dialog(
  { title, children, text, onClose }:
  { title: ReactNode, children: ReactNode, text: ReactNode, onClose?: (e: BaseSyntheticEvent) => void },
) {
  return (
    <div className="fixed z-10">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div
          className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          onClick={onClose}
        >

          <ButtonSquare
            icon={SVGClose}
            className="absolute right-4 top-4"
            onClick={(e) => {
              e.stopPropagation()
              if (onClose) {
                onClose(e)
              }
            }}
          />

          <div
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="text-left w-full">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h3>

                  <div className="mt-2 text-sm text-gray-500 w-full">
                    {text}
                  </div>
                </div>
              </div>
            </div>

            {children &&
              <div className="bg-gray-50 px-4 py-3 flex justify-end sm:px-6 gap-2">
                {children}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
