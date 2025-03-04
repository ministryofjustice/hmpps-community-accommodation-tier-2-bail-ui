//  Feature: complete self harm page
//

import SelfHarmPage from '../../../../pages/apply/risks-and-needs/risk-information/selfHarmPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Complete "Self harm" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['risk-information'] = {}
      const application = applicationFactory.build({
        id: 'abc123',
        person,
      })
      application.data = applicationData
      cy.wrap(application).as('application')
      cy.wrap(application.data).as('applicationData')
    })
  })

  beforeEach(function test() {
    // And an application exists
    cy.task('stubApplicationGet', { application: this.application })
    cy.task('stubApplicationUpdate', { application: this.application })

    // Given I am logged in
    //---------------------
    cy.signIn()

    // And I visit the Self harm page
    // --------------------------------
    cy.visit('applications/abc123/tasks/risk-information/pages/self-harm')
  })

  it('exists', function test() {
    // Given I am on the Self harm page
    Page.verifyOnPage(SelfHarmPage, this.application)
  })
})
