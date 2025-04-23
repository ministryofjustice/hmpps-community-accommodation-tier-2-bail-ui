/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Area information: other area preferences' page
//    So that I can complete the "Area information" task
//    As a referrer
//    I want to complete the "other area preferences" page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the other area preferences page
//
//  Scenario: complete page and navigate to next page in area information task
//    When I complete the other area preferences page questions
//    And I continue to the next task / page
//    Then I see the "exclusion zones" page

import Page from '../../../../pages/page'
import OtherAreaPreferencesPage from '../../../../pages/apply/area-and-funding/area-information/otherAreaPreferencesPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import ExclusionZonesPage from '../../../../pages/apply/area-and-funding/area-information/exclusionZonesPage'

context('Visit "Other area preferences" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['area-information'] = {}
      const application = applicationFactory.build({
        id: 'abc123',
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

    OtherAreaPreferencesPage.visit(this.application)
  })

  //  Scenario: complete page and navigate to next page in area information task
  //    When I complete the other area preferences page questions
  //    And I continue to the next task / page
  //    Then I see the "exclusion zones" page
  it('navigates to the next page (exclusion zones) when complete', function test() {
    const page = new OtherAreaPreferencesPage(this.application)

    page.completePage()

    Page.verifyOnPage(ExclusionZonesPage, this.application)
  })
})
