/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Referrer details' task
//    So that I can complete the 'Referrer details' task
//    As a referrer
//    I want to answer questions on the 'Location' page
//
//  Background:
//    Given I am logged in
//    And I'm on the 'Location' page
//
//  Scenario: view 'Location' page
//    Then I see the "Location" page
//
//  Scenario: navigate to task list on completion of task
//    When I complete the "Location" page
//    And I continue to the next task / page
//    Then I am taken back to the task list
//    And I see that the referrer details task is complete

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import LocationPage from '../../../../pages/apply/before_you_apply/referrer_details/locationPage'
import TaskListPage from '../../../../pages/apply/taskListPage'

context('Complete "Location" page in "Referrer details" task', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['referrer-details'] = {}
      const application = applicationFactory.build({
        person,
        data: applicationData,
      })
      cy.wrap(application).as('application')
    })
  })

  beforeEach(function test() {
    //  Background:
    //  Given I am logged in
    cy.signIn()
    cy.task('stubApplicationGet', { application: this.application })
    cy.task('stubApplicationUpdate', { application: this.application })

    //  And I'm on the 'Location' page
    LocationPage.visit(this.application)
  })

  //  Scenario: view 'Location' page
  it('displays page', function test() {
    // Then I see the "Location" page
    Page.verifyOnPage(LocationPage, this.application)
  })

  //  Scenario: navigate to task list on completion of task
  it('navigates to the task list', function test() {
    // So that the status of the task will be complete we set application.data
    // to the full set
    cy.fixture('applicationData.json').then(applicationData => {
      const answered = {
        ...this.application,
        data: applicationData,
      }
      cy.task('stubApplicationGet', { application: answered })
    })

    // When I complete the "Location" page
    const page = Page.verifyOnPage(LocationPage, this.application)
    page.completeForm()

    // And I continue to the next task / page
    page.clickSubmit()

    // Then I am taken back to the task list
    const taskListPage = Page.verifyOnPage(TaskListPage)

    // And I see that the referrer details task is complete
    taskListPage.shouldShowTaskStatus('referrer-details', 'Completed')
  })
})
