import { ReactNode, useMemo } from 'react'
import clsx from 'clsx'

export type TabIdType = string | number

export type TabType = {
  id: TabIdType,
  name: string | number | ReactNode,
  content?: string | number | ReactNode,
  contentCallback?: () => (string | number | ReactNode),
}

export default function Tabs(
  {
    tabs,
    active,
    onSelect,
    className = '',
  }:
  {
    tabs: TabType[]
    active: TabIdType
    className?: string
    onSelect: (tab: TabType) => void
  }
) {
  const activeTab = useMemo(() => {
    return tabs.find((tab) => tab.id === active)
  }, [tabs, active])

  const activeTabContent = useMemo(() => {
    return activeTab?.contentCallback ? activeTab.contentCallback() : activeTab?.content
  }, [activeTab])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 border-b border-white/25 px-1">
        {tabs.map((tab) => {
          return (
            <div
              key={tab.id}
              onClick={() => {
                if (tab.id !== activeTab?.id) {
                  onSelect(tab)
                }
              }}
              className={clsx('relative flex items-center justify-center', {
                ['bg-black font-medium select-none']: true,
                ['h-8 min-w-8 px-4']: true,

                ['cursor-pointer text-white/50']: tab.id !== activeTab?.id,
                ['cursor-default text-white/75']: tab.id === activeTab?.id
              })}
            >
              <div
                className={clsx('absolute left-0 top-0 z-0', {
                  ['w-full h-full']: true,
                  ['rounded-t']: true,
                  ['border-l border-t border-r']: true,
                  ['cursor-pointer border-white/15 bg-black hover:bg-white/10']: tab.id !== activeTab?.id,
                  ['cursor-default border-white/25 bg-white/15']: tab.id === activeTab?.id
                })}
              />
              <div className="z-10 pointer-events-none">{tab.name}</div>

            </div>
          )
        })}
      </div>

      <div
        className={clsx('flex flex-col w-full', {
          [className]: className
        })}
      >
        {activeTabContent}
      </div>
    </div>
  )
}
