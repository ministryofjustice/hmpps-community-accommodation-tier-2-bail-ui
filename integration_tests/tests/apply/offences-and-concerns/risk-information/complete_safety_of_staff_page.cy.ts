/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Safety of staff' page
//    So that I can complete the "Risk" task
//    As a referrer
//    I want to complete the 'Safety of staff' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the 'Safety of staff' page
//
//  Scenario: view Safety of staff page
//    Then I see the "Safety of staff" page
//    And I see guidance text
//
//  Scenario: complete page and navigate to next page in risk task
//    When I complete the Safety of staff page
//    And I continue to the next task / page
//    Then I see the "additional concerns" page

import SafetyOfStaffPage from '../../../../pages/apply/offences-and-concerns/risk-information/safetyOfStaffPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import AdditionalConcernsPage from '../../../../pages/apply/offences-and-concerns/risk-information/additionalConcernsPage'

context('Complete "Safety of staff" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['risk-information'] = {}
      const application = applicationFactory.build({
        person,
      })
      application.data = applicationData
      cy.wrap(application).as('application')
      cy.wrap(application.data).as('applicationData')
    })
  })

  beforeEach(function test() {
    // And an application exists
    cy.task('stubApplicationGet', { application: this.application })
    cy.task('stubApplicationUpdate', { application: this.application })

    // Given I am logged in
    //---------------------
    cy.signIn()

    // And I visit the Safety of staff page
    // --------------------------------
    cy.visit(`applications/${this.application.id}/tasks/risk-information/pages/safety-of-staff`)
  })

  //  Scenario: view Safety of staff page
  it('displays the page', function test() {
    //  Then I see the "Safety of staff" page
    const page = Page.verifyOnPage(SafetyOfStaffPage, this.application)

    //  And I see guidance text
    page.hasGuidanceText()
  })

  //  Scenario: complete page and navigate to next page in risk task
  it('continues to the next page', function test() {
    //  When I complete the Safety of staff page
    const page = Page.verifyOnPage(SafetyOfStaffPage, this.application)
    page.enterPastRiskDetails()
    page.enterCurrentRiskDetails()

    //  And I continue to the next task / page
    page.clickSubmit()

    //  Then I see the "additional concerns" page
    Page.verifyOnPage(AdditionalConcernsPage, this.application)
  })
})
