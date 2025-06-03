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
})
