//  Feature: Referrer completes 'Funding CAS-2 Accommodation' question page
//    As a referrer,
//    I want to confirm how the applicant is funding their CAS2 accommodation
//    So that I can get the applicant into accommodation as quickly as possible with no FIEs
//
//  Scenario: When the applicant is using personal savings to fund the accommodation
//    Given I'm on the 'Funding CAS-2 Accommodation' question page
//    When I select personal savings and give valid answers for all other questions
//    Then I am taken to the task list page
//
//  Scenario: When the applicant is using house benefits to fund the accommodation
//    Given I'm on the 'Funding CAS-2 Accommodation' question page
//    When I select housing benefits and give valid answers for all other questions
//    Then I am taken to the applicant ID page

import FundingCas2AccommodationPage from '../../../../pages/apply/area-and-funding/funding-information/fundingCas2AccommodationPage'
import Page from '../../../../pages/page'
import TaskListPage from '../../../../pages/apply/taskListPage'
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

    // And I am on the Funding CAS-2 accommodation page
    // --------------------------------
    cy.visit('applications/abc123/tasks/funding-information/pages/funding-cas2-accommodation')
    Page.verifyOnPage(FundingCas2AccommodationPage, this.application)
  })

  // Scenario: When the applicant is using personal savings to fund the accommodation
  // ----------------------------
  it('continues to the task list page', function test() {
    // Given I am on the Funding CAS-2 Accommodation
    const page = Page.verifyOnPage(FundingCas2AccommodationPage, this.application)

    // When I complete the answers on the page
    page.completeWithPersonalSavings()

    // And I click submit
    page.clickSubmit()

    // I am taken to the task list page
    Page.verifyOnPage(TaskListPage, this.application)
  })

  //  Scenario: When the applicant is using house benefits to fund the accommodation
  // ----------------------------
  it('continues to the applicant ID page', function test() {
    // Given I am on the Funding CAS-2 Accommodation
    const page = Page.verifyOnPage(FundingCas2AccommodationPage, this.application)

    // When I complete the answers on the page
    page.completeWithHousingBenefits()

    // And I click submit
    page.clickSubmit()

    // I am taken to the applicant ID page
    Page.verifyOnPage(ApplicantIdPage, this.application)
  })
})
