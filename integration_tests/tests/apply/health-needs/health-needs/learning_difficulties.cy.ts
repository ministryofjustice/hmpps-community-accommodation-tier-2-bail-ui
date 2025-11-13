/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Health needs: learning difficulties' page
//    So that I can complete the "Health needs" task
//    As a referrer
//    I want to complete the 'learning difficulties' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the learning difficulties page
//
//  Scenario: view learning difficulties questions
//    Then I see the "learning difficulties" page
//
//  Scenario: When the applicant does not have learning difficulties
//    Given I am on the Does the applicant have learning difficulties? page
//    When I answer 'No'
//    And I continue to the next page
//    Then I see the "brain injury" page
//
//  Scenario: When the applicant has learning difficulties
//    Given I am on the Does the applicant have learning difficulties? page
//    When I answer 'Yes'
//    And I continue to the next page
//    Then I see the "learning difficulties details" page
//
//  Scenario: complete page and navigate to next page in health needs task
//    Given I am on the "learning difficulties details" page
//    When I enter the learning difficulties details
//    And I continue to the next task / page
//    Then I see the "brain injury" page

import Page from '../../../../pages/page'
import BrainInjuryPage from '../../../../pages/apply/health_needs/health-needs/brainInjuryPage'
import LearningDifficultiesDetailsPage from '../../../../pages/apply/health_needs/health-needs/learningDifficultiesDetailsPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import LearningDifficultiesPage from '../../../../pages/apply/health_needs/health-needs/learningDifficultiesPage'

context('Visit "learning difficulties" page', () => {
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

    // And I am on the learning difficulties page
    // --------------------------------
    LearningDifficultiesPage.visit(this.application)
  })

  //  Scenario: view learning difficulties questions
  //    Then I see the "learning difficulties" page
  it('presents learning difficulties page', function test() {
    Page.verifyOnPage(LearningDifficultiesPage, this.application)
  })

  //  Scenario: When the applicant does not have learning difficulties
  it('continues to the brain injury page', function test() {
    //  Given I am on the Does the applicant have learning difficulties? page
    const page = Page.verifyOnPage(LearningDifficultiesPage, this.application)

    //  When I answer 'No'
    page.confirmNoLearningDifficulties()

    //  And I continue to the next page
    page.clickSubmit()

    //  Then I see the "brain injury" page
    Page.verifyOnPage(BrainInjuryPage, this.application)
  })

  //  Scenario: When the applicant has learning difficulties
  it('continues to the learning difficulties details page', function test() {
    //  Given I am on the Does the applicant have learning difficulties? page
    const page = Page.verifyOnPage(LearningDifficultiesPage, this.application)

    //  When I answer 'Yes'
    page.confirmLearningDifficulties()

    //  And I continue to the next page
    page.clickSubmit()

    //  Then I see the "learning difficulties details" page
    Page.verifyOnPage(LearningDifficultiesDetailsPage, this.application)
  })

  //  Scenario: complete page and navigate to next page in health needs task
  it('navigates to the next page (brain injury)', function test() {
    //  Given I am on the "learning difficulties details" page
    LearningDifficultiesDetailsPage.visit(this.application)
    const page = new LearningDifficultiesDetailsPage(this.application)

    //  When I enter the learning difficulties details
    page.describeNeeds()
    page.describeSupportNeeds()
    page.describeTreatment()
    page.describeVulnerability()

    //  And I continue to the next task / page
    page.clickSubmit()

    //  Then I see the "brain injury" page
    Page.verifyOnPage(BrainInjuryPage, this.application)
  })
})
