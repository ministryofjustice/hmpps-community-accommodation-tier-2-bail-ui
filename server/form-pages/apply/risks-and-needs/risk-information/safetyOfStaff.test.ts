import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import SafetyOfStaff from './safetyOfStaff'

describe('SafetyOfStaff', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new SafetyOfStaff({}, application)

      expect(page.title).toEqual('Concerns related to the safety of staff')
    })
  })

  itShouldHaveNextValue(new SafetyOfStaff({}, application), 'additional-concerns')
  itShouldHavePreviousValue(new SafetyOfStaff({}, application), 'living-in-the-community')
})
