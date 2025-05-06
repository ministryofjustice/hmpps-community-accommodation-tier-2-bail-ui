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
})
