/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Living in the community' page
//    So that I can complete the "Risk" task
//    As a referrer
//    I want to complete the 'Living in the community' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the 'Living in the community' page
//
//  Scenario: view Living in the community page
//    Then I see the "Living in the community" page
//    And I see guidance text
//
//  Scenario: complete page and navigate to next page in risk task
//    When I complete the Living in the community page
//    And I continue to the next task / page
//    Then I see the "safety of staff" page

import LivingInTheCommunityPage from '../../../../pages/apply/risks-and-needs/risk-information/livingInTheCommunityPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import SafetyOfStaffPage from '../../../../pages/apply/risks-and-needs/risk-information/safetyOfStaffPage'

context('Complete "Living in the community" page', () => {
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

    // And I am on the 'Living in the community' page
    // --------------------------------
    LivingInTheCommunityPage.visit(this.application)
  })

  //  Scenario: view Living in the community page
  it('shows the page', function test() {
    //  Then I see the Living in the community page
    const page = Page.verifyOnPage(LivingInTheCommunityPage, this.application)

    //  And I see guidance text
    page.hasGuidanceText()
  })

  //  Scenario: complete page and navigate to next page in risk task
  it('continues to the next page', function test() {
    const page = Page.verifyOnPage(LivingInTheCommunityPage, this.application)
    //  When I complete the Living in the community page
    page.enterConvictionDetails()
    page.enterVictimDetails()
    page.enterOtherConcerns()
    page.enterCSRADetails()

    //  And I continue to the next task / page
    page.clickSubmit()

    //  Then I see the "safety of staff" page
    Page.verifyOnPage(SafetyOfStaffPage, this.application)
  })
})
