import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import IndependentLiving from './independentLiving'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'

describe('IndependentLiving', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHaveNextValue(new IndependentLiving({}, application), 'health-needs-information')
  itShouldHavePreviousValue(new IndependentLiving({}, application), 'liaison-and-diversion')

  describe('errors', () => {
    it('returns no errors', () => {
      const page = new IndependentLiving({}, application)

      expect(page.errors()).toEqual({})
    })
  })
})
