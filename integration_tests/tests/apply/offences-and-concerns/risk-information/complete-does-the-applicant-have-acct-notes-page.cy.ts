/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Applicant ACCT notes' page
//    So that I can complete the "Risk information" task
//    As a referrer
//    I want to complete the 'Applicant ACCT notes' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "Applicant ACCT notes" page
//
//  Scenario: The applicant has ACCT notes
//    Given I am on the Applicant ACCT notes page
//    And I answer Yes
//    When I save and contnue
//    Then I am taken back to the Add ACCT notes page
//
//  Scenario: The applicant does not have ACCT notes
//    Given I am on the Applicant ACCT notes page
//    And I answer No
//    When I save and contnue
//    Then I am taken back to the Domestic abuse concerns page
//
//  Scenario: The applicant is not in prison custody
//    Given I am on the Applicant ACCT notes page
//    And I answer No, the applicant is not in prison custody
//    When I save and contnue
//    Then I am taken back to the Domestic abuse concerns page

import DoesTheApplicantHaveAcctNotesPage from '../../../../pages/apply/offences-and-concerns/risk-information/doesTheApplicantHaveAcctNotesPage'
import AddAcctNotePage from '../../../../pages/apply/offences-and-concerns/risk-information/addAcctNotePage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
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
    DoesTheApplicantHaveAcctNotesPage.visit(this.application)
  })

  //  Scenario: The applicant has ACCT notes
  //    Given I am on the Applicant ACCT notes page
  //    And I answer Yes
  //    When I save and contnue
  //    Then I am taken back to the Add ACCT notes page
  it('navigates to the next page (Add ACCT notes)', function test() {
    const page = new DoesTheApplicantHaveAcctNotesPage(this.application)

    page.selectApplicantHasAcctNotes()

    page.clickSubmit()

    Page.verifyOnPage(AddAcctNotePage, this.application)
  })

  //  Scenario: The applicant does not have ACCT notes
  //    Given I am on the Applicant ACCT notes page
  //    And I answer No
  //    When I save and contnue
  //    Then I am taken back to the Domestic abuse concerns page
  it('navigates to the next page (Domestic abuse concerns)', function test() {
    const page = new DoesTheApplicantHaveAcctNotesPage(this.application)

    page.selectApplicantDoesNotHaveAcctNotes()

    page.clickSubmit()

    Page.verifyOnPage(DomesticAbuseConcernsPage, this.application)
  })

  //  Scenario: The applicant is not in prison custody
  //    Given I am on the Applicant ACCT notes page
  //    And I answer No, the applicant is not in prison custody
  //    When I save and contnue
  //    Then I am taken back to the Domestic abuse concerns page
  it('navigates to the next page (Domestic abuse concerns)', function test() {
    const page = new DoesTheApplicantHaveAcctNotesPage(this.application)

    page.selectApplicantIsNotInPrisonCustody()

    page.clickSubmit()

    Page.verifyOnPage(DomesticAbuseConcernsPage, this.application)
  })
})
