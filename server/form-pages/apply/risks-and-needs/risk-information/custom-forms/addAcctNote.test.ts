import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../../testutils/factories/index'
import AddAcctNote from './addAcctNote'

describe('AddAcctNote ', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const acctData = [
    {
      referringInstitution: 'institution',
      'createdDate-day': '1',
      'createdDate-month': '2',
      'createdDate-year': '2012',
      isOngoing: 'yes',
      'closedDate-day': '10',
      'closedDate-month': '10',
      'closedDate-year': '2013',
      acctDetails: 'detail info',
    },
  ]

  describe('title', () => {
    it('has a page title', () => {
      const page = new AddAcctNote({}, application)

      expect(page.title).toEqual('Add an ACCT note for Roger Smith')
    })
  })

  describe('hasExistingAcctNotes', () => {
    it('returns true when ACCT notes exist', () => {
      const applicationWithACCTData = applicationFactory.build({
        data: {
          'risk-information': {
            'add-acct-note': acctData,
          },
        },
      })

      const page = new AddAcctNote({}, applicationWithACCTData)

      expect(page.hasExistingAcctNotes).toEqual(true)
    })

    it('returns false when ACCT notes do not exist', () => {
      const applicationWithoutACCTData = applicationFactory.build({
        data: {
          'risk-information': {},
        },
      })

      const page = new AddAcctNote({}, applicationWithoutACCTData)

      expect(page.hasExistingAcctNotes).toEqual(false)
    })
  })

  itShouldHaveNextValue(new AddAcctNote({}, application), 'acct')
  itShouldHavePreviousValue(new AddAcctNote({}, application), 'does-the-applicant-have-acct-notes')

  describe('errors', () => {
    describe('when there are no errors', () => {
      it('returns empty object', () => {
        const page = new AddAcctNote(acctData[0], application)
        expect(page.errors()).toEqual({})
      })
    })

    const requiredFields = [
      ['createdDate', 'Enter when the ACCT was created'],
      ['isOngoing', 'Select if the ACCT is ongoing'],
      ['referringInstitution', 'Enter the referring institution'],
      ['acctDetails', 'Enter details about the ACCT'],
    ]

    it.each(requiredFields)('it includes a validation error for %s', (field, message) => {
      const page = new AddAcctNote(
        {
          'createdDate-day': '',
          'createdDate-month': '',
          'createdDate-year': '',
          'closedDate-day': '',
          'closedDate-month': '',
          'closedDate-year': '',
          referringInstitution: '',
          isOngoing: undefined,
          acctDetails: '',
        },
        application,
      )
      const errors = page.errors()

      expect(errors[field as keyof typeof errors]).toEqual(message)
    })

    describe('when the given created date is in the future', () => {
      it('throws an error', () => {
        const page = new AddAcctNote(
          {
            'createdDate-day': '01',
            'createdDate-month': '01',
            'createdDate-year': '3000',
          },
          application,
        )
        const errors = page.errors()

        expect(errors.createdDate).toEqual('Date created must be today or in the past')
      })
    })

    describe('when an ACCT is ongoing but a closed date has not been given', () => {
      it('throws an error', () => {
        const page = new AddAcctNote(
          {
            isOngoing: 'no',
          },
          application,
        )
        const errors = page.errors()

        expect(errors.closedDate).toEqual('Enter when the ACCT was closed')
      })
    })

    describe('when an ACCT is ongoing but the given closed date is in the future', () => {
      it('throws an error', () => {
        const page = new AddAcctNote(
          {
            isOngoing: 'no',
            'closedDate-day': '01',
            'closedDate-month': '01',
            'closedDate-year': '3000',
          },
          application,
        )
        const errors = page.errors()

        expect(errors.closedDate).toEqual('Date closed must be today or in the past')
      })
    })
  })

  describe('response', () => {
    it('returns empty object', () => {
      const page = new AddAcctNote({}, application)
      expect(page.response()).toEqual({})
    })
  })
})
