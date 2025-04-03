import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import Location from './location'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'

describe('Location', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHaveNextValue(new Location({}, application), '')
  itShouldHavePreviousValue(new Location({}, application), 'contact-number')

  describe('errors', () => {
    it('returns an error if location is missing', () => {
      const page = new Location({}, application)

      expect(page.errors()).toEqual({ location: 'Enter where you are based' })
    })
  })
})
