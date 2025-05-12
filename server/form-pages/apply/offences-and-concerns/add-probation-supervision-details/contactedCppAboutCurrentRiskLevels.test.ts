import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import ContactedCppAboutCurrentRiskLevels from './contactedCppAboutCurrentRiskLevels'

describe('ContactedCppAboutCurrentRiskLevels', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new ContactedCppAboutCurrentRiskLevels({}, application)

      expect(page.title).toEqual("Have you contacted the CPP about Roger Smith's current risk levels?")
    })
  })

  describe('when the referrer has contacted the CPP', () => {
    itShouldHaveNextValue(
      new ContactedCppAboutCurrentRiskLevels({ hasContactedCppAboutCurrentRiskLevels: 'yes' }, application),
      'serious-harm-risk-levels',
    )
  })

  describe('when the referrer has not contacted the CPP', () => {
    itShouldHaveNextValue(
      new ContactedCppAboutCurrentRiskLevels({ hasContactedCppAboutCurrentRiskLevels: 'no' }, application),
      'you-must-contact-the-cpp',
    )
  })

  itShouldHavePreviousValue(
    new ContactedCppAboutCurrentRiskLevels({}, application),
    'community-probation-practitioner-details',
  )

  describe('errors', () => {
    describe('when they have not provided an answer contacting the CPP', () => {
      it('returns errors', () => {
        const page = new ContactedCppAboutCurrentRiskLevels({}, application)

        expect(page.errors()).toEqual({
          hasContactedCppAboutCurrentRiskLevels: 'Select yes if you have contacted the CPP',
        })
      })
    })

    describe('when they have answered "yes" to contacting the CPP', () => {
      it('returns an error if the contact date is not filled in', () => {
        const page = new ContactedCppAboutCurrentRiskLevels(
          {
            hasContactedCppAboutCurrentRiskLevels: 'yes',
            'contactDate-day': '',
            'contactDate-month': '',
            'contactDate-year': '',
          },
          application,
        )

        expect(page.errors()).toEqual({
          contactDate: 'Enter the date the CPP was contacted',
        })
      })

      it('returns an error if the contact date is not valid', () => {
        const page = new ContactedCppAboutCurrentRiskLevels(
          {
            hasContactedCppAboutCurrentRiskLevels: 'yes',
            'contactDate-day': '01',
            'contactDate-month': '13',
            'contactDate-year': '2025',
          },
          application,
        )

        expect(page.errors()).toEqual({
          contactDate: 'Date of contact must include a day, month and year',
        })
      })

      it('returns an error if the contact date is in the future', () => {
        const page = new ContactedCppAboutCurrentRiskLevels(
          {
            hasContactedCppAboutCurrentRiskLevels: 'yes',
            'contactDate-day': '01',
            'contactDate-month': '05',
            'contactDate-year': '3000',
          },
          application,
        )

        expect(page.errors()).toEqual({
          contactDate: 'Date of contact must be today or in the past',
        })
      })
    })
  })

  describe('onSave', () => {
    describe('when hasContactedCppAboutCurrentRiskLevels is not _yes_', () => {
      it('removes answer for _contactDate_', () => {
        const page = new ContactedCppAboutCurrentRiskLevels(
          {
            hasContactedCppAboutCurrentRiskLevels: 'no',
            contactDate: '2024-10-01',
            'contactDate-day': '01',
            'contactDate-month': '10',
            'contactDate-year': '2024',
          },
          application,
        )

        page.onSave()

        expect(page.body).toEqual({
          hasContactedCppAboutCurrentRiskLevels: 'no',
        })
      })
    })
  })

  describe('response', () => {
    it('should return the contact date and answer', () => {
      const page = new ContactedCppAboutCurrentRiskLevels(
        {
          hasContactedCppAboutCurrentRiskLevels: 'yes',
          contactDate: '2024-10-01',
          'contactDate-day': '01',
          'contactDate-month': '10',
          'contactDate-year': '2024',
        },
        application,
      )

      expect(page.response()).toEqual({
        "Have you contacted the CPP about Roger Smith's current risk levels?": 'Yes',
        'When did you contact them?': '1 October 2024',
      })
    })
  })
})
