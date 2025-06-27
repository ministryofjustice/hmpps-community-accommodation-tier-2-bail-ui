import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import LearningDifficulties from './learningDifficulties'

describe('LearningDifficulties', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new LearningDifficulties({}, application)

      expect(page.title).toEqual('Does Roger Smith have any learning difficulties or neurodiversity needs?')
    })
  })

  itShouldHavePreviousValue(new LearningDifficulties({}, application), 'communication-and-language-relevance-check')
  describe('when there are needs', () => {
    itShouldHaveNextValue(
      new LearningDifficulties({ hasLearningDifficultiesOrNeurodiversityNeeds: 'yes' }, application),
      'learning-difficulties-details',
    )
  })
  describe('when there are no needs', () => {
    itShouldHaveNextValue(
      new LearningDifficulties({ hasLearningDifficultiesOrNeurodiversityNeeds: 'no' }, application),
      'brain-injury',
    )
  })

  describe('errors', () => {
    it('returns an error if no answer is provided', () => {
      const page = new LearningDifficulties({ hasLearningDifficultiesOrNeurodiversityNeeds: null }, application)

      expect(page.errors()).toHaveProperty(
        'hasLearningDifficultiesOrNeurodiversityNeeds',
        'Select yes if they have any learning difficulties or neurodiversity needs',
      )
    })
  })

  describe('response', () => {
    describe('when _hasLearningDifficultiesOrNeurodiversityNeeds_ is set to NO', () => {
      it('returns only that question', () => {
        const page = new LearningDifficulties({ hasLearningDifficultiesOrNeurodiversityNeeds: 'no' }, application)

        expect(page.response()).toEqual({
          'Does Roger Smith have any learning difficulties or neurodiversity needs?': 'No',
        })
      })
    })

    describe('when _hasLearningDifficultiesOrNeurodiversityNeeds_ is set to YES', () => {
      application.data = {
        'health-needs': {
          'learning-difficulties': {
            hasLearningDifficultiesOrNeurodiversityNeeds: 'yes',
          },
          'learning-difficulties-details': {
            learningNeedsDetail: 'some learning needs details',
            needsSupport: 'yes',
            supportDetail: 'some support details',
            receivesTreatment: 'yes',
            treatmentDetail: 'some treatment details',
            isVulnerable: 'yes',
            vulnerabilityDetail: 'some vulnerability details',
          },
        },
      }

      it('returns questions and answers for both learning needs pages', () => {
        const page = new LearningDifficulties({ hasLearningDifficultiesOrNeurodiversityNeeds: 'yes' }, application)

        expect(page.response()).toEqual({
          'Does Roger Smith have any learning difficulties or neurodiversity needs?': 'Yes',
          'Enter details of their needs': 'some learning needs details',
          'Do they need any support as a result of this?': 'Yes',
          'Enter details of the type of support needed, including any support they have already or will need':
            'some support details',
          'Do they receive any treatment for this?': 'Yes',
          'Enter details about their treatment': 'some treatment details',
          'Are they vulnerable as a result of this?': 'Yes',
          'Enter details of how they might be vulnerable': 'some vulnerability details',
        })
      })
    })
  })
})
