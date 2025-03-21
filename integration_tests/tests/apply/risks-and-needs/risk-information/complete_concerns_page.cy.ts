/* eslint-disable no-param-reassign */
//  Feature: Referrer completes "risk information: concerns" page
//    So that I can complete the "risk information" task
//    As a referrer
//    I want to complete the 'concerns' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the concerns page
//
//  Scenario: view concerns questions
//    Then I see the "concerns" page
//
//  Scenario: complete page and navigate to next page in risk information task
//    When I complete the concerns page
//    And I continue to the next task / page
//    Then I see the "self-harm and suicide" page

import ConcernsPage from '../../../../pages/apply/risks-and-needs/risk-information/concernsPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import SelfHarmPage from '../../../../pages/apply/risks-and-needs/risk-information/selfHarmPage'

context('Complete "Concerns" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['risk-information'] = {}
      const application = applicationFactory.build({
        id: 'abc123',
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

    // And I visit the Concerns page
    // --------------------------------
    ConcernsPage.visit(this.application)
  })

  //  Scenario: view concerns questions
  //    Then I see the "concerns" page
  it('presents the concerns page', function test() {
    Page.verifyOnPage(ConcernsPage, this.application)
  })

  //  Scenario: complete page and navigate to next page in risk information task
  //    When I complete the concerns page
  //    And I continue to the next task / page
  //    Then I see the "self-harm and suicide" page
  it('navigates to the next page (self-harm and suicide)', function test() {
    const page = new ConcernsPage(this.application)

    page.hasGuidance()

    page.clickSubmit('Confirm and continue')

    Page.verifyOnPage(SelfHarmPage, this.application)
  })
})
