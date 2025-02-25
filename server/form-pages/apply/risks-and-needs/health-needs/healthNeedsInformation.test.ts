import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import HealthNeedsInformation from './healthNeedsInformation'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'

describe('HealthNeedsInformation', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new HealthNeedsInformation({}, application)

      expect(page.title).toEqual('Request health information for Roger Smith')
    })
  })

  itShouldHaveNextValue(new HealthNeedsInformation({}, application), 'substance-misuse')
  itShouldHavePreviousValue(new HealthNeedsInformation({}, application), 'independent-living')

  describe('errors', () => {
    it('returns no errors as this page has no questions/answers', () => {
      const page = new HealthNeedsInformation({}, application)

      expect(page.errors()).toEqual({})
    })
  })
})
