/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'non-standard bail conditions' page
//    So that I can complete the "Bail conditions" task
//    As a referrer
//    I want to complete the 'non-standard bail conditions' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I visit the 'non-standard bail conditions' page
//
//  Scenario: view 'non-standard bail conditions' page
//    Then I see the "non-standard bail conditions" page
//
//  Scenario: navigate to task list on completion of task
//    When I complete the "non-standard bail conditions" page
//    And I continue to the next task / page
//    Then I am taken to the Task List

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import NonStandardBailConditionsPage from '../../../../pages/apply/bail-information/bail-conditions/nonStandardBailConditionsPage'
import TaskListPage from '../../../../pages/apply/taskListPage'

context('Visit "non-standard bail conditions" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['bail-conditions']
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

    // And I visit the 'non-standard bail conditions' page
    // --------------------------------
    NonStandardBailConditionsPage.visit(this.application)
  })

  //  Scenario: view 'non-standard bail conditions' page
  // ----------------------------------------------

  it('presents non-standard bail conditions page', function test() {
    //    Then I see the "non-standard bail conditions" page
    Page.verifyOnPage(NonStandardBailConditionsPage, this.application)
  })

  //  Scenario: navigate to task list on completion of task
  // ----------------------------------------------
  it('navigates to the next page', function test() {
    //  When I complete the "non-standard bail conditions" page
    const page = Page.verifyOnPage(NonStandardBailConditionsPage, this.application)
    page.completeForm()

    //  And I continue to the next task / page
    page.clickSubmit()

    //  Then I am taken to the Task List
    Page.verifyOnPage(TaskListPage, this.application)
  })
})
