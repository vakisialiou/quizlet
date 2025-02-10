'use client'

import { actionUpdateSimulator, actionShareCreate } from '@store/action-main'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import SimulatorBody from '@containers/Simulator/SimulatorBody'
import FilterRelatedTerm from '@containers/FilterRelatedTerm'
import { actionDeactivate } from '@helper/simulators/actions'
import { getSimulatorById } from '@helper/simulators/general'
import { OrderEnum, TERM_ORDER_DEFAULT } from '@helper/sort'
import Button, { ButtonVariant } from '@components/Button'
import { useShareSelector } from '@hooks/useShapeSelector'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import { useMainSelector } from '@hooks/useMainSelector'
import { ModuleShareEnum } from '@entities/ModuleShare'
import ButtonSquare from '@components/ButtonSquare'
import TitleModule from '@containers/TitleModule'
import SVGFileNew from '@public/svg/file_new.svg'
import ContentPage from '@containers/ContentPage'
import TermFilters from '@entities/TermFilters'
import { getModule } from '@helper/relation'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import SVGPlay from '@public/svg/play.svg'
import Module from '@entities/Module'
import { v4 } from 'uuid'
import Grid from './Grid'
import clsx from 'clsx'

export default function Share() {
  const t = useTranslations('Share')

  const terms = useShareSelector((state) => state.terms)
  const share = useShareSelector((state) => state.share)
  const originModule = useShareSelector((state) => state.module)
  const relationTerms = useShareSelector((state) => state.relationTerms)

  const simulators = useMainSelector((state) => state.simulators)
  const mainModules = useMainSelector((state) => state.modules)

  const [ playModuleId, setPlayModuleId ] = useState<string | null>(v4)
  const [ filter, setFilter ] = useState(new TermFilters().serialize())
  const [ order, setOrder ] = useState<OrderEnum>(TERM_ORDER_DEFAULT)
  const [ study, setStudy ] = useState<boolean>(false)
  const [ search, setSearch ] = useState<string>('')

  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) {
      return
    }

    initRef.current = true

    const tmpModule = new Module().copy(originModule || {}).serialize()

    actionShareCreate({
      terms,
      module: tmpModule,
      relationTerms: relationTerms.map((item) => {
        return { ...item, moduleId: tmpModule.id }
      }),
    })
    setPlayModuleId(tmpModule.id)
  }, [terms, originModule, relationTerms])

  const viewModule = useMemo(() => {
    return playModuleId ? getModule(mainModules, playModuleId) : null
  }, [mainModules, playModuleId])

  const ref = useRef<{ onCreate?: (color?: number) => void }>({})
  const editable = share.access === ModuleShareEnum.editable

  return (
    <ContentPage
      showHeader
      showFooter={!study}
      options={{
        padding: true,
        scrollbarGutter: true,
      }}
      rightControls={(
        <>
          {study &&
            <ButtonSquare
              icon={SVGBack}
              onClick={() => setStudy(false)}
            />
          }
        </>
      )}
      title={(
        <HeaderPageTitle
          title={t('headTitle')}
          search={{
            hidden: study,
            value: search || '',
            placeholder: t('searchPlaceholder'),
            onClear: () => setSearch(''),
            onChange: ({ formattedValue }) => setSearch(formattedValue)
          }}
        />
      )}
      footer={(
        <>
          <div className="flex w-full justify-center text-center">
            <div className="flex gap-2 w-full max-w-96">
              {editable &&
                <Button
                  disabled={!viewModule}
                  className="w-1/2 gap-1"
                  variant={ButtonVariant.WHITE}
                  onClick={() => {
                    if (ref.current?.onCreate) {
                      ref.current?.onCreate(filter.color)
                    }
                  }}
                >
                  <SVGFileNew
                    width={28}
                    height={28}
                  />
                  {t('btnAddTerm')}
                </Button>
              }

              <Button
                disabled={!viewModule}
                variant={ButtonVariant.GREEN}
                className={clsx('gap-1', {
                  ['w-1/2']: editable,
                  ['w-full']: !editable
                })}
                onClick={() => {
                  setStudy(true)
                }}
              >
                <SVGPlay
                  width={28}
                  height={28}
                />
                {t('btnStudyTerm')}
              </Button>
            </div>
          </div>
        </>
      )}
    >
      <TitleModule
        module={viewModule || originModule}
      />

      <FilterRelatedTerm
        className="py-2"
        selectedOrderId={order}
        selectedFilterId={filter.color}
        onFilterSelect={(color) => {
          setFilter({ ...filter, color: color as number })
        }}
        onOrderSelect={(order) => {
          setOrder(order as OrderEnum)
        }}
      />

      <Grid
        ref={ref}
        share={share}
        order={order}
        filter={filter}
        search={search}
        editable={editable}
      />

      {study &&
        <div className="absolute left-0 top-0 w-full h-full z-20 flex justify-center items-center">
          <div className="absolute left-0 top-0 w-full h-full bg-black" />
          <div className="flex flex-col bg-black z-30">
            <SimulatorBody
              editable={false}
              relation={{ moduleId: viewModule?.id }}
              onDeactivateAction={(simulatorId) => {
                const activeSimulator = getSimulatorById(simulators, simulatorId)
                if (activeSimulator) {
                  actionUpdateSimulator({
                    simulator: actionDeactivate(activeSimulator),
                    editable:false
                  })
                }
              }}
            />
          </div>
        </div>
      }
    </ContentPage>
  )
}
