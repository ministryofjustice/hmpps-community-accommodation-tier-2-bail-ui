import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import NoFixedAddress from './noFixedAddress'

describe('NoFixedAddress', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new NoFixedAddress({}, application)

      expect(page.title).toEqual('How long has Roger Smith had no fixed address for?')
    })
  })

  itShouldHaveNextValue(new NoFixedAddress({}, application), '')
  itShouldHavePreviousValue(new NoFixedAddress({}, application), 'has-fixed-address-before-custody')

  describe('errors', () => {
    it('returns an error when howLong is not provided', () => {
      const page = new NoFixedAddress({}, application)

      expect(page.errors()).toEqual({
        howLong: 'Enter how long they have had no fixed address',
      })
    })

    it('returns no errors when howLong is provided', () => {
      const page = new NoFixedAddress({ howLong: 'some duration' }, application)

      expect(page.errors()).toEqual({})
    })

    it('returns no errors when optional address fields are also provided', () => {
      const page = new NoFixedAddress(
        {
          howLong: 'some duration',
          lastKnownAddressLine1: 'some address line 1',
          lastKnownAddressLine2: 'some address line 2',
          lastKnownTownOrCity: 'some town or city',
          lastKnownCounty: 'some county',
          lastKnownPostcode: 'some postcode',
        },
        application,
      )

      expect(page.errors()).toEqual({})
    })
  })
})
