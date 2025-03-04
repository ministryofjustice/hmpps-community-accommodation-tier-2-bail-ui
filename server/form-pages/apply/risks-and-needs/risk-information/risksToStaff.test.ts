import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import RisksToStaff from './risksToStaff'

describe('RisksToStaff', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new RisksToStaff({}, application)

      expect(page.title).toEqual('Risks to staff')
    })
  })

  itShouldHaveNextValue(new RisksToStaff({}, application), 'additional-concerns')
  itShouldHavePreviousValue(new RisksToStaff({}, application), 'living-in-the-community')
})
