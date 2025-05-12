/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'cpp details' page
//    So that I can complete the "cpp details" task
//    As a referrer
//    I want to complete the 'cpp details' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "cpp details" page
//
//  Scenario: complete page and navigate to next page
//    When I continue to the next task / page
//    Then I see the "oasys risk assessment" page

import CPPDetailsPage from '../../../../pages/apply/offences-and-concerns/probation-supervision-details/cppDetailsPage'
import OASysRiskAssessmentPage from '../../../../pages/apply/offences-and-concerns/probation-supervision-details/oasysRiskAssessmentPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "Offence information" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['add-probation-supervision-details']['community-probation-practitioner-details']
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

    // And I am on the cpp details page
    // --------------------------------
    CPPDetailsPage.visit(this.application)
  })

  //  Scenario: complete page and navigate to next page
  //    When I continue to the next task / page
  //    Then I see the "oasys risk assessment" page
  it('navigates to the next page (oasys-risk-assessment)', function test() {
    const page = new CPPDetailsPage(this.application)

    page.completeForm()

    page.clickSubmit()

    Page.verifyOnPage(OASysRiskAssessmentPage, this.application)
  })
})
