/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'supervised by probation' page
//    So that I can complete the "supervised by probation" task
//    As a referrer
//    I want to complete the 'supervised by probation' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "supervised by probation" page
//
//  Scenario: complete page answering yes and navigate to next page
//    When I continue to the next task / page
//    Then I see the "cpp details" page
//
//  Scenario: complete page answering no and navigate to next page
//    When I continue to the next task / page
//    Then I see the "task list" page

import SupervisedByProbationPage from '../../../../pages/apply/offences-and-concerns/probation-supervision-details/supervisedByProbationPage'
import CPPDetailsPage from '../../../../pages/apply/offences-and-concerns/probation-supervision-details/cppDetailsPage'
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
      delete applicationData['add-probation-supervision-details']['supervised-by-probation']
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

    // And I am on the supervised by probation page
    // --------------------------------
    SupervisedByProbationPage.visit(this.application)
  })

  //  Scenario: complete page answering yes and navigate to next page
  //    When I continue to the next task / page
  //    Then I see the "cpp details" page
  it('navigates to the next page (cpp details) when the answer is yes', function test() {
    const page = new SupervisedByProbationPage(this.application)

    page.selectYes()

    page.clickSubmit()

    Page.verifyOnPage(CPPDetailsPage, this.application)
  })

  //  Scenario: complete page answering no and navigate to next page
  //    When I continue to the next task / page
  //    Then I see the "task list" page
  it('navigates to the next page (task list) when the answer is no', function test() {
    const page = new SupervisedByProbationPage(this.application)

    page.selectNo()

    page.clickSubmit()

    Page.verifyOnPage(TaskListPage, this.application)
  })
})
