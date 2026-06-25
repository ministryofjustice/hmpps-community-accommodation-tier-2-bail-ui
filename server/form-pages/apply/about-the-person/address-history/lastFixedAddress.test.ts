import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import LastFixedAddress from './lastFixedAddress'

describe('LastFixedAddress', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new LastFixedAddress({}, application)

      expect(page.title).toEqual("Enter Roger Smith's last fixed address")
    })
  })

  itShouldHaveNextValue(new LastFixedAddress({}, application), '')
  itShouldHavePreviousValue(new LastFixedAddress({}, application), 'has-fixed-address-before-custody')

  describe('errors', () => {
    it('returns errors when required fields are missing', () => {
      const page = new LastFixedAddress({}, application)

      expect(page.errors()).toEqual({
        addressLine1: 'Enter address line 1',
        townOrCity: 'Enter the town or city',
        postcode: 'Enter the postcode',
      })
    })

    it.each([
      [
        'addressLine1',
        { townOrCity: 'some town or city', postcode: 'some postcode' },
        { addressLine1: 'Enter address line 1' },
      ],
      [
        'townOrCity',
        { addressLine1: 'some address line 1', postcode: 'some postcode' },
        { townOrCity: 'Enter the town or city' },
      ],
      [
        'postcode',
        { addressLine1: 'some address line 1', townOrCity: 'some town or city' },
        { postcode: 'Enter the postcode' },
      ],
    ])('returns an error when only %s is missing', (_, body, expectedErrors) => {
      const page = new LastFixedAddress(body, application)

      expect(page.errors()).toEqual(expectedErrors)
    })

    it('returns no errors when all required fields are provided', () => {
      const page = new LastFixedAddress(
        { addressLine1: 'some address line 1', townOrCity: 'some town or city', postcode: 'some postcode' },
        application,
      )

      expect(page.errors()).toEqual({})
    })

    it('returns no errors when optional fields are also provided', () => {
      const page = new LastFixedAddress(
        {
          addressLine1: 'some address line 1',
          addressLine2: 'some address line 2',
          townOrCity: 'some town or city',
          county: 'some county',
          postcode: 'some postcode',
        },
        application,
      )

      expect(page.errors()).toEqual({})
    })
  })
})
