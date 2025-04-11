import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import BailHearingDate, { BailHearingDateBody } from './bailHearingDate'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'

describe('BailHearingDate', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHavePreviousValue(new BailHearingDate({}, application), 'taskList')
  itShouldHaveNextValue(new BailHearingDate({}, application), 'court-name')

  describe('response', () => {
    describe('when a date is provided', () => {
      const body: BailHearingDateBody = {
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

    describe('when a date is not provided', () => {
      const body: BailHearingDateBody = {
        'bailHearingDate-month': '',
        'bailHearingDate-year': '',
        'bailHearingDate-day': '',
      }

      it('returns an empty string', () => {
        const page = new BailHearingDate(body, application)
        expect(page.response()).toEqual({
          "When is Roger Smith's bail hearing?": '',
        })
      })
    })
  })
})
