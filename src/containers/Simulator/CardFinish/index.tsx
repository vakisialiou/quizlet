import {actionUpdateSimulator} from '@store/action-main'
import {actionRestart} from '@helper/simulators/actions'
import CardEmpty from '@containers/Simulator/CardEmpty'
import {SimulatorData} from '@entities/Simulator'
import {useTranslations} from 'next-intl'
import Button, {ButtonVariant} from '@components/Button'

export default function CardFinish(
  {
    editable,
    simulator
  }:
  {
    editable: boolean,
    simulator: SimulatorData,
  }
) {
  const t = useTranslations('Simulators')
  return (
    <CardEmpty
      classNameContent="p-6"
    >

      <div className="text-xl font-bold text-white/75 mb-4">
        {t('cardFinishTitle')}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-sm text-white/50 px-4">
          {t('cardFinishText1')}
        </div>

        <div className="text-sm text-white/50 px-4">
          {t('cardFinishText2')}
        </div>
      </div>

      <Button
        className="w-full px-4"
        variant={ButtonVariant.GREEN}
        onClick={() => {
          actionUpdateSimulator({
            editable,
            simulator: actionRestart(simulator)
          })
        }}
      >
        {t('cardFinishBtn')}
      </Button>
    </CardEmpty>
  )
}
