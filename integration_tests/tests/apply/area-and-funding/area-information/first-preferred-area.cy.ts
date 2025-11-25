/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Area information: first preferred area' page
//    So that I can complete the "Area information" task
//    As a referrer
//    I want to complete the "first preferred area" page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the first preferred area page
//
//  Scenario: complete page and navigate to next page in area information task
//    When I complete the first preferred area page questions
//    And I continue to the next task / page
//    Then I see the "second preferred area" page

import Page from '../../../../pages/page'
import FirstPreferredAreaPage from '../../../../pages/apply/area-and-funding/area-information/firstPreferredAreaPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import SecondPreferredAreaPage from '../../../../pages/apply/area-and-funding/area-information/secondPreferredAreaPage'

context('Visit "First preferred area" page', () => {
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

    FirstPreferredAreaPage.visit(this.application)
  })

  //  Scenario: complete page and navigate to next page in area information task
  //    When I complete the first preferred area page questions
  //    And I continue to the next task / page
  //    Then I see the "second preferred area" page
  it('navigates to the next page (second preferred area) when complete', function test() {
    const page = new FirstPreferredAreaPage(this.application)

    page.completePage()

    Page.verifyOnPage(SecondPreferredAreaPage, this.application)
  })
})
