import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import LivingInTheCommunity from './livingInTheCommunity'

describe('LivingInTheCommunity', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new LivingInTheCommunity({}, application)

      expect(page.title).toEqual('Living in the community')
    })
  })

  itShouldHaveNextValue(new LivingInTheCommunity({}, application), 'risks-to-staff')
  itShouldHavePreviousValue(new LivingInTheCommunity({}, application), 'violence-and-arson')
})
