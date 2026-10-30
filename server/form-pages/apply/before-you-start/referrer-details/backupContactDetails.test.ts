import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import BackupContactDetails from './backupContactDetails'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'

describe('BackupContactDetails', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('sets the page title', () => {
      const page = new BackupContactDetails({}, application)

      expect(page.title).toEqual('Backup contact details')
    })
  })

  itShouldHaveNextValue(new BackupContactDetails({}, application), '')

  describe('when the referrer is the CPP', () => {
    const cppApplication = applicationFactory.build({
      person: personFactory.build({ name: 'Roger Smith' }),
      data: { 'referrer-details': { 'cpp-check': { isCpp: 'yes' } } },
    })

    itShouldHavePreviousValue(new BackupContactDetails({}, cppApplication), 'contact-number')
  })

  describe('when the referrer is not the CPP', () => {
    const notCppApplication = applicationFactory.build({
      person: personFactory.build({ name: 'Roger Smith' }),
      data: { 'referrer-details': { 'cpp-check': { isCpp: 'no' } } },
    })

    itShouldHavePreviousValue(new BackupContactDetails({}, notCppApplication), 'location')
  })

  describe('errors', () => {
    describe('when they have not provided any answer', () => {
      it('returns errors', () => {
        const page = new BackupContactDetails({}, application)

        expect(page.errors()).toEqual({
          name: "Enter the backup contact's full name",
          email: "Enter the backup contact's email address",
          telephone: "Enter the backup contact's contact number",
        })
      })
    })

    describe('when the email address does not end .gov.uk', () => {
      it('returns an error', () => {
        const page = new BackupContactDetails(
          { name: 'a name', email: 'an email address', telephone: 'a phone number' },
          application,
        )

        expect(page.errors()).toEqual({ email: 'Enter an email address ending .gov.uk' })
      })
    })
  })

  describe('response', () => {
    it('returns data in expected format', () => {
      const page = new BackupContactDetails(
        {
          name: 'a name',
          email: 'an email address',
          telephone: 'a phone number',
        },
        application,
      )

      expect(page.response()).toEqual({
        'Backup contact details': `a name\r\na phone number\r\nan email address`,
      })
    })
  })
})
