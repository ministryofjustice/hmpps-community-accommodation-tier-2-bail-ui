import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import CommunicationAndLanguageRelevanceCheck from './communicationAndLanguageRelevanceCheck'

describe('CommunicationAndLanguageRelevanceCheck', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHaveNextValue(new CommunicationAndLanguageRelevanceCheck({}, application), 'learning-difficulties')
  itShouldHaveNextValue(
    new CommunicationAndLanguageRelevanceCheck({ hasCommunicationAndLanguageNeeds: 'yes' }, application),
    'communication-and-language',
  )
  itShouldHavePreviousValue(new CommunicationAndLanguageRelevanceCheck({}, application), 'mental-health')

  describe('errors', () => {
    it('includes a validation error when _hasCommunicationAndLanguageNeeds_ is not answered', () => {
      const page = new CommunicationAndLanguageRelevanceCheck({}, application)

      expect(page.errors()).toHaveProperty(
        'hasCommunicationAndLanguageNeeds',
        'Select yes if they have any communication and language needs',
      )
    })
  })

  describe('response', () => {
    describe('when _hasCommunicationAndLanguageNeeds_ is set to NO', () => {
      it('returns only that question', () => {
        const page = new CommunicationAndLanguageRelevanceCheck({ hasCommunicationAndLanguageNeeds: 'no' }, application)

        expect(page.response()).toEqual({
          'Does Roger Smith have any communication and language needs?': 'No',
        })
      })
    })

    describe('when _hasCommunicationAndLanguageNeeds_ is set to YES', () => {
      application.data = {
        'health-needs': {
          'communication-and-language-relevance-check': {
            hasCommunicationAndLanguageNeeds: 'yes',
          },
          'communication-and-language': {
            hasImpairments: 'yes',
            impairmentsDetail: 'some impairment details',
            requiresInterpreter: 'yes',
            interpretationDetail: 'some interpretation details',
          },
        },
      }

      it('returns questions and answers for both communication and language needs pages', () => {
        const page = new CommunicationAndLanguageRelevanceCheck(
          { hasCommunicationAndLanguageNeeds: 'yes' },
          application,
        )

        expect(page.response()).toEqual({
          'Does Roger Smith have any communication and language needs?': 'Yes',
          'Do they have any literacy, visual or hearing impairments?': 'Yes',
          'Enter details of their needs, including any support they have already or will need':
            'some impairment details',
          'Do they need an interpreter?': 'Yes',
          'What language do they need an interpreter for?': 'some interpretation details',
        })
      })
    })
  })
})
