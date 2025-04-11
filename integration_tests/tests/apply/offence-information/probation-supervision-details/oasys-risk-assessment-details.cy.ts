/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'oasys risk assessment' page
//    So that I can complete the "oasys risk assessment" task
//    As a referrer
//    I want to complete the 'oasys risk assessment' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "oasys risk assessment" page
//
//  Scenario: complete page and navigate to task list page
//    Given I am on the oasys risk assessment details page
//    And I select at least 1 risk for in the community
//    And I select at least 1 risk for in custody
//    When I continue to the next task / page
//    Then I see the "task list" page

import OASysRiskAssessmentDetailsPage from '../../../../pages/apply/offence-information/probation-supervision-details/oasysRiskAssessmentDetailsPage'
import TaskListPage from '../../../../pages/apply/taskListPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "Offence information" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['add-probation-supervision-details']['oasys-risk-assessment-details']
      const application = applicationFactory.build({
        id: 'abc123',
        person,
        data: applicationData,
      })
      cy.wrap(application).as('application')
    })

    const applicationWithDeletedData = applicationFactory.build({
      id: 'abc123',
      person,
      data: {
        'add-probation-supervision-details': { 'oasys-risk-assessment-details': {} },
      },
    })
    cy.wrap(applicationWithDeletedData).as('applicationWithDeletedData')
  })

  beforeEach(function test() {
    // And an application exists
    // -------------------------
    cy.task('stubApplicationGet', { application: this.application })
    cy.task('stubApplicationUpdate', { application: this.application })

    // Given I am logged in
    //---------------------
    cy.signIn()

    // And I am on the oasys risk assessment details page
    // --------------------------------
    OASysRiskAssessmentDetailsPage.visit(this.application)
  })

  //  Scenario: presents an error if no answers selected
  //    Given I am on the oasys risk assessment details page
  //    And I do not check any answers
  //    When I continue to the next task / page
  //    Then I am presented with errors
  it('shows an error for risks', function test() {
    const page = new OASysRiskAssessmentDetailsPage(this.application)

    // reset the application to the deleted state
    cy.task('stubApplicationGet', { application: this.applicationWithDeletedData })

    page.clickSubmit()

    page.shouldShowErrorSummary()
  })

  //  Scenario: presents an error if risk level is not selected
  //    Given I am on the oasys risk assessment details page
  //    And I check an answer for the type of risk
  //    And I do not check the corresponding answer for risk level
  //    When I continue to the next task / page
  //    Then I am presented with errors
  it('shows an error for risk levels', function test() {
    const page = new OASysRiskAssessmentDetailsPage(this.application)

    // reset the application to the deleted state
    cy.task('stubApplicationGet', { application: this.applicationWithDeletedData })

    page.completeRisksWithoutRiskLevels()

    page.clickSubmit()

    page.shouldShowErrorSummaryForRiskLevels()
  })

  //  Scenario: complete page and navigate to task list page
  //    Given I am on the oasys risk assessment details page
  //    And I select at least 1 risk for in the community
  //    And I select at least 1 risk for in custody
  //    When I continue to the next task / page
  //    Then I see the "task list" page
  it('navigates to the next page (task list)', function test() {
    const page = new OASysRiskAssessmentDetailsPage(this.application)

    page.completeInTheCommunityRisks()
    page.completeInCustodyRisks()

    page.clickSubmit()

    Page.verifyOnPage(TaskListPage, this.application)
  })
})
