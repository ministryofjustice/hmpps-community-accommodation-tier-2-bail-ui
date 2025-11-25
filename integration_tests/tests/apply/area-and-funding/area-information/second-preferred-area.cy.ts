/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Area information: second preferred area' page
//    So that I can complete the "Area information" task
//    As a referrer
//    I want to complete the "second preferred area" page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the second preferred area page
//
//  Scenario: complete page and navigate to next page in area information task
//    When I complete the second preferred area page questions
//    And I continue to the next task / page
//    Then I see the "other area preferences" page

import Page from '../../../../pages/page'
import SecondPreferredAreaPage from '../../../../pages/apply/area-and-funding/area-information/secondPreferredAreaPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import OtherAreaPreferencesPage from '../../../../pages/apply/area-and-funding/area-information/otherAreaPreferencesPage'

context('Visit "Second preferred area" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['area-information'] = {}
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

    SecondPreferredAreaPage.visit(this.application)
  })

  //  Scenario: complete page and navigate to next page in area information task
  //    When I complete the second preferred area page questions
  //    And I continue to the next task / page
  //    Then I see the "other area preferences" page
  it('navigates to the next page (other area preferences) when complete', function test() {
    const page = new SecondPreferredAreaPage(this.application)

    page.completePage()

    Page.verifyOnPage(OtherAreaPreferencesPage, this.application)
  })
})
