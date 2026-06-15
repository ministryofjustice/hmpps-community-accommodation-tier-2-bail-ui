import { Cas2CohortDto } from 'server/@types/shared'
import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { applicationFactory, personFactory } from '../../../../testutils/factories'
import LicenceDates, { LicenceDatesBody } from './licence-dates'
import { getQuestions } from '../../../utils/questions'

describe('LicenceDates', () => {
  const application = applicationFactory.build({ cohort: 'atcr', person: personFactory.build({ name: 'Roger Smith' }) })

  const page = (cohort: Cas2CohortDto, body = {} as LicenceDatesBody) =>
    new LicenceDates(body, { ...application, cohort })

  const dateToDateParts = (isoDate: string, key: string) => {
    const [year, month, day] = isoDate.split('-')
    return { [`${key}-day`]: day, [`${key}-month`]: month, [`${key}-year`]: year }
  }

  const filledBody: Partial<LicenceDatesBody> = {
    ...dateToDateParts('2026-05-03', 'licenceStartDate'),
    ...dateToDateParts('2026-07-12', 'licenceEndDate'),
    ...dateToDateParts('2026-10-03', 'hdcExpiryDate'),
    hasHdcExpiryDate: 'yes',
  }

  describe('questions', () => {
    const allQuestions = getQuestions('Roger Smith')['cohort-selection']['licence-dates']

    const tests: Array<[Cas2CohortDto, object]> = [
      ['hcrd', { ...allQuestions, hasHdcExpiryDate: undefined }],
      ['atcr', { ...allQuestions }],
      ['hefr', { ...allQuestions, hasHdcExpiryDate: undefined }],
      ['isc', { ...allQuestions, hasHdcExpiryDate: undefined }],
      ['rarr', { ...allQuestions, hasHdcExpiryDate: undefined, licenceStartDate: undefined }],
      ['from_ap', { ...allQuestions, hasHdcExpiryDate: undefined }],
    ]

    it.each(tests)('Returns the correct questions for cohort %s', (cohort, expected) => {
      expect(page(cohort as Cas2CohortDto).questions).toEqual(expected)
    })
  })

  describe('title', () => {
    it('Has the correct title', () => {
      expect(page('isc').title).toEqual("Roger Smith's licence")
    })
  })

  describe('Routing', () => {
    itShouldHaveNextValue(page('rarr'), '')
    itShouldHavePreviousValue(page('rarr'), 'cohort-selection')
    itShouldHavePreviousValue(page('isc'), 'licence-dates-needed')
  })

  describe('Errors', () => {
    it('Returns errors if the form is blank', () => {
      expect(page('atcr').errors()).toEqual({
        licenceEndDate: 'Licence end date must be entered',
        licenceStartDate: 'Licence start date must be entered',
        hasHdcExpiryDate: 'Select yes if they have a HDC expiry date',
      })
    })

    it('Requires hdc expiry date as well if hdc question is answered', () => {
      expect(page('atcr', { ...filledBody, 'hdcExpiryDate-month': undefined } as LicenceDatesBody).errors()).toEqual({
        hdcExpiryDate: 'HDC expiry date must be entered',
      })
    })

    it('Does not require hdc expiry date if hdc question is answered "no"', () => {
      expect(
        page('atcr', { ...filledBody, hasHdcExpiryDate: 'no', 'hdcExpiryDate-month': '' } as LicenceDatesBody).errors(),
      ).toEqual({})
    })

    it('Returns no errors if all questions are answered', () => {
      expect(new LicenceDates(filledBody, application).errors()).toEqual({})
    })
  })

  describe('onSave', () => {
    it('does nothing if hasHdcExpiryDate is "yes"', () => {
      const testBody = { ...filledBody, hasHdcExpiryDate: 'yes' } as LicenceDatesBody
      const testPage = new LicenceDates(testBody, application)
      testPage.onSave()
      expect(testPage.body).toEqual(testBody)
    })

    it('wipes the hdcExpiryDate if hasHdcExpiryDate is "no"', () => {
      const testBody = { ...filledBody, hasHdcExpiryDate: 'no' } as LicenceDatesBody
      const testPage = new LicenceDates(testBody, application)
      testPage.onSave()
      expect(testPage.body).toEqual({
        ...testBody,
        'hdcExpiryDate-day': undefined,
        'hdcExpiryDate-month': undefined,
        'hdcExpiryDate-year': undefined,
      })
    })
  })

  describe('response', () => {
    it('Returns the correct response', () => {
      const testPage = new LicenceDates(filledBody, application)

      expect(testPage.response()).toEqual({
        'Does Roger Smith have an HDC expiry date?': 'Yes',
        'HDC expiry date': '3 October 2026',
        "What is Roger Smith's licence end date?": '12 July 2026',
        "What is Roger Smith's licence start date/conditional release date?": '3 May 2026',
      })
    })
  })

  describe('isApplicable', () => {
    it('should only be applicable for "other" applicationOrigin', () => {
      const testPage = new LicenceDates({}, { ...application, applicationOrigin: 'other' })
      expect(testPage.isApplicable()).toEqual(true)
    })

    it('should not be applicable if origin is not "other"', () => {
      const testPage = new LicenceDates({}, { ...application, applicationOrigin: 'courtBail' })
      expect(testPage.isApplicable()).toEqual(false)
    })
  })
})
