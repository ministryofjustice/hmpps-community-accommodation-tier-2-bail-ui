import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../../testutils/factories/index'
import CurrentOffenceData, { CurrentOffenceDataBody } from './currentOffenceData'

describe('CurrentOffenceData', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const currentOffenceData = [
    {
      titleAndNumber: 'Stalking',
      offenceCategory: 'Arson',
      'offenceDate-day': '1',
      'offenceDate-month': '2',
      'offenceDate-year': '2023',
      sentenceLength: '12 months',
      summary: 'summary detail',
    },
  ]

  describe('title', () => {
    it('has a page title', () => {
      const page = new CurrentOffenceData({}, application)

      expect(page.title).toEqual(`Add Roger Smith's current offence details`)
    })
  })
  describe('Routing', () => {
    itShouldHaveNextValue(new CurrentOffenceData({}, application), 'current-offences')
    itShouldHavePreviousValue(new CurrentOffenceData({}, application), 'taskList')
    itShouldHavePreviousValue(
      new CurrentOffenceData({}, { ...application, data: { 'current-offences': { 'current-offence-data': [] } } }),
      'current-offences',
    )
  })

  describe('errors', () => {
    describe('when there are no errors', () => {
      it('returns empty object', () => {
        const page = new CurrentOffenceData(currentOffenceData[0], application)
        expect(page.errors()).toEqual({})
      })
    })

    describe('when there are errors', () => {
      const requiredFields = [
        ['titleAndNumber', 'Enter the offence title'],
        ['offenceCategory', 'Select the offence type'],
        ['offenceDate', 'Enter the date the offence was committed'],
        ['sentenceLength', 'Enter the sentence length'],
        ['summary', 'Enter a summary of the offence'],
      ]

      it.each(requiredFields)('it includes a validation error for %s', (field, message) => {
        const page = new CurrentOffenceData({ offenceCategory: 'choose' }, application)
        const errors = page.errors()

        expect(errors[field as keyof CurrentOffenceDataBody]).toEqual(message)
      })
    })

    describe('response', () => {
      it('returns empty object', () => {
        const page = new CurrentOffenceData({}, application)
        expect(page.response()).toEqual({})
      })
    })
  })
})
