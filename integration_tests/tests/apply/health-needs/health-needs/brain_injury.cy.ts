/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Health needs: brain injury' page
//    So that I can complete the "Health needs" task
//    As a referrer
//    I want to complete the 'brain injury' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the brain injury page
//
//  Scenario: view brain injury questions
//    Then I see the "brain injury" page
//
//  Scenario: When the applicant does not have a brain injury
//    Given I am on the Does the applicant have a brain injury? page
//    And I answer 'No'
//    And I continue to the next page
//    Then I see the "other health needs" page
//
//  Scenario: When the applicant has a brain injury
//    Given I am on the Does the applicant have a brain injury? page
//    And I answer 'Yes'
//    And I continue to the next page
//    Then I see the "brain injury details" page
//
//  Scenario: complete page and navigate to next page in health needs task
//    Given I am on the "brain injury details" page
//    When I enter the brain injury details
//    And I continue to the next task / page
//    Then I see the "other health" page

import Page from '../../../../pages/page'
import BrainInjuryDetailsPage from '../../../../pages/apply/health_needs/health-needs/brainInjuryDetailsPage'
import OtherHealthPage from '../../../../pages/apply/health_needs/health-needs/otherHealthPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import BrainInjuryPage from '../../../../pages/apply/health_needs/health-needs/brainInjuryPage'

context('Visit "brain injury" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['health-needs'] = {}
      const application = applicationFactory.build({
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

    // And I am on the brain injury page
    // --------------------------------
    BrainInjuryPage.visit(this.application)
  })

  //  Scenario: view brain injury questions
  //    Then I see the "brain injury" page
  it('presents brain injury page', function test() {
    Page.verifyOnPage(BrainInjuryPage, this.application)
  })

  //  Scenario: When the applicant does not have a brain injury
  it('continues to the other health page', function test() {
    //  Given I am on the Does the applicant have a brain injury? page
    const page = Page.verifyOnPage(BrainInjuryPage, this.application)

    //  And I answer 'No'
    page.confirmNoBrainInjury()

    //  And I continue to the next page
    page.clickSubmit()

    //  Then I see the "other health needs" page
    Page.verifyOnPage(OtherHealthPage, this.application)
  })

  //  Scenario: When the applicant has a brain injury
  it('continues to the brain injury details page', function test() {
    //  Given I am on the Does the applicant have a brain injury? page
    const page = Page.verifyOnPage(BrainInjuryPage, this.application)

    //  And I answer 'Yes'
    page.confirmBrainInjury()

    //  And I continue to the next page
    page.clickSubmit()

    //  Then I see the "brain injury details" page
    Page.verifyOnPage(BrainInjuryDetailsPage, this.application)
  })

  //  Scenario: complete page and navigate to next page in health needs task
  it('navigates to the next page (other health)', function test() {
    //  Given I am on the "brain injury details" page
    BrainInjuryDetailsPage.visit(this.application)
    const page = new BrainInjuryDetailsPage(this.application)

    //  When I enter the brain injury details
    page.describeInjury()
    page.describeSupportNeeded()
    page.describeTreatment()
    page.describeVulnerability()
    page.describeDifficultiesInteracting()

    //  And I continue to the next task / page
    page.clickSubmit()

    //  Then I see the "other health" page
    Page.verifyOnPage(OtherHealthPage, this.application)
  })
})
