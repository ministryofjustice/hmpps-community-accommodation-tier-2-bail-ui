/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'contacted cpp about current risk levels' page
//    So that I can complete the "add probation supervision details" task
//    As a referrer
//    I want to complete the 'contacted cpp about current risk levels' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "contacted cpp about current risk levels" page
//
//  Scenario: complete page and navigate to serious harm risk levels page
//    Given I am on the contacted cpp about current risk levels page
//    And I answer yes to having contacted the CPP regarding the applicant's current risk levels
//    When I continue to the next task / page
//    Then I see the "serious harm risk levels" page
//
//  Scenario: prevented from completing task if CPP has not been contacted
//    Given I am on the contacted cpp about current risk levels page
//    And I answer no to having contacted the CPP regarding the applicant's current risk levels
//    When I continue to the next task / page
//    Then I see the "you must contact CPP" page

import ContactedCppAboutCurrentRiskLevelsPage from '../../../../pages/apply/offences-and-concerns/probation-supervision-details/contactedCppAboutCurrentRiskLevelsPage'
import SeriousHarmRiskLevelsPage from '../../../../pages/apply/offences-and-concerns/probation-supervision-details/seriousHarmRiskLevelsPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import YouMustContactTheCppPage from '../../../../pages/apply/offences-and-concerns/probation-supervision-details/youMustContactTheCppPage'

context('Visit "Offences and concerns" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['add-probation-supervision-details']['contacted-cpp-about-current-risk-levels']
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

    // And I am on the contacted cpp about current risk levels page
    // --------------------------------
    ContactedCppAboutCurrentRiskLevelsPage.visit(this.application)
  })

  //  Scenario: complete page and navigate to serious harm risk levels page
  //    Given I am on the contacted cpp about current risk levels page
  //    And I answer yes to having contacted the CPP regarding the applicant's current risk levels
  //    When I continue to the next task / page
  //    Then I see the "serious harm risk levels" page
  it('navigates to the next page (serious harm risk levels) when the answer is yes', function test() {
    const page = new ContactedCppAboutCurrentRiskLevelsPage(this.application)

    page.selectYesToContactingCpp()
    page.enterContactDate()

    page.clickSubmit()

    Page.verifyOnPage(SeriousHarmRiskLevelsPage, this.application)
  })

  //  Scenario: prevented from completing task if CPP has not been contacted
  //    Given I am on the contacted cpp about current risk levels page
  //    And I answer no to having contacted the CPP regarding the applicant's current risk levels
  //    When I continue to the next task / page
  //    Then I see the "you must contact CPP" page
  it('navigates to the next page (you must contact CPP) when first answer is "no"', function test() {
    const page = new ContactedCppAboutCurrentRiskLevelsPage(this.application)

    page.selectNoToContactingCpp()

    page.clickSubmit()

    Page.verifyOnPage(YouMustContactTheCppPage, this.application)
  })
})
