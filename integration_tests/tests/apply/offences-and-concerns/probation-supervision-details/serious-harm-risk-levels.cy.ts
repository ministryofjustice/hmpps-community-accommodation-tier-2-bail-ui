/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'serious harm risk levels' page
//    So that I can complete the "add probation supervision details" task
//    As a referrer
//    I want to complete the 'serious harm risk levels' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "serious harm risk levels" page
//
//  Scenario: complete page and navigate to task list page
//    Given I am on the serious harm risk levels page
//    And I complete the page
//    When I continue to the next task / page
//    Then I see the "task list" page

import SeriousHarmRiskLevelsPage from '../../../../pages/apply/offences-and-concerns/probation-supervision-details/seriousHarmRiskLevelsPage'
import TaskListPage from '../../../../pages/apply/taskListPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "Offences and concerns" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['add-probation-supervision-details']['serious-harm-risk-levels']
      const application = applicationFactory.build({
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

    // And I am on the serious harm risk levels details page
    // --------------------------------
    SeriousHarmRiskLevelsPage.visit(this.application)
  })

  //  Scenario: complete page and navigate to task list page
  //    Given I am on the serious harm risk levels details page
  //    And I complete the page
  //    When I continue to the next task / page
  //    Then I see the "task list" page
  it('navigates to the next page (task list)', function test() {
    const page = new SeriousHarmRiskLevelsPage(this.application)

    page.selectRiskLevels()

    page.clickSubmit()

    Page.verifyOnPage(TaskListPage, this.application)
  })
})
