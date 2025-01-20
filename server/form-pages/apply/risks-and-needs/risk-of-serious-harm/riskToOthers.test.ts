import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import RiskToOthers from './riskToOthers'

describe('RiskToOthers', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new RiskToOthers({}, application)

      expect(page.title).toEqual(`Risk to others for Roger Smith`)
    })
  })

  itShouldHaveNextValue(new RiskToOthers({}, application), 'risk-management-arrangements')
  itShouldHavePreviousValue(new RiskToOthers({}, application), 'taskList')

  describe('errors', () => {
    it('returns an error when required fields are blank', () => {
      const page = new RiskToOthers({}, application)
      expect(page.errors()).toEqual({
        whoIsAtRisk: 'Enter who is at risk',
        natureOfRisk: 'Enter the nature of the risk',
      })
    })
  })
})
