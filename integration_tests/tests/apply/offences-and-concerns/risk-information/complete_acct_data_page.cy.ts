/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Add an ACCT' page
//    So that I can complete the "Risk information" task
//    As a referrer
//    I want to complete the 'Add an ACCT' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "Add an ACCT" page
//
//  Scenario: I fill in required information for an ACCT
//    And I save and contnue
//    Then I am taken back to the ACCT page
//
//  Scenario: Add another ACCT
//    Given I have filled in required information for an ACCT
//    When I save and add another
//    Then I am taken to a blank "Add an ACCT" page
//    And I see a success message
//
//  Scenario: Cancel adding another ACCT
//    Given an ACCT exists
//    And I visit the "Add an ACCT" page
//    When I cancel
//    Then I am taken to the "ACCT" page

import AcctPage from '../../../../pages/apply/offences-and-concerns/risk-information/acctPage'
import AddAcctNotePage from '../../../../pages/apply/offences-and-concerns/risk-information/addAcctNotePage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "Offences and concerns" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['risk-information']
      const application = applicationFactory.build({
        id: 'abc123',
        person,
        data: applicationData,
      })
      cy.wrap(application).as('application')
    })

    cy.fixture('applicationData.json').then(applicationData => {
      const applicationWithData = {
        ...this.application,
        data: applicationData,
      }
      cy.wrap(applicationWithData).as('applicationWithData')
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

    // And I am on the "Add an ACCT" page
    // --------------------------------
    AddAcctNotePage.visit(this.application)
  })

  //  Scenario: I fill in required information for an ACCT
  //    When I continue to the next task / page
  //    Then I see the "ACCT" page
  it('navigates to the next page (ACCT page)', function test() {
    const page = new AddAcctNotePage(this.application)

    page.addACCTInformation()

    page.clickSubmit()

    Page.verifyOnPage(AcctPage, this.application)
  })

  //  Scenario: Add another ACCT
  it('returns to form when adding another', function test() {
    const page = new AddAcctNotePage(this.application)

    //    Given I have filled in required information for an ACCT
    page.addACCTInformation()

    //    When I save and add another
    page.clickAddAnother()

    //    Then I am taken to a blank "Add an ACCT" page
    Page.verifyOnPage(AddAcctNotePage, this.application)
    page.assertFormisEmpty()

    //  And I see a success message
    page.shouldShowSuccessMessage('The ACCT has been saved')
  })

  //  Scenario: Cancel adding another ACCT
  it('navigates to ACCT page when cancelling adding another', function test() {
    //    Given an ACCT exists
    cy.task('stubApplicationGet', { application: this.applicationWithData })
    AddAcctNotePage.visit(this.applicationWithData)

    //    And I visit the "Add an ACCT" page
    const page = new AddAcctNotePage(this.application)

    //    When I cancel
    page.clickLink('Cancel')

    //    Then I am taken to the "ACCT" page
    Page.verifyOnPage(AcctPage, this.application)
  })
})
