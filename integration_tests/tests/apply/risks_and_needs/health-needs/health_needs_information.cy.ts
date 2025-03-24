/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Health needs information' page
//    So that I can complete the "Health needs" task
//    As a referrer
//    I want to confirm that I've understood the information on that page
//
//  Scenario: Follows link from task list
//    Given there is a section with a task
//    And an application exists
//    And I am logged in
//    And I am on the health needs information page
//
//  Scenario: view health needs information page
//    Then I see the health needs information page
//
//  Scenario: continues to next page in "health needs" task
//    When I continue to the next task/page
//    Then I should be on the substance misuse page

import SubstanceMisusePage from '../../../../pages/apply/risks_and_needs/health-needs/substanceMisusePage'
import Page from '../../../../pages/page'
import HealthNeedsInformationPage from '../../../../pages/apply/risks_and_needs/health-needs/healthNeedsInformationPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit health needs information page', () => {
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

    //  And I am on the health needs information page
    HealthNeedsInformationPage.visit(this.application)
  })

  //  Scenario: view health needs information page
  it('shows the page', function test() {
    //  Then I see the health needs information page
    Page.verifyOnPage(HealthNeedsInformationPage, this.application)
  })

  //  Scenario: complete page and navigate to next page in health needs task
  it('navigates to the next page (substance misuse)', function test() {
    //  When I complete the health needs information page
    const page = Page.verifyOnPage(HealthNeedsInformationPage, this.application)
    page.hasGuidance()

    //  And I continue to the next task / page
    page.clickSubmit('Confirm and continue')

    //  Then I see the substance misuse page
    Page.verifyOnPage(SubstanceMisusePage, this.application)
  })
})
