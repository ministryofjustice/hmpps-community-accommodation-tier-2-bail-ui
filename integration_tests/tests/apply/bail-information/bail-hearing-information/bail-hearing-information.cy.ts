/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'bail hearing information' page
//    So that I can complete the "Bail hearing information" task
//    As a referrer
//    I want to complete the 'bail hearing information' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I visit the 'bail hearing information' page
//
//  Scenario: view 'bail hearing information' page
//    Then I see the "bail hearing information" page
//
//  Scenario: navigate to task list on completion of task
//    When I complete the "bail hearing information" page
//    And I continue to the next task / page
//    Then I am taken to the Task List
//    And I see that the task is now complete

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import BailHearingInformationPage from '../../../../pages/apply/bail-information/bail-hearing-information/bailHearingInformation'
import TaskListPage from '../../../../pages/apply/taskListPage'

context('Visit "bail hearing information" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['bail-hearing-information']
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

    // And I visit the 'bail hearing information' page
    // --------------------------------
    BailHearingInformationPage.visit(this.application)
  })

  //  Scenario: view 'bail hearing information' page
  // ----------------------------------------------

  it('presents bail hearing information page', function test() {
    //    Then I see the "bail hearing information" page
    Page.verifyOnPage(BailHearingInformationPage, this.application)
  })

  //  Scenario: navigate to task list on completion of task
  // ----------------------------------------------
  it('navigates to the next page', function test() {
    // So that the status of the task will be complete we set application.data
    // to the full set
    cy.fixture('applicationData.json').then(applicationData => {
      const answered = {
        ...this.application,
        data: applicationData,
      }
      cy.task('stubApplicationGet', { application: answered })
    })

    //  When I complete the "bail hearing information" page
    const page = Page.verifyOnPage(BailHearingInformationPage, this.application)
    page.addBailHearingDate()
    page.addCourt()
    page.addHearingMedium()

    //  And I continue to the next task / page
    page.clickSubmit()

    //  Then I am taken to the Task List
    const taskListPage = Page.verifyOnPage(TaskListPage, this.application)

    //  And I see that the task is now complete
    taskListPage.shouldShowTaskStatus('bail-hearing-information', 'Completed')
  })
})
