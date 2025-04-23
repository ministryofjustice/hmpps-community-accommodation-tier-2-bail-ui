/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Area information: exclusion-zones' page
//    So that I can complete the "Area information" task
//    As a referrer
//    I want to complete the "exclusion zones" page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the exclusion-zones page
//
//  Scenario: complete page and navigate to next page in area information task
//    When I complete the exclusion-zones page questions
//    And I continue to the next task / page
//    Then I see the "gang affiliations" page

import Page from '../../../../pages/page'
import ExclusionZonesPage from '../../../../pages/apply/area-and-funding/area-information/exclusionZonesPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import GangAffiliationsPage from '../../../../pages/apply/area-and-funding/area-information/gangAffiliationsPage'

context('Visit "Exclusion zones" page', () => {
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

    ExclusionZonesPage.visit(this.application)
  })

  //  Scenario: complete page and navigate to next page in area information task
  //    When I complete the exclusion-zones page questions
  //    And I continue to the next task / page
  //    Then I see the "gang affiliations" page
  it('navigates to the next page (gang affiliations) when complete', function test() {
    const page = new ExclusionZonesPage(this.application)

    page.completePage()

    Page.verifyOnPage(GangAffiliationsPage, this.application)
  })
})
