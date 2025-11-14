/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Health needs: communication and language' page
//    So that I can complete the "Health needs" task
//    As a referrer
//    I want to complete the 'communication and language' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the communication and language page
//
//  Scenario: When the applicant does not have communication and language needs
//    Given I am on the Does the applicant have any communication and language needs? page
//    And I answer 'No'
//    And I continue to the next page
//    Then I see the "learning difficulties" page
//
//  Scenario: When the applicant has communication and language needs
//    Given I am on the Does the applicant have any communication and language needs? page
//    And I answer 'Yes'
//    And I continue to the next page
//    Then I see the "communication and language" page
//
//  Scenario: complete page and navigate to next page in health needs task
//    When I complete the communication and language page
//    And I continue to the next task / page
//    Then I see the "learning difficulties" page

import Page from '../../../../pages/page'
import CommunicationAndLanguagePage from '../../../../pages/apply/health_needs/health-needs/communicationAndLanguagePage'
import CommunicationAndLanguageRelevanceCheckPage from '../../../../pages/apply/health_needs/health-needs/communicationAndLanguageRelevanceCheckPage'
import LearningDifficultiesPage from '../../../../pages/apply/health_needs/health-needs/learningDifficultiesPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "communication and language" page', () => {
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

    // And I am on the communication and language relevance check page
    // --------------------------------
    CommunicationAndLanguageRelevanceCheckPage.visit(this.application)
  })

  //  Scenario: When the applicant does not have communication and language needs
  //    Given I am on the Does the applicant have any communication and language needs? page
  //    And I answer 'No'
  //    And I continue to the next page
  //    Then I see the "learning difficulties" page
  it('skips communication and language needs page and navigates to the next page (learning difficulties)', function test() {
    // Given I am on the Does the applicant have any communication and language needs? page
    const page = new CommunicationAndLanguageRelevanceCheckPage(this.application)

    // And I answer 'No'
    page.selectApplicantDoesNotHaveCommunicationAndLanguageNeeds()

    // And I continue to the next page
    page.clickSubmit()

    // Then I see the "learning difficulties" page
    Page.verifyOnPage(LearningDifficultiesPage, this.application)
  })

  //  Scenario: When the applicant has communication and language needs
  //    Given I am on the Does the applicant have any communication and language needs? page
  //    And I answer 'Yes'
  //    And I continue to the next page
  //    Then I see the "communication and language" page
  it('presents communication and language page', function test() {
    // Given I am on the Does the applicant have any communication and language needs? page
    const page = new CommunicationAndLanguageRelevanceCheckPage(this.application)

    // And I answer 'Yes'
    page.selectApplicantDoesHaveCommunicationAndLanguageNeeds()

    // And I continue to the next page
    page.clickSubmit()

    // Then I see the "communication and language" page
    Page.verifyOnPage(CommunicationAndLanguagePage, this.application)
  })

  //  Scenario: complete page and navigate to next page in health needs task
  //    When I complete the communication and language page
  //    And I continue to the next task / page
  //    Then I see the "learning difficulties" page
  it('completes communication and language needs page and navigates to the next page (learning difficulties)', function test() {
    CommunicationAndLanguagePage.visit(this.application)
    const page = new CommunicationAndLanguagePage(this.application)

    page.describeImpairments()
    page.specifyInterpretationNeeds()
    page.clickSubmit()

    Page.verifyOnPage(LearningDifficultiesPage, this.application)
  })
})
