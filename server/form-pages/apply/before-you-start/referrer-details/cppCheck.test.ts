import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import CppCheck from './cppCheck'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'

describe('CppCheck', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const cppCheck = new CppCheck({}, application)
  itShouldHaveNextValue(cppCheck, 'community-probation-practitioner-details')
  itShouldHaveNextValue(new CppCheck({ isCpp: 'yes' }, application), 'contact-number')
  itShouldHavePreviousValue(cppCheck, 'confirm-details')

  describe('errors', () => {
    it('returns an error if contact number is missing', () => {
      expect(cppCheck.errors()).toEqual({
        isCpp: "Select if you are Roger Smith's community probation practitioner",
      })
    })
  })
})
