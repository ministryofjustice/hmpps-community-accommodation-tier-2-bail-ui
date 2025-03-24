/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Risk information: ACCT' page
//    So that I can complete the "Risk information" task
//    As a referrer
//    I want to complete the 'ACCT' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "ACCT" page
//
//  Scenario: there are existing ACCTs in the application
//    Then I see a list of the existing ACCTs on the "ACCT" page
//
//  Scenario: remove an ACCT
//    When I remove an ACCT
//    Then the ACCT is no longer in the list of ACCTs
//
//  Scenario: there are no existing ACCTs in the application
//    Then I see the "ACCT" page
//
//  Scenario: when I go to select another ACCT
//    Then I see the "ACCT data" page
//
//  Scenario: When I continue to the next task / page
//    Then I see the "Violence and arson" page

import AcctPage from '../../../../pages/apply/risks-and-needs/risk-information/acctPage'
import ViolenceAndArsonPage from '../../../../pages/apply/risks-and-needs/risk-information/violenceAndArsonPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "Risks and needs" section', () => {
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

    // And I am on the ACCT page
    // --------------------------------
    AcctPage.visit(this.application)
  })

  //  Scenario: there are no existing ACCTs in the application
  //    Then I see the "ACCT" page
  it('presents ACCT page', function test() {
    Page.verifyOnPage(AcctPage, this.application)
  })

  //  Scenario: there are existing ACCTs in the application
  //    Then I see a list of existing ACCTs on the "ACCT" page
  it('presents ACCT page with existing ACCTs', function test() {
    // When there is already imported data
    cy.task('stubApplicationGet', { application: this.applicationWithData })

    AcctPage.visit(this.applicationWithData)

    const page = new AcctPage(this.applicationWithData)
    page.hasListOfAccts()
  })

  //  Scenario: remove an ACCT

  it('removes an ACCT', function test() {
    // When there is already imported data
    cy.task('stubApplicationGet', { application: this.applicationWithData })

    AcctPage.visit(this.applicationWithData)

    const page = new AcctPage(this.applicationWithData)
    page.hasListOfAccts()

    //    When I remove an ACCT
    // reset the application to have no data
    cy.task('stubApplicationGet', { application: this.application })
    page.clickRemove()
    //  Then the ACCT is no longer in the list of ACCTs
    page.hasNoAccts()
  })

  //  Scenario: complete page and navigate to next page in health needs task
  //    When I continue to the next task / page
  //    Then I see the "violence and arson" page
  it('navigates to the next page (violence and arson)', function test() {
    AcctPage.visit(this.application)
    const page = new AcctPage(this.application)

    page.clickSubmit()

    Page.verifyOnPage(ViolenceAndArsonPage, this.application)
  })
})
