/* eslint-disable no-param-reassign */
//  Feature: Referrer completes "risk information: self harm" page
//    So that I can complete the "risk information" task
//    As a referrer
//    I want to complete the 'self harm' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the self harm page
//
//  Scenario: view self harm questions
//    Then I see the "self harm" page
//
//  Scenario: complete page and navigate to next page in risk information task
//    When I complete the self harm page
//    And I continue to the next task / page
//    Then I see the "Applicant ACCT note page" page

import SelfHarmPage from '../../../../pages/apply/risks-and-needs/risk-information/selfHarmPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import DoesTheApplicantHaveAcctNotesPage from '../../../../pages/apply/risks-and-needs/risk-information/doesTheApplicantHaveAcctNotesPage'

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

  //  Scenario: view self harm questions
  //    Then I see the "self harm" page
  it('presents the self harm page', function test() {
    Page.verifyOnPage(SelfHarmPage, this.application)
  })

  //  Scenario: complete page and navigate to next page in risk information task
  //    When I complete the self harm page
  //    And I continue to the next task / page
  //    Then I see the "Applicant ACCT notes" page
  it('navigates to the next page (Applicant ACCT notes)', function test() {
    SelfHarmPage.visit(this.application)
    const page = new SelfHarmPage(this.application)

    page.describePastHarm()
    page.describeCurrentConcerns()
    page.describeSpecificTriggers()
    page.describeCurrentlyPresenting()

    page.clickSubmit()

    Page.verifyOnPage(DoesTheApplicantHaveAcctNotesPage, this.application)
  })
})
