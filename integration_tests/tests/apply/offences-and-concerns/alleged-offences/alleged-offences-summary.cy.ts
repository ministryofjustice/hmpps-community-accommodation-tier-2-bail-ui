/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Alleged offences summary' page
//    So that I can complete the "Alleged offences" task
//    As a referrer
//    I want to complete the 'Alleged offences summary' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "Alleged offences summary" page
//
//  Scenario: there are existing offences in the application
//    And I navigate to the alleged offences summary page
//    Then I am presented with the page
//
//  Scenario: complete page and navigate to task list page
//    When I continue to the next task / page
//    Then I see the "task list" page

import AllegedOffencesSummaryPage from '../../../../pages/apply/offences-and-concerns/alleged-offences/allegedOffencesSummaryPage'
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
      delete applicationData['alleged-offences']
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

    // And I am on the Alleged offences page
    // --------------------------------
    AllegedOffencesSummaryPage.visit(this.application)
  })

  //  Scenario: there are existing offences in the application
  //    And I navigate to the alleged offences summary page
  //    Then I see the "Alleged offence data" page
  it('presents Alleged offence summary page', function test() {
    Page.verifyOnPage(AllegedOffencesSummaryPage, this.application)
  })

  //  Scenario: complete page and navigate to task list page
  //    When I continue to the next task / page
  //    Then I see the "task list" page
  it('navigates to the next page (task list)', function test() {
    const page = new AllegedOffencesSummaryPage(this.application)

    page.describeAllegedOffencesSummary()

    page.clickSubmit()

    Page.verifyOnPage(TaskListPage, this.applicationWithData)
  })
})
