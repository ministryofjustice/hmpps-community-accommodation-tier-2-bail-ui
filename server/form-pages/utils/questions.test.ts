import { getQuestions } from './questions'

describe('getQuestions', () => {
  it('personalises the questions', () => {
    const questions = getQuestions('Roger Smith')

    expect(questions['confirm-eligibility']['confirm-eligibility'].isEligible.question).toEqual(
      'Is the applicant eligible for this service?',
    )
  })
})
