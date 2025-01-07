import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../../testutils/factories/index'
import AllegedOffenceData from './allegedOffenceData'

describe('AllegedOffenceData', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const allegedOffenceData = [
    {
      titleAndNumber: 'Stalking',
      offenceCategory: 'Arson',
      'offenceDate-day': '1',
      'offenceDate-month': '2',
      'offenceDate-year': '2023',
      summary: 'summary detail',
    },
  ]

  describe('title', () => {
    it('has a page title', () => {
      const page = new AllegedOffenceData({}, application)

      expect(page.title).toEqual(`Add Roger Smith's alleged offence details`)
    })
  })

  itShouldHaveNextValue(new AllegedOffenceData({}, application), 'alleged-offences')
  itShouldHavePreviousValue(new AllegedOffenceData({}, application), 'alleged-offences')

  describe('errors', () => {
    describe('when there are no errors', () => {
      it('returns empty object', () => {
        const page = new AllegedOffenceData(allegedOffenceData[0], application)
        expect(page.errors()).toEqual({})
      })
    })

    describe('when there are errors', () => {
      const requiredFields = [
        ['titleAndNumber', 'Enter the offence title'],
        ['offenceCategory', 'Select the offence type'],
        ['offenceDate', 'Enter the date the offence was committed'],
        ['summary', 'Enter a summary of the offence'],
      ]

      it.each(requiredFields)('it includes a validation error for %s', (field, message) => {
        const page = new AllegedOffenceData({ offenceCategory: 'choose' }, application)
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
