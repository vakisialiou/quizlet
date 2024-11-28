import ProgressTracker from '@entities/ProgressTracker'

describe('ProgressTracker', () => {
  it('should return calculated error rate', () => {
    const termIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const weights = { action1: 1, action2: 1.5, action3: 1.8, action4: -0.5 }

    const penalty = new ProgressTracker({ termIds, weights })
    expect(penalty.calculate('action1', 1).getErrorRate()).toBe(2.0833333333333335)
    expect(penalty.calculate('action2', 1).getErrorRate()).toBe(5.208333333333334)
    expect(penalty.calculate('action3', 1).getErrorRate()).toBe(8.958333333333334)
    expect(penalty.calculate('action4', 1).getErrorRate()).toBe(7.916666666666667)
  })

  it('should return calculated percent', () => {
    const termIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const weights = { action1: 1, action2: 1.5, action3: 1.8, action4: -0.5 }

    const penalty = new ProgressTracker({ termIds, weights })
    expect(penalty.calculate('action1', 1).getProgress()).toBe(97.91666666666667)
    expect(penalty.calculate('action2', 1).getProgress()).toBe(94.79166666666667)
    expect(penalty.calculate('action3', 1).getProgress()).toBe(91.04166666666667)
    expect(penalty.calculate('action4', 1).getProgress()).toBe(92.08333333333333)
  })
})
