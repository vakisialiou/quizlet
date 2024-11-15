
export default function RoundInfo({ title, value }: { title?: string, value?: string | number }) {
  return (
    <div
      className="flex rounded-full items-center justify-center bg-gray-900 border border-gray-600 w-16 h-16"
    >
      <div className="flex flex-col items-center text-xs">
        {title &&
          <span className="uppercase text-gray-600">
            {title}
          </span>
        }

        {value &&
          <span>
            {value}
          </span>
        }
      </div>
    </div>
  )
}
