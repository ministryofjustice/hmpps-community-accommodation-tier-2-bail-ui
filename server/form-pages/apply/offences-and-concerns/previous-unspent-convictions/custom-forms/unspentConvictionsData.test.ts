import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../../testutils/factories/index'
import UnspentConvictionsData, { UnspentConvictionsDataBody } from './unspentConvictionsData'

describe('UnspentConvictionsData', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const unspentConvictionsData: UnspentConvictionsDataBody[] = [
    {
      convictionType: 'Arson',
      numberOfConvictions: '3',
      currentlyServing: 'yes',
      convictionDetails: 'some details',
      areOtherDetails: 'yes',
      otherDetails: 'other detail',
    },
  ]

  describe('title', () => {
    it('has a page title', () => {
      const page = new UnspentConvictionsData({}, application)

      expect(page.title).toEqual('Add previous unspent convictions for Roger Smith')
    })
  })

  itShouldHaveNextValue(new UnspentConvictionsData({}, application), 'unspent-convictions')
  itShouldHavePreviousValue(new UnspentConvictionsData({}, application), 'any-previous-convictions')

  describe('errors', () => {
    describe('when there are no errors', () => {
      it('returns empty object', () => {
        const page = new UnspentConvictionsData(unspentConvictionsData[0], application)
        expect(page.errors()).toEqual({})
      })
    })

    const requiredFields = [
      ['convictionType', 'Select the type of conviction'],
      ['numberOfConvictions', 'Enter the number of convictions of this type'],
      ['currentlyServing', 'Select yes if they are serving a sentence'],
      ['convictionDetails', 'Enter what the convictions were and when they happened'],
      ['areOtherDetails', 'Select yes if there are other details to add'],
    ]

    it.each(requiredFields)('it includes a validation error for %s', (field, message) => {
      const page = new UnspentConvictionsData({ convictionType: 'choose' }, application)
      const errors = page.errors()

      expect(errors[field as keyof typeof errors]).toEqual(message)
    })

    it('includes validation error for otherDetails when not supplied and areOtherDetails is "yes"', () => {
      const page = new UnspentConvictionsData({ areOtherDetails: 'yes' }, application)
      const errors = page.errors()

      expect(errors.otherDetails).toEqual('Enter more details')
    })
  })

  describe('response', () => {
    it('returns empty object', () => {
      const page = new UnspentConvictionsData({}, application)
      expect(page.response()).toEqual({})
    })
  })
})
