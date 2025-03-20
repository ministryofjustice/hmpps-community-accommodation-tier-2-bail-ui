import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import LiaisonAndDiversion from './liaisonAndDiversion'

describe('LiaisonAndDiversion', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new LiaisonAndDiversion({}, application)

      expect(page.title).toEqual('Liaison and Diversion Assessment for Roger Smith')
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

  itShouldHaveNextValue(new LiaisonAndDiversion({}, application), 'health-needs-information')
  itShouldHavePreviousValue(new LiaisonAndDiversion({}, application), 'taskList')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new LiaisonAndDiversion({}, application)

      it('includes a validation error for _liaisonAndDiversionAssessment_', () => {
        expect(page.errors()).toHaveProperty(
          'liaisonAndDiversionAssessment',
          "Select if a Liaison and Diversion Assessment has been carried out, or select 'I don't know'",
        )
      })
    })
  })
})
