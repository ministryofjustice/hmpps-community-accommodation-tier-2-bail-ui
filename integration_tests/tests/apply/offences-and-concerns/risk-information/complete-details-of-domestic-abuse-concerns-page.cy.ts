/* eslint-disable no-param-reassign */
//  Feature: Referrer completes "risk information: domestic abuse concerns" page
//    So that I can complete the "risk information" task
//    As a referrer
//    I want to complete the 'domestic abuse concerns' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the domestic abuse concerns page
//
//  Scenario: view domestic abuse concerns questions
//    Then I see the "domestic abuse concerns" page
//
//  Scenario: complete page and navigate to next page in risk information task
//    When I complete the domestic abuse concerns page
//    And I continue to the next task / page
//    Then I see the "violence and arson" page

import ViolenceAndArsonPage from '../../../../pages/apply/offences-and-concerns/risk-information/violenceAndArsonPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import DomesticAbuseConcernsPage from '../../../../pages/apply/offences-and-concerns/risk-information/detailsOfDomesticAbuseConcernsPage'

context('Complete "domestic abuse concerns" page', () => {
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

    // And I visit the domestic abuse concerns page
    // --------------------------------
    cy.visit('applications/abc123/tasks/risk-information/pages/details-of-domestic-abuse-concerns')
  })

  //  Scenario: view domestic abuse concerns questions
  //    Then I see the "domestic abuse concerns" page
  it('presents the domestic abuse concerns page', function test() {
    Page.verifyOnPage(DomesticAbuseConcernsPage, this.application)
  })

  //  Scenario: complete page and navigate to next page in risk information task
  //    When I complete the domestic abuse concerns page
  //    And I continue to the next task / page
  //    Then I see the "violence and arson" page
  it('navigates to the next page (violence and arson)', function test() {
    DomesticAbuseConcernsPage.visit(this.application)
    const page = new DomesticAbuseConcernsPage(this.application)

    page.enterVictimDetails()
    page.enterSafeguardingDetails()

    page.clickSubmit()

    Page.verifyOnPage(ViolenceAndArsonPage, this.application)
  })
})
