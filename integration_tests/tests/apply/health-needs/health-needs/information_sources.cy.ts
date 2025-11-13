/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Health needs: information sources' page
//    So that I can complete the "Health needs" task
//    As a referrer
//    I want to complete the 'information sources' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the information sources page
//
//  Scenario: view information sources questions
//    Then I see the "information sources" page
//
//  Scenario: complete page and navigate to next page in health needs task
//    When I complete the information sources page
//    And I continue to the next task / page
//    Then I am returned to the task list
//    And I see that the health needs task is complete

import Page from '../../../../pages/page'
import TaskListPage from '../../../../pages/apply/taskListPage'
import InformationSourcesPage from '../../../../pages/apply/health_needs/health-needs/informationSourcesPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "information sources" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['health-needs'] = {}
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

    // And I am on the "information sources" page
    // -----------------------------------
    InformationSourcesPage.visit(this.application)
  })

  //  Scenario: view "information sources" questions
  //    Then I see the "information sources" page
  it('presents "information sources" page', function test() {
    Page.verifyOnPage(InformationSourcesPage, this.application)
  })

  //  Scenario: complete page and navigate to next page in health needs task
  //    When I complete the information sources page
  //    And I continue to the next task / page
  //    Then I am returned to the task list
  //    And I see that the health needs task is complete
  it('navigates to the next page (back to task list)', function test() {
    // So that the status of the task will be complete we set application.data
    // to the full set
    cy.fixture('applicationData.json').then(applicationData => {
      const answered = {
        ...this.application,
        data: applicationData,
      }
      cy.task('stubApplicationGet', { application: answered })
    })

    InformationSourcesPage.visit(this.application)
    const page = new InformationSourcesPage(this.application)

    page.completeForm()
    page.clickSubmit()

    const taskListPage = Page.verifyOnPage(TaskListPage, this.application)

    taskListPage.shouldShowTaskStatus('health-needs', 'Completed')
  })
})
