import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import ViolenceAndArson from './violenceAndArson'

describe('ViolenceAndArson', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new ViolenceAndArson({}, application)

      expect(page.title).toEqual('Violence and arson')
    })
  })

  itShouldHaveNextValue(new ViolenceAndArson({}, application), 'living-in-the-community')
  itShouldHavePreviousValue(new ViolenceAndArson({}, application), 'acct')
})
