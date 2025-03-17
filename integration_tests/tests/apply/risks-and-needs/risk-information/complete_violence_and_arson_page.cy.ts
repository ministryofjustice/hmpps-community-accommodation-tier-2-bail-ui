//  Feature: Referrer completes "risk information: violence and arson" page
//    So that I can complete the "risk information" task
//    As a referrer
//    I want to complete the 'violence and arson' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the violence and arson page
//
//  Scenario: view violence and arson questions
//    Then I see the "violence and arson" page
//
//  Scenario: complete page and navigate to next page in risk information task
//    When I complete the violence and arson page
//    And I continue to the next task / page
//    Then I see the "living in the community" page

import ViolenceAndArsonPage from '../../../../pages/apply/risks-and-needs/risk-information/violenceAndArsonPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import LivingInTheCommunityPage from '../../../../pages/apply/risks-and-needs/risk-information/livingInTheCommunityPage'

context('Complete "Violence and arson" page', () => {
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

    // And I visit the Violence and arson page
    // --------------------------------
    cy.visit('applications/abc123/tasks/risk-information/pages/violence-and-arson')
  })

  //  Scenario: view violence and arson questions
  //    Then I see the "violence and arson" page
  it('presents the violence and arson page', function test() {
    Page.verifyOnPage(ViolenceAndArsonPage, this.application)
  })

  //  Scenario: complete page and navigate to next page in risk information task
  //    When I complete the violence and arson page
  //    And I continue to the next task / page
  //    Then I see the "living in the community" page
  it('navigates to the next page (living in the community)', function test() {
    ViolenceAndArsonPage.visit(this.application)
    const page = new ViolenceAndArsonPage(this.application)

    page.describePastConvictions()
    page.describeCurrentConcerns()

    page.clickSubmit()

    Page.verifyOnPage(LivingInTheCommunityPage, this.application)
  })
})
