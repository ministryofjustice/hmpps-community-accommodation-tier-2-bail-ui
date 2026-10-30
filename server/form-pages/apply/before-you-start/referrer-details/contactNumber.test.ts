import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import ContactNumber from './contactNumber'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'

describe('ContactNumber', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHaveNextValue(new ContactNumber({}, application), 'location')
  itShouldHavePreviousValue(new ContactNumber({}, application), 'job-title')

  describe('when the referrer is the CPP', () => {
    const cppApplication = applicationFactory.build({
      person: personFactory.build({ name: 'Roger Smith' }),
      data: { 'referrer-details': { 'cpp-check': { isCpp: 'yes' } } },
    })

    itShouldHaveNextValue(new ContactNumber({}, cppApplication), 'backup-contact-details')
    itShouldHavePreviousValue(new ContactNumber({}, cppApplication), 'cpp-check')
  })

  describe('errors', () => {
    it('returns an error if contact number is missing', () => {
      const page = new ContactNumber({}, application)

      expect(page.errors()).toEqual({ telephone: 'Enter your contact telephone number' })
    })
  })
})
