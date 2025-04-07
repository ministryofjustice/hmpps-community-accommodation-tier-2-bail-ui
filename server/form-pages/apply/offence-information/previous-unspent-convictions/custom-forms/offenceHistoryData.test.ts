import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../../testutils/factories/index'
import OffenceHistoryData, { OffenceHistoryDataBody } from './offenceHistoryData'

describe('OffenceHistoryData', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const offenceHistoryData: OffenceHistoryDataBody[] = [
    {
      convictionType: 'Arson',
      numberOfConvictions: '3',
      currentlyServing: 'yes',
      safeguarding: 'yes',
      safeguardingDetail: 'safeguarding detail',
    },
  ]

  describe('title', () => {
    it('has a page title', () => {
      const page = new OffenceHistoryData({}, application)

      expect(page.title).toEqual('Add previous unspent convictions for Roger Smith')
    })
  })

  itShouldHaveNextValue(new OffenceHistoryData({}, application), 'offence-history')
  itShouldHavePreviousValue(new OffenceHistoryData({}, application), 'offence-history')

  describe('errors', () => {
    describe('when there are no errors', () => {
      it('returns empty object', () => {
        const page = new OffenceHistoryData(offenceHistoryData[0], application)
        expect(page.errors()).toEqual({})
      })
    })

    const requiredFields = [
      ['convictionType', 'Select the type of conviction'],
      ['numberOfConvictions', 'Enter the number of convictions of this type'],
      ['currentlyServing', 'Select if they are serving a sentence for any of these convictions'],
      ['safeguarding', 'Select if there are any safeguarding details to add, or if it is not known'],
    ]

    it.each(requiredFields)('it includes a validation error for %s', (field, message) => {
      const page = new OffenceHistoryData({ convictionType: 'choose' }, application)
      const errors = page.errors()

      expect(errors[field as keyof typeof errors]).toEqual(message)
    })

    it('includes validation error for safeguardingDetail when not supplied and safeguarding is "yes"', () => {
      const page = new OffenceHistoryData({ safeguarding: 'yes' }, application)
      const errors = page.errors()

      expect(errors.safeguardingDetail).toEqual('Enter details of the safeguarding measures')
    })
  })

  describe('response', () => {
    it('returns empty object', () => {
      const page = new OffenceHistoryData({}, application)
      expect(page.response()).toEqual({})
    })
  })
})
