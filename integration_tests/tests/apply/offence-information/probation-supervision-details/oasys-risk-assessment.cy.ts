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
//  Scenario: complete page and navigate to risk assessment details page
//    Given I am on the oasys risk assessment page
//    And I answer yes to the risk assessment question
//    And I answer yes to the OASys having been updated question
//    When I continue to the next task / page
//    Then I see the "risk assessment details" page
//
//  Scenario: complete page and navigate to task list page
//    Given I am on the oasys risk assessment page
//    And I answer yes to the risk assessment question
//    And I answer no to the OASys having been updated question
//    When I continue to the next task / page
//    Then I see the "task list" page
//
//  Scenario: complete page and navigate to task list page
//    Given I am on the oasys risk assessment page
//    And I answer no to the risk assessment question
//    When I continue to the next task / page
//    Then I see the "task list" page

import OASysRiskAssessmentPage from '../../../../pages/apply/offence-information/probation-supervision-details/oasysRiskAssessmentPage'
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
      delete applicationData['add-probation-supervision-details']['oasys-risk-assessment']
      const application = applicationFactory.build({
        id: 'abc123',
        person,
        data: applicationData,
      })
      cy.wrap(application).as('application')
    })
  })

  beforeEach(function test() {
    // And an application exists
    // -------------------------
    cy.task('stubApplicationGet', { application: this.application })
    cy.task('stubApplicationUpdate', { application: this.application })

    // Given I am logged in
    //---------------------
    cy.signIn()

    // And I am on the oasys risk assessment page
    // --------------------------------
    OASysRiskAssessmentPage.visit(this.application)
  })

  //  Scenario: complete page and navigate to task list page
  //    Given I am on the oasys risk assessment page
  //    And I answer yes to the risk assessment question
  //    And I answer yes to the OASys having been updated question
  //    When I continue to the next task / page
  //    Then I see the "task list" page
  it('navigates to the next page (task list) when both answers are "yes"', function test() {
    const page = new OASysRiskAssessmentPage(this.application)

    page.selectYesToRiskAssessmentDone()
    page.selectYesToOASysHasBeenUpdated()

    page.clickSubmit()

    Page.verifyOnPage(OASysRiskAssessmentDetailsPage, this.application)
  })

  //  Scenario: complete page and navigate to task list page
  //    Given I am on the oasys risk assessment page
  //    And I answer yes to the risk assessment question
  //    And I answer no to the OASys having been updated question
  //    When I continue to the next task / page
  //    Then I see the "task list" page
  it('navigates to the next page (task list) when first answer is "yes" and follow-up is "no"', function test() {
    const page = new OASysRiskAssessmentPage(this.application)

    page.selectYesToRiskAssessmentDone()
    page.selectNoToOASysHasBeenUpdated()

    page.clickSubmit()

    Page.verifyOnPage(TaskListPage, this.application)
  })

  //  Scenario: complete page and navigate to task list page
  //    Given I am on the oasys risk assessment page
  //    And I answer no to the risk assessment question
  //    When I continue to the next task / page
  //    Then I see the "task list" page
  it('navigates to the next page (task list) when first answer is "no"', function test() {
    const page = new OASysRiskAssessmentPage(this.application)

    page.selectNoToRiskAssessmentDone()

    page.clickSubmit()

    Page.verifyOnPage(TaskListPage, this.application)
  })
})
