import { DegreeEnum, MedalEnum } from '@entities/Achievement'
import { ClientFolderData } from '@entities/ClientFolder'
import Achievement from '@entities/Achievement'

const DegreeIconMap: Record<DegreeEnum, string> = {
  [DegreeEnum.preschool]: '🧸',
  [DegreeEnum.primary]: '✏️',
  [DegreeEnum.secondary]: '📚',
  [DegreeEnum.student]: '📖',
  [DegreeEnum.bachelor]: '🎓',
  [DegreeEnum.master]: '📜',
  [DegreeEnum.doctor]: '🔬',
  [DegreeEnum.professor]: '👩‍🏫',
}

const MedalIconMap: Record<MedalEnum, string> = {
  [MedalEnum.bronze]: '🥉',
  [MedalEnum.silver]: '🥈',
  [MedalEnum.gold]: '🥇',
}

export default function Achievements({ folder }: { folder?: ClientFolderData }) {
  const achievements = new Achievement().calculate(folder?.simulators || [])

  const degreeIcon = achievements.degree ? DegreeIconMap[achievements.degree] : null
  if (!degreeIcon) {
    return
  }

  const medalIcon = achievements.medal ? MedalIconMap[achievements.medal] : null
  return (
    <div className="flex gap-2 p-2 items-center">
      <div className="relative w-16 flex gap-2">
        <div className="text-4xl w-full h-full flex items-start justify-start">
          {degreeIcon}
        </div>

        {medalIcon &&
          <div
            className="absolute w-6 h-6 right-2 top-5 text-xs rounded-full bg-gray-900 shadow-inner shadow-gray-500/50 flex items-center justify-center">
            {medalIcon}
          </div>
        }
      </div>
      <div className="flex flex-col text-xl font-bold capitalize">
        {achievements.degree}
      </div>
    </div>
  )
}
