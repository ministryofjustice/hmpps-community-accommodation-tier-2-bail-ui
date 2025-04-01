import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import ConfirmConsent from './confirmConsent'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'
import { getQuestions } from '../../../utils/questions'

describe('ConfirmConsent', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const questions = getQuestions('Roger Smith')

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new ConfirmConsent({}, application)

      expect(page.title).toEqual("Confirm Roger Smith's consent")
    })
  })

  itShouldHaveNextValue(new ConfirmConsent({}, application), '')
  itShouldHavePreviousValue(new ConfirmConsent({}, application), 'taskList')

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new ConfirmConsent({ hasGivenConsent: 'no' }, application)

      expect(page.items('dateHtml', 'refusalDetailHtml')).toEqual([
        {
          value: 'yes',
          text: questions['confirm-consent']['confirm-consent'].hasGivenConsent.answers.yes,
          conditional: { html: 'dateHtml' },
          checked: false,
        },
        {
          value: 'no',
          text: questions['confirm-consent']['confirm-consent'].hasGivenConsent.answers.no,
          conditional: { html: 'refusalDetailHtml' },
          checked: true,
        },
      ])
    })
  })

  describe('errors', () => {
    it('should return errors when yes/no questions are blank', () => {
      const page = new ConfirmConsent({}, application)

      expect(page.errors()).toEqual({
        hasGivenConsent: 'Select if the applicant has given their verbal consent',
      })
    })

    it('should return an error when no is selected but no reason is provided', () => {
      const page = new ConfirmConsent({ hasGivenConsent: 'no' }, application)

      expect(page.errors()).toEqual({
        consentRefusalDetail: 'Enter the applicant’s reason for refusing consent',
      })
    })

    it('should return an error when yes is selected but no day is provided', () => {
      const page = new ConfirmConsent(
        { hasGivenConsent: 'yes', 'consentDate-year': '1234', 'consentDate-month': '12' },
        application,
      )

      expect(page.errors()).toEqual({
        consentDate: 'Date of consent must include a day, month and year',
      })
    })

    it('should return an error when yes is selected but no month is provided', () => {
      const page = new ConfirmConsent(
        { hasGivenConsent: 'yes', 'consentDate-year': '1234', 'consentDate-day': '20' },
        application,
      )

      expect(page.errors()).toEqual({
        consentDate: 'Date of consent must include a day, month and year',
      })
    })
    it('should return an error when yes is selected but no year is provided', () => {
      const page = new ConfirmConsent(
        { hasGivenConsent: 'yes', 'consentDate-month': '12', 'consentDate-day': '20' },
        application,
      )

      expect(page.errors()).toEqual({
        consentDate: 'Date of consent must include a day, month and year',
      })
    })

    it('should return an error when yes is selected but the date is invalid', () => {
      const page = new ConfirmConsent(
        { hasGivenConsent: 'yes', 'consentDate-year': '1122', 'consentDate-month': '13', 'consentDate-day': '32' },
        application,
      )

      expect(page.errors()).toEqual({
        consentDate: 'Date of consent must be a real date',
      })
    })

    it('should return an error when yes is selected but the date is in the future', () => {
      const page = new ConfirmConsent(
        { hasGivenConsent: 'yes', 'consentDate-year': '2150', 'consentDate-month': '12', 'consentDate-day': '31' },
        application,
      )

      expect(page.errors()).toEqual({
        consentDate: 'Date of consent must be today or in the past',
      })
    })
  })

  describe('response', () => {
    it('should return the consent date if consent has been given', () => {
      const page = new ConfirmConsent({ hasGivenConsent: 'yes', consentDate: '2023-11-01' }, application)

      expect(page.response()).toEqual({
        'Has Roger Smith given their verbal consent to apply for short-term accommodation (CAS2) for bail?': 'Yes',
        'When did they give consent?': '1 November 2023',
      })
    })
  })

  it('should return the consent refusal detail if consent has been refused', () => {
    const page = new ConfirmConsent({ hasGivenConsent: 'no', consentRefusalDetail: 'some reasons' }, application)

    expect(page.response()).toEqual({
      'Has Roger Smith given their verbal consent to apply for short-term accommodation (CAS2) for bail?':
        'No, they do not give verbal consent',
      'Why was consent refused?': 'some reasons',
    })
  })
})
