import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import LiaisonAndDiversion from './liaisonAndDiversion'

describe('LiaisonAndDiversion', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new LiaisonAndDiversion({}, application)

      expect(page.title).toEqual('Liaison & Diversion Assessment for Roger Smith')
    })
  })

  describe('questions', () => {
    const page = new LiaisonAndDiversion({}, application)

    describe('liaisonAndDiversion', () => {
      it('has a question', () => {
        expect(page.questions.liaisonAndDiversionAssessment.question).toBeDefined()
      })
    })
  })

  itShouldHaveNextValue(new LiaisonAndDiversion({}, application), 'other-health')
  itShouldHavePreviousValue(new LiaisonAndDiversion({}, application), 'brain-injury')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new LiaisonAndDiversion({}, application)

      it('includes a validation error for _liaisonAndDiversionAssessment_', () => {
        expect(page.errors()).toHaveProperty(
          'liaisonAndDiversionAssessment',
          'Confirm whether a Liaison & Diversion Assessment has been requested',
        )
      })
    })
  })
})
