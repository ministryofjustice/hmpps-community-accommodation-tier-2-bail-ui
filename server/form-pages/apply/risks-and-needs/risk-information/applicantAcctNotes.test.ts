import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import ApplicantAcctNotes from './applicantAcctNotes'

describe('Acct', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new ApplicantAcctNotes({}, application)

      expect(page.title).toEqual(`Assessment, Care in Custody and Teamwork (ACCT) notes for Roger Smith`)
    })
  })

  itShouldHaveNextValue(new ApplicantAcctNotes({ applicantHasAcctNotes: 'yes' }, application), 'add-acct-note')
  itShouldHaveNextValue(
    new ApplicantAcctNotes(
      { applicantHasAcctNotes: 'yes' },
      { ...application, data: { 'risk-information': { 'add-acct-note': [{ key: 'value' }] } } },
    ),
    'acct',
  )
  itShouldHaveNextValue(new ApplicantAcctNotes({ applicantHasAcctNotes: 'no' }, application), 'violence-and-arson')
  itShouldHaveNextValue(
    new ApplicantAcctNotes({ applicantHasAcctNotes: 'notInPrisonCustody' }, application),
    'violence-and-arson',
  )
  itShouldHavePreviousValue(new ApplicantAcctNotes({}, application), 'self-harm')

  describe('errors', () => {
    it('returns an error when _applicantHasAcctNotes_ is empty', () => {
      const page = new ApplicantAcctNotes({}, application)

      expect(page.errors()).toEqual({
        applicantHasAcctNotes: 'Select if they have any ACCT notes, or if they are not in prison custody',
      })
    })
  })
})
