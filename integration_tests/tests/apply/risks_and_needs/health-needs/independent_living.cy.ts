//  Feature: Referrer completes 'Independent living' page
//    So that I can complete the "Health needs" task
//    As a referrer
//    I want to complete the independent living page
//
//  Scenario: Follows link from task list
//    Given there is a section with a task
//    And an application exists
//    And I am logged in
//
//  Scenario: view Independent living page
//    When I visit the Independent living page
//    Then I see the Independent living page
//
//  Scenario: continues to next page in "health needs" task
//    When I continue to the next task/page
//    Then I should be on the substance misuse page

import Page from '../../../../pages/page'
import HealthNeedsInformationPage from '../../../../pages/apply/risks_and_needs/health-needs/healthNeedsInformationPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import IndependentLivingPage from '../../../../pages/apply/risks_and_needs/health-needs/independentLivingPage'

context('Visit Independent living page', () => {
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

  //  Scenario: view Independent living page
  it('shows the page', function test() {
    //  When I visit the Independent living page
    IndependentLivingPage.visit(this.application)

    //  Then I see the Independent living page
    Page.verifyOnPage(IndependentLivingPage, this.application)
  })

  //  Scenario: continues to next page in "health needs" task
  it('continues to the next page', function test() {
    //  When I continue to the next task/page
    const page = IndependentLivingPage.visit(this.application)
    page.clickSubmit()

    //  Then I should be on the health needs information page
    Page.verifyOnPage(HealthNeedsInformationPage, this.application)
  })
})
