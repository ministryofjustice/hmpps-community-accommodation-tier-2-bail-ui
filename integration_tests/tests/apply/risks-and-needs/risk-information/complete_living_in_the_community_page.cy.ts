//  Feature: complete living in the community page
//

import LivingInTheCommunityPage from '../../../../pages/apply/risks-and-needs/risk-information/livingInTheCommunityPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Complete "Living in the community" page', () => {
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

    // And I visit the Living in the community page
    // --------------------------------
    cy.visit('applications/abc123/tasks/risk-information/pages/living-in-the-community')
  })

  it('exists', function test() {
    // Given I am on the Living in the community page
    Page.verifyOnPage(LivingInTheCommunityPage, this.application)
  })
})
