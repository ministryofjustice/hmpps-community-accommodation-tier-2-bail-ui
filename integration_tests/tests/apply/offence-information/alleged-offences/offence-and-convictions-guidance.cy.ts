//  Feature: Referrer completes 'offences and convictions guidance' page
//    So that I can complete the "offences and convictions guidance" task
//    As a referrer
//    I want to complete the 'offences and convictions guidance' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "offences and convictions guidance" page
//
//  Scenario: present the page
//    And I navigate to the offences and convictions guidance page
//    Then I am presented with the page
//
//  Scenario: complete page and navigate to task list page
//    When I continue to the next task / page
//    Then I see the "task list" page

import OffencesAndConvictionsGuidancePage from '../../../../pages/apply/offence-information/provide-offences-and-convictions-details/offencesAndConvictionsGuidancePage'
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

    // And I am on the offences and convictions guidance page
    // --------------------------------
    OffencesAndConvictionsGuidancePage.visit(this.application)
  })

  //  Scenario: present the page
  //    And I navigate to the offences and convictions guidance page
  //    Then I see the "Offences and convictions guidance" page
  it('presents Offences and convictions guidance page', function test() {
    Page.verifyOnPage(OffencesAndConvictionsGuidancePage, this.application)
  })

  //  Scenario: complete page and navigate to task list page
  //    When I continue to the next task / page
  //    Then I see the "task list" page
  it('navigates to the next page (task list)', function test() {
    const page = new OffencesAndConvictionsGuidancePage(this.application)

    page.clickSubmit()

    Page.verifyOnPage(TaskListPage, this.application)
  })
})
