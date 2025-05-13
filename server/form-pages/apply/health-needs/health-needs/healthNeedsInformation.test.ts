import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import HealthNeedsInformation from './healthNeedsInformation'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'

describe('HealthNeedsInformation', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new HealthNeedsInformation({}, application)

      expect(page.title).toEqual("Provide information about Roger Smith's health needs")
    })
  })

  itShouldHaveNextValue(new HealthNeedsInformation({}, application), 'substance-misuse')
  itShouldHavePreviousValue(new HealthNeedsInformation({}, application), 'liaison-and-diversion')

  describe('errors', () => {
    it('returns no errors as this page has no questions/answers', () => {
      const page = new HealthNeedsInformation({}, application)

      expect(page.errors()).toEqual({})
    })
  })
})
