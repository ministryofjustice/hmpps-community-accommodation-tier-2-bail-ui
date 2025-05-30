/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'mixed background' question page
//    So that I can complete the 'Equality questions' task
//    As a referrer
//    I want to answer questions on the mixed background page
//
//  Scenario: submits a valid answer to mixed background page
//    Given I'm on the 'mixed background' question page
//    When I give a valid answer
//    Then I am taken to the religion page

import Page from '../../../../pages/page'
import { MixedBackgroundPage, ReligionPage } from '../../../../pages/apply/about_the_person/equality_and_diversity'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "About the applicant" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['equality-and-diversity-monitoring'] = {}
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

    // And I am on the mixed background page
    // --------------------------------
    cy.visit('applications/abc123/tasks/equality-and-diversity-monitoring/pages/mixed-background')
    Page.verifyOnPage(MixedBackgroundPage, this.application)
  })

  // Scenario: select mixed background type
  // ----------------------------
  it('continues to the religion page', function test() {
    // I submit my answers
    const page = Page.verifyOnPage(MixedBackgroundPage, this.application)
    page.selectMixedBackground()

    page.clickSubmit()

    // I am taken to the relgion page
    Page.verifyOnPage(ReligionPage, this.application)
  })
})
