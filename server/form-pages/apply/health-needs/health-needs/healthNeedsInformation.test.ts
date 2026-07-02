import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import HealthNeedsInformation from './healthNeedsInformation'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'

describe('HealthNeedsInformation', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  const bailApplication = applicationFactory.build({ person, applicationOrigin: 'courtBail' })
  const otherApplication = applicationFactory.build({ person, applicationOrigin: 'other' })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new HealthNeedsInformation({}, bailApplication)

      expect(page.title).toEqual("Provide information about Roger Smith's health needs")
    })
  })

  itShouldHaveNextValue(new HealthNeedsInformation({}, bailApplication), 'liaison-and-diversion')
  itShouldHaveNextValue(new HealthNeedsInformation({}, otherApplication), 'substance-misuse')
  itShouldHavePreviousValue(new HealthNeedsInformation({}, bailApplication), 'taskList')

  describe('errors', () => {
    it('returns no errors as this page has no questions/answers', () => {
      const page = new HealthNeedsInformation({}, bailApplication)

      expect(page.errors()).toEqual({})
    })
  })
})
