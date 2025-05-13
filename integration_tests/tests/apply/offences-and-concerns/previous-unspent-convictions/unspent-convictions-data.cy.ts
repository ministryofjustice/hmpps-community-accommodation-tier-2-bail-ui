/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'unspent convictions data' page
//    So that I can complete the "unspent convictions data" task
//    As a referrer
//    I want to complete the 'unspent convictions data' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "unspent convictions data" page
//
//  Scenario: complete page and show success message
//    When I complete the page
//    Then I see a success message

import UnspentConvictionsPage from '../../../../pages/apply/offences-and-concerns/previous-unspent-convictions/unspentConvictionsPage'
import UnspentConvictionsDataPage from '../../../../pages/apply/offences-and-concerns/previous-unspent-convictions/unspentConvictionsDataPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "Offences and concerns" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['previous-unspent-convictions']
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

    // And I am on the unspent convictions page
    // --------------------------------
    UnspentConvictionsPage.visit(this.application)
  })

  //  Scenario: complete page and show success message
  //    When I complete the page
  //    Then I see a success message
  it('completes form and shows success message', function test() {
    const page = new UnspentConvictionsDataPage(this.application)

    page.completeForm()

    page.clickSubmit()

    Page.verifyOnPage(UnspentConvictionsDataPage, this.application)

    //  And I see a success message
    page.shouldShowSuccessMessage('Unspent conviction saved')
  })
})
