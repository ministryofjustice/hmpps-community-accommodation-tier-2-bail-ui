import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import LearningDifficultiesDetails, { LearningDifficultiesDetailsBody } from './learningDifficultiesDetails'

describe('LearningDifficultiesDetails', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new LearningDifficultiesDetails({}, application)

      expect(page.title).toEqual('Add learning difficulties and neurodiversity needs details for Roger Smith')
    })
  })

  itShouldHaveNextValue(new LearningDifficultiesDetails({}, application), 'brain-injury')
  itShouldHavePreviousValue(new LearningDifficultiesDetails({}, application), 'learning-difficulties')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const requiredFields = [
        ['learningNeedsDetail', 'Enter details of their needs'],
        ['needsSupport', 'Select yes if they need any support'],
        ['receivesTreatment', 'Select yes if they receive any treatment'],
        ['isVulnerable', 'Select yes if they are vulnerable'],
      ]

      it.each(requiredFields)('it includes a validation error for %s', (field, message) => {
        const page = new LearningDifficultiesDetails({}, application)
        const errors = page.errors()

        expect(errors[field as keyof typeof errors]).toEqual(message)
      })
    })

    describe('when _needsSupport_ is YES', () => {
      const page = new LearningDifficultiesDetails({ needsSupport: 'yes' }, application)

      describe('and _interactionDetail_ is UNANSWERED', () => {
        it('includes a validation error for _supportDetail_', () => {
          expect(page.errors()).toHaveProperty('supportDetail', 'Enter the type of support needed')
        })
      })
    })

    describe('when _receivesTreatment_ is YES', () => {
      const page = new LearningDifficultiesDetails({ receivesTreatment: 'yes' }, application)

      describe('and _treatmentDetail_ is UNANSWERED', () => {
        it('includes a validation error for _treatmentDetail_', () => {
          expect(page.errors()).toHaveProperty('treatmentDetail', 'Enter details about their treatment')
        })
      })
    })

    describe('when _isVulnerable_ is YES', () => {
      const page = new LearningDifficultiesDetails({ isVulnerable: 'yes' }, application)

      describe('and _vulnerabilityDetail_ is UNANSWERED', () => {
        it('includes a validation error for _vulnerabilityDetail_', () => {
          expect(page.errors()).toHaveProperty('vulnerabilityDetail', 'Enter how they are vulnerable')
        })
      })
    })
  })

  describe('onSave', () => {
    it('removes support data when the question is set to "no"', () => {
      const body: Partial<LearningDifficultiesDetailsBody> = {
        needsSupport: 'no',
        supportDetail: 'support detail',
      }

      const page = new LearningDifficultiesDetails(body, application)

      page.onSave()

      expect(page.body).toEqual({
        needsSupport: 'no',
      })
    })

    it('removes treatment data when the question is set to "no"', () => {
      const body: Partial<LearningDifficultiesDetailsBody> = {
        receivesTreatment: 'no',
        treatmentDetail: 'treatment detail',
      }

      const page = new LearningDifficultiesDetails(body, application)

      page.onSave()

      expect(page.body).toEqual({
        receivesTreatment: 'no',
      })
    })

    it('removes vulnerability data when the question is set to "no"', () => {
      const body: Partial<LearningDifficultiesDetailsBody> = {
        isVulnerable: 'no',
        vulnerabilityDetail: 'Vulnerability detail',
      }

      const page = new LearningDifficultiesDetails(body, application)

      page.onSave()

      expect(page.body).toEqual({
        isVulnerable: 'no',
      })
    })
  })

  describe('response', () => {
    it('returns an empty object', () => {
      const body: LearningDifficultiesDetailsBody = {
        learningNeedsDetail: 'some learning needs details',
        needsSupport: 'yes',
        supportDetail: 'some support details',
        receivesTreatment: 'yes',
        treatmentDetail: 'some treatment details',
        isVulnerable: 'yes',
        vulnerabilityDetail: 'some vulnerability details',
      }

      const page = new LearningDifficultiesDetails(body, application)

      expect(page.response()).toEqual({})
    })
  })
})
