/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Liaison and diversion assessment' page
//    So that I can complete the "Health needs" task
//    As a referrer
//    I want to complete the Liaison and diversion assessment page
//
//  Scenario: Follows link from task list
//    Given there is a section with a task
//    And an application exists
//    And I am logged in
//
//  Scenario: view Liaison and diversion assessment page
//    Given I am on the task list page
//    When I follow the link to the health needs task
//    Then I see the Liaison and diversion assessment page
//
//  Scenario: continues to next page in "health needs" task
//    When I continue to the next task/page
//    Then I should be on the health needs information page

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import LiaisonAndDiversionPage from '../../../../pages/apply/risks_and_needs/health-needs/liaisonAndDiversionPage'
import TaskListPage from '../../../../pages/apply/taskListPage'
import HealthNeedsInformationPage from '../../../../pages/apply/risks_and_needs/health-needs/healthNeedsInformationPage'

context('Visit Liaison and diversion assessment page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['health-needs'] = {}
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
  })

  //  Scenario: view Liaison and diversion assessment page
  it('shows the page', function test() {
    //  Given I am on the task list page
    const page = TaskListPage.visit(this.application)

    //  When I follow the link to the health needs task
    page.clickLink('Add health needs')

    //  Then I see the Liaison and diversion assessment page
    Page.verifyOnPage(LiaisonAndDiversionPage, this.application)
  })

  //  Scenario: continues to next page in "health needs" task
  it('continues to the next page', function test() {
    //  When I continue to the next task/page
    const page = LiaisonAndDiversionPage.visit(this.application)
    page.completeForm()
    page.clickSubmit()

    //  Then I should be on the health needs information page
    Page.verifyOnPage(HealthNeedsInformationPage, this.application)
  })
})
