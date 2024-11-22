import SVGCheckmark from '@public/svg/checkmark.svg'
import SVGQuestion from '@public/svg/question.svg'
import SVGError from '@public/svg/error.svg'

import { ReactNode } from 'react'

export enum DialogType {
  success = 'success',
  warning = 'warning',
  error = 'error',
}

export default function Dialog(
  { type, title, children, text }:
  { type?: string, title: ReactNode, children: ReactNode, text: ReactNode },
) {
  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-800/75 transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div
          className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >

          <div
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                {type === DialogType.error &&
                  <div
                    className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0"
                  >
                    <SVGError
                      width={24}
                      height={24}
                      className="text-red-500"
                    />
                  </div>
                }

                {type === DialogType.success &&
                  <div
                    className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0"
                  >
                    <SVGCheckmark
                      width={24}
                      height={24}
                      className="text-green-500"
                    />
                  </div>
                }

                {type === DialogType.warning &&
                  <div
                    className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0"
                  >
                    <SVGQuestion
                      width={24}
                      height={24}
                      className="text-amber-500"
                    />
                  </div>
                }

                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold text-gray-900">
                    {title}
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
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
