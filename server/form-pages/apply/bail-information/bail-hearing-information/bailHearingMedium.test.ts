import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import BailHearingMedium from './bailHearingMedium'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'
import { getQuestions } from '../../../utils/questions'

describe('BailHearingMedium', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const questions = getQuestions('Roger Smith')['bail-hearing-information']['bail-hearing-medium']

  itShouldHavePreviousValue(new BailHearingMedium({}, application), 'bail-hearing-date')
  itShouldHaveNextValue(new BailHearingMedium({}, application), '')

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new BailHearingMedium({ bailHearingMedium: 'judgeInChambers' }, application)

      expect(page.items()).toEqual([
        {
          value: 'inCourt',
          text: questions.bailHearingMedium.answers.inCourt,
          checked: false,
        },
        {
          value: 'videoLink',
          text: questions.bailHearingMedium.answers.videoLink,
          checked: false,
        },
        {
          value: 'judgeInChambers',
          text: questions.bailHearingMedium.answers.judgeInChambers,
          checked: true,
        },
      ])
    })
  })
})
