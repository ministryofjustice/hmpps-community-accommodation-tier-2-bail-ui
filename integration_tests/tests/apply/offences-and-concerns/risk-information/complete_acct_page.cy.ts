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
//  Scenario: change my answer when no ACCTs exist
//    Given no ACCTs exist
//    And I am on the ACCT page
//    When I click "Change your answer about existing ACCT notes"
//    Then I am taken to the "Does the applicant have ACCT notes" page
//
//  Scenario: when I go to select another ACCT
//    Then I see the "ACCT data" page
//
//  Scenario: When I continue to the next task / page
//    Then I see the "Domestic abuse" page

import AcctPage from '../../../../pages/apply/offences-and-concerns/risk-information/acctPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import DoesTheApplicantHaveAcctNotesPage from '../../../../pages/apply/offences-and-concerns/risk-information/doesTheApplicantHaveAcctNotesPage'
import DomesticAbuseConcernsPage from '../../../../pages/apply/offences-and-concerns/risk-information/domesticAbuseConcernsPage'

context('Visit ""Offences and concerns" section', () => {
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

  //  Scenario: there are existing ACCTs in the application
  //    Then I see a list of existing ACCTs on the "ACCT" page
  it('presents ACCT page with existing ACCTs', function test() {
    // When there is existing data
    cy.task('stubApplicationGet', { application: this.applicationWithData })

    AcctPage.visit(this.applicationWithData)

    const page = new AcctPage(this.applicationWithData)
    page.hasListOfAccts()
  })

  //  Scenario: remove an ACCT

  it('removes an ACCT', function test() {
    // When there is existing data
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

  //  Scenario: change my answer when no ACCTs exist
  //    Given no ACCTs exist
  //    And I am on the ACCT page
  //    When I click "Change your answer about existing ACCT notes"
  //    Then I am taken to the "Does the applicant have ACCT notes" page
  it('navigates to the "Does the applicant have ACCT notes" page', function test() {
    // cy.task('stubApplicationGet', { application: this.application })
    // AcctPage.visit(this.application)

    const page = new AcctPage(this.application)

    //    Given no ACCTs exist
    page.hasNoAccts()

    //    When I click "Change your answer about existing ACCT notes"
    page.clickLink('Change your answer about existing ACCT notes')

    //    Then I can navigate to the "Does the applicant have ACCT notes" page
    Page.verifyOnPage(DoesTheApplicantHaveAcctNotesPage, this.application)
  })

  //  Scenario: complete page and navigate to next page in health needs task
  //    When I continue to the next task / page
  //    Then I see the "Domestic abuse" page
  it('navigates to the next page (Domestic abuse)', function test() {
    // When there is existing data
    cy.task('stubApplicationGet', { application: this.applicationWithData })

    AcctPage.visit(this.applicationWithData)
    const page = new AcctPage(this.applicationWithData)

    page.clickSubmit()

    Page.verifyOnPage(DomesticAbuseConcernsPage, this.application)
  })
})
