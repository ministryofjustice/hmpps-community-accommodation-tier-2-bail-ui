import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import AdditionalConcerns from './additionalConcerns'

describe('AdditionalConcerns', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new AdditionalConcerns({}, application)

      expect(page.title).toEqual('Additional concerns')
    })
  })

  itShouldHaveNextValue(new AdditionalConcerns({}, application), '')
  itShouldHavePreviousValue(new AdditionalConcerns({}, application), 'safety-of-staff')
})
