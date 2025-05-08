import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import BailHearingDate, { BailHearingInformationBody } from './bailHearingInformation'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'
import { getQuestions } from '../../../utils/questions'

describe('BailHearingInformation', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHavePreviousValue(new BailHearingDate({}, application), 'taskList')
  itShouldHaveNextValue(new BailHearingDate({}, application), '')

  describe('response', () => {
    describe('when all fields are provided', () => {
      const body: BailHearingInformationBody = {
        isBailHearingDateKnown: 'yes',
        'bailHearingDate-month': '10',
        'bailHearingDate-year': '2023',
        'bailHearingDate-day': '01',
        courtName: 'Hull Crown Court',
        bailHearingMedium: 'inCourt',
      }

      it('returns all fields', () => {
        const page = new BailHearingDate(body, application)
        expect(page.response()).toEqual({
          "Do you know when the applicant's bail hearing is?": 'Yes',
          'When is the bail hearing?': '1 October 2023',
          "What's the name of the court where their bail hearing will take place? (optional)": 'Hull Crown Court',
          'How will their bail hearing be heard? (optional)': 'In court',
        })
      })
    })

    describe('when fields are blank', () => {
      const body: BailHearingInformationBody = {
        isBailHearingDateKnown: 'no',
        'bailHearingDate-month': null,
        'bailHearingDate-year': null,
        'bailHearingDate-day': null,
        courtName: null,
        bailHearingMedium: null,
      }

      it('returns empty strings', () => {
        const page = new BailHearingDate(body, application)
        expect(page.response()).toEqual({
          "Do you know when the applicant's bail hearing is?": 'No',
          'When is the bail hearing?': '',
          "What's the name of the court where their bail hearing will take place? (optional)": '',
          'How will their bail hearing be heard? (optional)': '',
        })
      })
    })
  })

  describe('errors', () => {
    describe('when isBailHearingDateKnown is unanswered', () => {
      const page = new BailHearingDate({}, application)

      it('returns an error', () => {
        expect(page.errors()).toEqual({ isBailHearingDateKnown: 'Select if you know when their bail hearing is' })
      })
    })

    describe('when isBailHearingDateKnown is _YES_', () => {
      describe('when date fields are missing', () => {
        const page = new BailHearingDate(
          {
            isBailHearingDateKnown: 'yes',
            'bailHearingDate-month': '1',
            'bailHearingDate-year': '2222',
          },
          application,
        )

        it('returns an error', () => {
          expect(page.errors()).toEqual({ bailHearingDate: 'Bail hearing date must include a day, month and year' })
        })
      })

      describe('when date fields are invalid', () => {
        const page = new BailHearingDate(
          {
            isBailHearingDateKnown: 'yes',
            'bailHearingDate-month': 'the',
            'bailHearingDate-year': 'year',
            'bailHearingDate-day': 'two thousand',
          },
          application,
        )

        it('returns an error', () => {
          expect(page.errors()).toEqual({ bailHearingDate: 'Bail hearing date must be a real date' })
        })
      })

      describe('when the date is in the past', () => {
        const page = new BailHearingDate(
          {
            isBailHearingDateKnown: 'yes',
            'bailHearingDate-month': '2',
            'bailHearingDate-year': '1440',
            'bailHearingDate-day': '2',
          },
          application,
        )

        it('returns an error', () => {
          expect(page.errors()).toEqual({ bailHearingDate: 'Bail hearing date must be today or in the future' })
        })
      })
    })
  })

  describe('onSave', () => {
    describe('when isBailHearingDateKnown is _NO_', () => {
      const page = new BailHearingDate(
        {
          isBailHearingDateKnown: 'no',
          'bailHearingDate-month': '2',
          'bailHearingDate-year': '3000',
          'bailHearingDate-day': '2',
          courtName: 'some court',
          bailHearingMedium: 'judgeInChambers',
        },
        application,
      )

      it('deletes all other fields', () => {
        page.onSave()

        expect(page.body).toEqual({
          isBailHearingDateKnown: 'no',
        })
      })
    })
  })

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const questions = getQuestions('Roger Smith')['bail-hearing-information']['bail-hearing-information']

      const page = new BailHearingDate({ bailHearingMedium: 'judgeInChambers' }, application)

      expect(page.items()).toEqual([
        {
          value: 'inCourt',
          text: questions.bailHearingMedium.answers.inCourt,
          checked: false,
        },
        {
          value: 'videoLink',
          text: questions.bailHearingMedium.answers.videoLink,
          checked: false,
        },
        {
          value: 'judgeInChambers',
          text: questions.bailHearingMedium.answers.judgeInChambers,
          checked: true,
        },
      ])
    })
  })
})
