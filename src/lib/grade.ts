// import { ClientSimulatorData } from '@entities/ClientSimulator'
//
// export enum DegreesEnums {
//   bachelor = 'bachelor',
//   master = 'master',
//   doctor = 'doctor',
//   professor = 'professor',
// }
//
// // Simulators: [{ active: false status: done, type: 'flashcard'}, { active: false status: done, type: 'pick'}, { active: false status: done, type: 'input'}, ...]
//
// // DegreesEnums.bachelor (bronze) - 1 simulator { active: false status: done, type: 'flashcard' }
// // DegreesEnums.bachelor (silver) - 2 simulator { active: false status: done, type: 'flashcard' }
// // DegreesEnums.bachelor (gold)   - 3+ simulator { active: false status: done, type: 'flashcard' }
//
// // DegreesEnums.master (bronze) - 1 simulator { active: false status: done, type: 'pick' } && DegreesEnums.bachelor === 1
// // DegreesEnums.master (silver) - 2 simulator { active: false status: done, type: 'pick' } && DegreesEnums.bachelor === 2
// // DegreesEnums.master (gold)   - 3+ simulator { active: false status: done, type: 'pick' } && DegreesEnums.bachelor >= 3
//
// // DegreesEnums.doctor (bronze) - 1 simulator { active: false status: done, type: 'input' } && DegreesEnums.master === 1
// // DegreesEnums.doctor (silver) - 2 simulator { active: false status: done, type: 'input' } && DegreesEnums.master === 2
// // DegreesEnums.doctor (gold)   - 3+ simulator { active: false status: done, type: 'input' } && DegreesEnums.master >= 3
//
// // DegreesEnums.professor (bronze) - 1 simulator { active: false status: done, type: 'input' } && DegreesEnums.flashcard (bronze) === 1 && DegreesEnums.master (bronze) === 1 && DegreesEnums.doctor (bronze) === 1
// // DegreesEnums.professor (silver) - 2 simulator { active: false status: done, type: 'input' } && DegreesEnums.flashcard (silver) === 1 && DegreesEnums.master (silver) === 1 && DegreesEnums.doctor (silver) === 1
// // DegreesEnums.professor (gold)   - 3 simulator { active: false status: done, type: 'input' } && DegreesEnums.flashcard (gold) === 1 && DegreesEnums.master (gold) === 1 && DegreesEnums.doctor (gold) === 1
//
// export const findGrade = (simulators: ClientSimulatorData[]) => {
//   const res = {
//     [DegreesEnums.bachelor]: [],
//     [DegreesEnums.master]: [],
//     [DegreesEnums.doctor]: [],
//     [DegreesEnums.professor]: [],
//   }
//
// }
