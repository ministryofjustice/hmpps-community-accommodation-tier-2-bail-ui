import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../../testutils/factories/index'
import AllegedOffenceData from './allegedOffenceData'

describe('AllegedOffenceData', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const allegedOffenceData = [
    {
      offenceName: 'Stalking',
      'offenceDate-day': '1',
      'offenceDate-month': '2',
      'offenceDate-year': '2023',
    },
  ]

  describe('title', () => {
    it('has a page title', () => {
      const page = new AllegedOffenceData({}, application)

      expect(page.title).toEqual(`Add Roger Smith's current alleged offences`)
    })
  })

  itShouldHaveNextValue(new AllegedOffenceData({}, application), 'alleged-offences')
  itShouldHavePreviousValue(new AllegedOffenceData({}, application), 'taskList')

  describe('errors', () => {
    describe('when there are no errors', () => {
      it('returns empty object', () => {
        const page = new AllegedOffenceData(allegedOffenceData[0], application)
        expect(page.errors()).toEqual({})
      })
    })

    describe('when there are errors', () => {
      const requiredFields = [
        ['offenceName', 'Enter the name of the current alleged offence'],
        ['offenceDate', 'Enter when the alleged offence took place'],
      ]

      it.each(requiredFields)('it includes a validation error for %s', (field, message) => {
        const page = new AllegedOffenceData({}, application)
        const errors = page.errors()

        expect(errors[field as keyof typeof errors]).toEqual(message)
      })
    })

    describe('response', () => {
      it('returns empty object', () => {
        const page = new AllegedOffenceData({}, application)
        expect(page.response()).toEqual({})
      })
    })
  })
})
