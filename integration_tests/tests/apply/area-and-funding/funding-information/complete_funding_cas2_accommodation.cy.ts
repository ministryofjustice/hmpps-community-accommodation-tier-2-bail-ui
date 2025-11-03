/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Funding CAS2 for bail Accommodation' question page
//    As a referrer,
//    I want to confirm how the applicant is funding their CAS2 for bail accommodation
//    So that I can get the applicant into accommodation as quickly as possible with no FIEs
//
//  Scenario: continue to the next page
//    Given I'm on the 'Funding CAS2 for bail Accommodation' question page
//    When I complete the form
//    And I continue to the next page
//    Then I am taken to the applicant ID page

import FundingCas2AccommodationPage from '../../../../pages/apply/area-and-funding/funding-information/fundingCas2AccommodationPage'
import Page from '../../../../pages/page'
import ApplicantIdPage from '../../../../pages/apply/area-and-funding/funding-information/applicantIdPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "Confirm funding and ID" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['funding-information'] = {}
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

    // And I am on the Funding CAS2 for bail accommodation page
    // --------------------------------
    cy.visit('applications/abc123/tasks/funding-information/pages/funding-cas2-accommodation')
    Page.verifyOnPage(FundingCas2AccommodationPage, this.application)
  })

  // Scenario: continue to the next page
  // ----------------------------
  it('continues to the task list page', function test() {
    // Given I am on the Funding CAS2 for bail Accommodation question page
    const page = Page.verifyOnPage(FundingCas2AccommodationPage, this.application)

    // When I complete the form
    page.completeWithPersonalSavings()

    // And I continue to the next page
    page.clickSubmit()

    // Then I am taken to the applicant ID page
    Page.verifyOnPage(ApplicantIdPage, this.application)
  })
})
