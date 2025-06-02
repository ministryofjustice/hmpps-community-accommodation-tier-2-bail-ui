import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import CommunicationAndLanguage, { CommunicationAndLanguageBody } from './communicationAndLanguage'

describe('CommunicationAndLanguage', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHaveNextValue(new CommunicationAndLanguage({}, application), 'learning-difficulties')
  itShouldHavePreviousValue(new CommunicationAndLanguage({}, application), 'communication-and-language-relevance-check')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new CommunicationAndLanguage({}, application)

      it('includes a validation error for _hasImpairments_', () => {
        expect(page.errors()).toHaveProperty(
          'hasImpairments',
          `Select if they have any literacy, visual or hearing impairments`,
        )
      })

      it('includes a validation error for _requiresInterpreter_', () => {
        expect(page.errors()).toHaveProperty('requiresInterpreter', `Select if they need an interpreter`)
      })
    })

    describe('when _hasImpairments_ is YES', () => {
      const page = new CommunicationAndLanguage({ hasImpairments: 'yes' }, application)

      describe('and _impairmentsDetail_ is UNANSWERED', () => {
        it('includes a validation error for _impairmentsDetail_', () => {
          expect(page.errors()).toHaveProperty('impairmentsDetail', 'Enter details of their needs')
        })
      })
    })

    describe('when _requiresInterpreter_ is YES', () => {
      const page = new CommunicationAndLanguage({ requiresInterpreter: 'yes' }, application)

      describe('and _interpretationDetail_ is UNANSWERED', () => {
        it('includes a validation error for _interpretationDetail_', () => {
          expect(page.errors()).toHaveProperty(
            'interpretationDetail',
            'Enter the language they need an interpreter for',
          )
        })
      })
    })
  })

  describe('onSave', () => {
    it('removes impairment data when the question is set to "no"', () => {
      const body: Partial<CommunicationAndLanguageBody> = {
        hasImpairments: 'no',
        impairmentsDetail: 'Impairment detail',
      }

      const page = new CommunicationAndLanguage(body, application)

      page.onSave()

      expect(page.body).toEqual({
        hasImpairments: 'no',
      })
    })

    it('removes interpreter data when the question is set to "no"', () => {
      const body: Partial<CommunicationAndLanguageBody> = {
        requiresInterpreter: 'no',
        interpretationDetail: 'Interpretation detail',
      }

      const page = new CommunicationAndLanguage(body, application)

      page.onSave()

      expect(page.body).toEqual({
        requiresInterpreter: 'no',
      })
    })
  })
})
