import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import LearningDifficulties, { LearningDifficultiesBody } from './learningDifficulties'

describe('LearningDifficulties', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new LearningDifficulties({}, application)

      expect(page.title).toEqual('Learning difficulties and neurodiversity needs details for Roger Smith')
    })
  })

  itShouldHaveNextValue(new LearningDifficulties({}, application), 'brain-injury')
  itShouldHavePreviousValue(new LearningDifficulties({}, application), 'communication-and-language-relevance-check')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new LearningDifficulties({}, application)

      it('includes a validation error for _hasLearningNeeds_', () => {
        expect(page.errors()).toHaveProperty(
          'hasLearningNeeds',
          'Select if they have any needs relating to learning difficulties or neurodiversity',
        )
      })

      it('includes a validation error for _needsSupport_', () => {
        expect(page.errors()).toHaveProperty('needsSupport', 'Select if they need any support')
      })

      it('includes a validation error for _receivesTreatment_', () => {
        expect(page.errors()).toHaveProperty('receivesTreatment', 'Select if they receive any treatment')
      })

      it('includes a validation error for _isVulnerable_', () => {
        expect(page.errors()).toHaveProperty('isVulnerable', 'Select if they are vulnerable')
      })
    })

    describe('when _hasLearningNeeds_ is YES', () => {
      const page = new LearningDifficulties({ hasLearningNeeds: 'yes' }, application)

      describe('and _learningNeedsDetail_ is UNANSWERED', () => {
        it('includes a validation error for _learningNeedsDetail_', () => {
          expect(page.errors()).toHaveProperty('learningNeedsDetail', 'Enter details of their needs')
        })
      })
    })

    describe('when _needsSupport_ is YES', () => {
      const page = new LearningDifficulties({ needsSupport: 'yes' }, application)

      describe('and _interactionDetail_ is UNANSWERED', () => {
        it('includes a validation error for _supportDetail_', () => {
          expect(page.errors()).toHaveProperty('supportDetail', 'Enter the type of support needed')
        })
      })
    })

    describe('when _receivesTreatment_ is YES', () => {
      const page = new LearningDifficulties({ receivesTreatment: 'yes' }, application)

      describe('and _treatmentDetail_ is UNANSWERED', () => {
        it('includes a validation error for _treatmentDetail_', () => {
          expect(page.errors()).toHaveProperty('treatmentDetail', 'Enter details about their treatment')
        })
      })
    })

    describe('when _isVulnerable_ is YES', () => {
      const page = new LearningDifficulties({ isVulnerable: 'yes' }, application)

      describe('and _vulnerabilityDetail_ is UNANSWERED', () => {
        it('includes a validation error for _vulnerabilityDetail_', () => {
          expect(page.errors()).toHaveProperty('vulnerabilityDetail', 'Enter how they are vulnerable')
        })
      })
    })
  })

  describe('onSave', () => {
    it('removes learning needs data when the question is set to "no"', () => {
      const body: Partial<LearningDifficultiesBody> = {
        hasLearningNeeds: 'no',
        learningNeedsDetail: 'Learning needs detail',
      }

      const page = new LearningDifficulties(body, application)

      page.onSave()

      expect(page.body).toEqual({
        hasLearningNeeds: 'no',
      })
    })

    it('removes support data when the question is set to "no"', () => {
      const body: Partial<LearningDifficultiesBody> = {
        needsSupport: 'no',
        supportDetail: 'support detail',
      }

      const page = new LearningDifficulties(body, application)

      page.onSave()

      expect(page.body).toEqual({
        needsSupport: 'no',
      })
    })

    it('removes treatment data when the question is set to "no"', () => {
      const body: Partial<LearningDifficultiesBody> = {
        receivesTreatment: 'no',
        treatmentDetail: 'treatment detail',
      }

      const page = new LearningDifficulties(body, application)

      page.onSave()

      expect(page.body).toEqual({
        receivesTreatment: 'no',
      })
    })

    it('removes vulnerability data when the question is set to "no"', () => {
      const body: Partial<LearningDifficultiesBody> = {
        isVulnerable: 'no',
        vulnerabilityDetail: 'Vulnerability detail',
      }

      const page = new LearningDifficulties(body, application)

      page.onSave()

      expect(page.body).toEqual({
        isVulnerable: 'no',
      })
    })
  })
})
