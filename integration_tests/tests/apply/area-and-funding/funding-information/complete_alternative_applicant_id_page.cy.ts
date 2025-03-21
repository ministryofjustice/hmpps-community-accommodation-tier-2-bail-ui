/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'alternative applicant ID' page
//    So that I can complete the "Funding information" task
//    As a referrer
//    I want to complete the 'alternative applicant ID' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I visit the 'alternative applicant ID' page
//
//  Scenario: navigate to task list page
//    When I select a form of ID
//    And I continue to the next task / page
//    Then I am redirected to the task list page

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import AlternativeApplicantIdPage from '../../../../pages/apply/area-and-funding/funding-information/alternativeApplicantIdPage'
import TaskListPage from '../../../../pages/apply/taskListPage'

context('Visit alternative applicant ID page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['funding-information'] = {}
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

    // And I am on the alternative applicant ID page
    // --------------------------------
    AlternativeApplicantIdPage.visit(this.application)
  })

  // Scenario: navigate to task list page
  // ----------------------------------------
  it('redirects to the task list page', function test() {
    // When I select a form of ID
    const page = Page.verifyOnPage(AlternativeApplicantIdPage, this.application)
    page.checkCheckboxByValue('contract')

    // And I continue to the next task / page
    page.clickSubmit()

    // Then I am redirected to the task list page
    Page.verifyOnPage(TaskListPage, this.application)
  })
})
