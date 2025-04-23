/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Area information: gang affiliations' page
//    So that I can complete the "Area information" task
//    As a referrer
//    I want to complete the "gang affiliations" page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the gang affiliations page
//
//  Scenario: complete page and navigate to next page in area information task
//    When I complete the gang affiliations page questions
//    And I continue to the next task / page
//    Then I see the "gang affiliations" page

import Page from '../../../../pages/page'
import GangAffiliationsPage from '../../../../pages/apply/area-and-funding/area-information/gangAffiliationsPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import FamilyAccommodationPage from '../../../../pages/apply/area-and-funding/area-information/familyAccommodationPage'

context('Visit "Gang affiliations" page', () => {
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

    GangAffiliationsPage.visit(this.application)
  })

  //  Scenario: complete page and navigate to next page in area information task
  //    When I complete the gang affiliations page questions
  //    And I continue to the next task / page
  //    Then I see the "family accommodation" page
  it('navigates to the next page (family accommodation) when complete', function test() {
    const page = new GangAffiliationsPage(this.application)

    page.completePage()

    Page.verifyOnPage(FamilyAccommodationPage, this.application)
  })
})
