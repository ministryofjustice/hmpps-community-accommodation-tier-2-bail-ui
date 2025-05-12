//  Feature: Referrer completes 'any previous convictions' page
//    So that I can complete the "any previous convictions" task
//    As a referrer
//    I want to complete the 'any previous convictions' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "any previous convictions" page
//
//  Scenario: complete page and navigate to next page
//    When I continue to the next task / page
//    Then I see the "unspent convictions" page

import AnyPreviousConvictionsPage from '../../../../pages/apply/offences-and-concerns/previous-unspent-convictions/anyPreviousConvictionsPage'
import UnspentConvictionsPage from '../../../../pages/apply/offences-and-concerns/previous-unspent-convictions/unspentConvictionsPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "Offences and concerns" section', () => {
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

    // And I am on the any previous convictions page
    // --------------------------------
    AnyPreviousConvictionsPage.visit(this.application)
  })

  //  Scenario: complete page and navigate to next page
  //    When I continue to the next task / page
  //    Then I see the "unspent convictions" page
  it('navigates to the next page (unspent convictions)', function test() {
    const page = new AnyPreviousConvictionsPage(this.application)

    page.selectHasAnyPreviousConvictions()

    page.clickSubmit()

    Page.verifyOnPage(UnspentConvictionsPage, this.application)
  })
})
