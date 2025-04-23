/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Area information: family accommodation' page
//    So that I can complete the "Area information" task
//    As a referrer
//    I want to complete the "family accommodation" page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the family accommodation page
//
//  Scenario: complete page and navigate to next page in area information task
//    When I complete the family accommodation page questions
//    And I continue to the next task / page
//    Then I see the "task list" page

import Page from '../../../../pages/page'
import FamilyAccommodationPage from '../../../../pages/apply/area-and-funding/area-information/familyAccommodationPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import TaskListPage from '../../../../pages/apply/taskListPage'

context('Visit "Family accommodation" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['area-information'] = {}
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

    FamilyAccommodationPage.visit(this.application)
  })

  //  Scenario: complete page and navigate to next page in area information task
  //    When I complete the family accommodation page questions
  //    And I continue to the next task / page
  //    Then I see the "task list" page
  it('navigates to the next page (task list) when complete', function test() {
    const page = new FamilyAccommodationPage(this.application)

    page.completePage()

    Page.verifyOnPage(TaskListPage, this.application)
  })
})
