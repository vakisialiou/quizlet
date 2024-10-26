import React, { BaseSyntheticEvent } from 'react'

export default function Button(
  { children, onClick }:
  { children: React.ReactNode, onClick: (e: BaseSyntheticEvent) => void }
) {

  return (
    <div
      onClick={onClick}
      className="border bg-blue-700 hover:bg-blue-800 active:bg-blue-900 px-3.5 py-1 cursor-pointer select-none rounded-md transition-colors"
    >
      {children}
    </div>
  )
}
