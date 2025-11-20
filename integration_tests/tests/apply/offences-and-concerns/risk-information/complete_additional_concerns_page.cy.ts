/* eslint-disable no-param-reassign */
//  Feature: Referrer completes "risk information: additional concerns" page
//    So that I can complete the "risk information" task
//    As a referrer
//    I want to complete the 'additional concerns' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the additional concerns page
//
//  Scenario: view additional concerns questions
//    Then I see the "additional concerns" page
//
//  Scenario: complete page and navigate to next page in risk information task
//    When I complete the additional concerns page
//    And I continue to the next task / page
//    Then I see the "risk management arrangements" page

import AdditionalConcernsPage from '../../../../pages/apply/offences-and-concerns/risk-information/additionalConcernsPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import RiskManagementArrangementsPage from '../../../../pages/apply/offences-and-concerns/risk-information/riskManagementArrangementsPage'

context('Complete "Additional concerns" page', () => {
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

    // And I visit the Additional concerns page
    // --------------------------------
    AdditionalConcernsPage.visit(this.application)
  })

  //  Scenario: view additional concerns questions
  //    Then I see the "additional concerns" page
  it('presents the additional concerns page', function test() {
    Page.verifyOnPage(AdditionalConcernsPage, this.application)
  })

  //  Scenario: complete page and navigate to next page in risk information task
  //    When I complete the additional concerns page
  //    And I continue to the next task / page
  //    Then I see the "risk management arrangements" page
  it('navigates to the next page (risk management arrangements)', function test() {
    const page = new AdditionalConcernsPage(this.application)

    page.describeAdditionalConcerns()

    page.clickSubmit()

    Page.verifyOnPage(RiskManagementArrangementsPage, this.application)
  })
})
