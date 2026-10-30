import { faker } from '@faker-js/faker'
import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { applicationFactory, personFactory } from '../../../../testutils/factories'
import AccommodationStartDate, { AccommodationStartDateBody } from './accommodation-start-date'
import { DateFormats, isoDateToDateParts } from '../../../../utils/dateUtils'

describe('AccommodationStartDate', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const page = (body = {} as Partial<AccommodationStartDateBody>) => new AccommodationStartDate(body, application)

  const accommodationStartDate = faker.date.soon({ days: 60 })
  const accommodationStartDateIso = DateFormats.dateObjToIsoDate(accommodationStartDate)

  const filledBody = isoDateToDateParts(
    accommodationStartDateIso,
    'accommodationStartDate',
  ) as Partial<AccommodationStartDateBody>

  describe('questions', () => {
    it('Returns the correct questions', () => {
      expect(page().questions).toEqual({
        accommodationStartDate: {
          question: 'When is the accommodation required from?',
          hint: 'For example, 27 3 2023',
          dataType: 'date',
        },
      })
    })
  })

  describe('title', () => {
    it('Has the correct title', () => {
      expect(page().title).toEqual('What date is accommodation required from?')
    })
  })

  describe('Routing', () => {
    itShouldHaveNextValue(page(), '')
    itShouldHavePreviousValue(page(), 'licence-dates')
    itShouldHavePreviousValue(
      new AccommodationStartDate(
        {},
        {
          ...application,
          cohort: 'isc',
          data: { 'cohort-selection': { 'licence-dates-needed': { licenceDatesNeeded: 'no' } } },
        },
      ),
      'licence-dates-needed',
    )
  })

  describe('Errors', () => {
    it('Returns an error if the form is blank', () => {
      expect(page().errors()).toEqual({
        accommodationStartDate: 'Enter a date the accommodation is required from',
      })
    })

    it.each([
      ['day', { ...filledBody, 'accommodationStartDate-day': '' }],
      ['month', { ...filledBody, 'accommodationStartDate-month': '' }],
      ['year', { ...filledBody, 'accommodationStartDate-year': '' }],
    ])('Returns an error if the %s is missing', (datePart, body) => {
      expect(page(body).errors()).toEqual({
        accommodationStartDate: `Date accommodation is required from must include a ${datePart}`,
      })
    })

    it('Returns an error if the date is not a real date', () => {
      expect(
        page({
          'accommodationStartDate-day': '31',
          'accommodationStartDate-month': '2',
          'accommodationStartDate-year': '2030',
        }).errors(),
      ).toEqual({
        accommodationStartDate: 'Date accommodation is required from must be a real date',
      })
    })

    it('Returns an error if the date is in the past', () => {
      expect(page(isoDateToDateParts('2023-01-01', 'accommodationStartDate')).errors()).toEqual({
        accommodationStartDate: 'Date accommodation is required from must be in the future',
      })
    })

    it('Returns no errors if the date is in the future', () => {
      expect(page(filledBody).errors()).toEqual({})
    })
  })

  describe('response', () => {
    it('Returns the correct response', () => {
      expect(page(filledBody).response()).toEqual({
        'When is the accommodation required from?': DateFormats.isoDateToUIDate(accommodationStartDateIso, {
          format: 'medium',
        }),
      })
    })
  })

  describe('isApplicable', () => {
    it('should only be applicable for "other" applicationOrigin', () => {
      const testPage = new AccommodationStartDate({}, { ...application, applicationOrigin: 'other' })
      expect(testPage.isApplicable()).toEqual(true)
    })

    it('should not be applicable if origin is not "other"', () => {
      const testPage = new AccommodationStartDate({}, { ...application, applicationOrigin: 'courtBail' })
      expect(testPage.isApplicable()).toEqual(false)
    })
  })
})
