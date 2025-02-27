import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import SelfHarm from './selfHarm'

describe('SelfHarm', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new SelfHarm({}, application)

      expect(page.title).toEqual('Self harm')
    })
  })

  itShouldHaveNextValue(new SelfHarm({}, application), 'acct')
  itShouldHavePreviousValue(new SelfHarm({}, application), 'concerns')
})
