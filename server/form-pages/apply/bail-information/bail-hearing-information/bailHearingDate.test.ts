import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import BailHearingDate, { BailHearingDateBody } from './bailHearingDate'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'

describe('BailHearingDate', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHavePreviousValue(new BailHearingDate({}, application), 'court-name')
  itShouldHaveNextValue(new BailHearingDate({}, application), 'bail-hearing-medium')

  describe('response', () => {
    const body: BailHearingDateBody = {
      bailHearingDate: '2024-03-27',
      'bailHearingDate-month': '10',
      'bailHearingDate-year': '2023',
      'bailHearingDate-day': '01',
    }

    it('returns the hearing date', () => {
      const page = new BailHearingDate(body, application)
      expect(page.response()).toEqual({
        "When is Roger Smith's bail hearing?": '1 October 2023',
      })
    })
  })
})