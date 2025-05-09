import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import InformationSources, { InformationSourcesBody } from './informationSources'

describe('InformationSources', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('sets the page title', () => {
      const page = new InformationSources({}, application)

      expect(page.title).toEqual("Where did you get the information on the applicant's health needs from?")
    })
  })

  itShouldHaveNextValue(new InformationSources({}, application), '')
  itShouldHavePreviousValue(new InformationSources({}, application), 'other-health')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new InformationSources({}, application)

      it('includes a validation error for _informationSources_', () => {
        expect(page.errors()).toHaveProperty(
          'informationSources',
          'Select where you got the information on health needs from',
        )
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
        informationSources: ['interview', 'police', 'casework', 'healthcare', 'ndelius', 'nomis', 'oasys', 'other'],
        otherSourcesDetail: 'some other sources',
      }

      const page = new InformationSources(body, application)

      expect(page.response()).toEqual({
        "Where did you get the information on the applicant's health needs from?":
          'In person interview with applicant\r\nPolice and Safeguarding teams\r\nCase work\r\nHealthcare teams\r\nNDelius (National probation database)\r\nNOMIS (National Offender Management Information System)\r\nPrevious or current OASys\r\nOther\r\n',
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
          "Where did you get the information on the applicant's health needs from?":
            'In person interview with applicant\r\n',
          'Enter other sources (optional)': '',
        })
      })
    })
  })
})
