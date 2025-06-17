import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import InformationSources, { InformationSourcesBody } from './informationSources'

describe('InformationSources', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('sets the page title', () => {
      const page = new InformationSources({}, application)

      expect(page.title).toEqual('Where did you get the information on concerns about the applicant from?')
    })
  })

  itShouldHaveNextValue(new InformationSources({}, application), '')
  itShouldHavePreviousValue(new InformationSources({}, application), 'risk-management-arrangements')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new InformationSources({}, application)

      it('includes a validation error for _informationSources_', () => {
        expect(page.errors()).toHaveProperty(
          'informationSources',
          'Select where you got the information on concerns from',
        )
      })
    })

    describe('when previous OASys is selected', () => {
      describe('and no previous OASys date is entered', () => {
        const body: Partial<InformationSourcesBody> = {
          informationSources: ['previousOasys'],
        }

        it('includes a validation error for _previousOasysDate_', () => {
          const page = new InformationSources(body, application)

          expect(page.errors()).toHaveProperty(
            'previousOasysDate',
            'Previous OASys date must include a day, month and year',
          )
        })
      })
    })

    describe('when previous OASys is selected', () => {
      describe('and the previous OASys date is not a valid date', () => {
        const body: Partial<InformationSourcesBody> = {
          informationSources: ['previousOasys'],
          'previousOasysDate-year': '1122',
          'previousOasysDate-month': '13',
          'previousOasysDate-day': '32',
        }

        it('includes a validation error for _previousOasysDate_', () => {
          const page = new InformationSources(body, application)

          expect(page.errors()).toHaveProperty('previousOasysDate', 'Previous OASys date must be a real date')
        })
      })
    })

    describe('when previous OASys is selected', () => {
      describe('and the previous OASys date is in the future', () => {
        const body: Partial<InformationSourcesBody> = {
          informationSources: ['previousOasys'],
          'previousOasysDate-year': '3000',
          'previousOasysDate-month': '11',
          'previousOasysDate-day': '03',
        }

        it('includes a validation error for _previousOasysDate_', () => {
          const page = new InformationSources(body, application)

          expect(page.errors()).toHaveProperty('previousOasysDate', 'Previous OASys date must be in the past')
        })
      })
    })
  })

  describe('onSave', () => {
    it('removes other sources data when the question is not answered with "other"', () => {
      const body: Partial<InformationSourcesBody> = {
        informationSources: ['interview', 'police'],
        otherSourcesDetail: 'some other sources',
      }

      const page = new InformationSources(body, application)

      page.onSave()

      expect(page.body).toEqual({
        informationSources: ['interview', 'police'],
      })
    })
  })

  describe('response', () => {
    it('returns formatted data', () => {
      const body: Partial<InformationSourcesBody> = {
        informationSources: [
          'interview',
          'police',
          'casework',
          'healthcare',
          'ndelius',
          'nomis',
          'previousOasys',
          'currentOasys',
          'other',
        ],
        'previousOasysDate-month': '10',
        'previousOasysDate-year': '2023',
        'previousOasysDate-day': '01',
        otherSourcesDetail: 'some other sources',
      }

      const page = new InformationSources(body, application)

      expect(page.response()).toEqual({
        'Where did you get the information on concerns about the applicant from?':
          'In person interview with applicant\r\nPolice and Safeguarding teams\r\nCase work\r\nHealthcare teams\r\nNDelius (National probation database)\r\nNOMIS (National Offender Management Information System)\r\nPrevious OASys\r\nCurrent OASys\r\nOther\r\n',
        'Enter date of previous OASys': '1 October 2023',
        'Enter other sources (optional)': 'some other sources',
      })
    })

    describe('when a single checkbox is selected', () => {
      it('converts the string value to an array before returning the formatted data', () => {
        const body: Partial<InformationSourcesBody> = {
          informationSources: ['interview'],
        }

        const page = new InformationSources(body, application)

        expect(page.response()).toEqual({
          'Where did you get the information on concerns about the applicant from?':
            'In person interview with applicant\r\n',
          'Enter other sources (optional)': '',
        })
      })
    })
  })
})
