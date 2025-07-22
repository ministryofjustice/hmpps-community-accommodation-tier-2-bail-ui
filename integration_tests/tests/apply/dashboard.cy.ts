//  Feature: Referrer views list of existing applications
//    So that I can view my existing applications
//    As a referrer
//    I want to see them listed on an application dashboard
//
//  Scenario: show in progress applications
//    Given I am logged in
//    And there are in progress applications in the database
//    When I visit the applications page
//    Then I should see all of the in progress applications
//
//  Scenario: show submitted applications
//    Given I am logged in
//    And there are submitted applications in the database
//    When I visit the submitted applications tab
//    Then I should see all of my submitted applications
//
//  Scenario: see prison dashboard
//    Given I am logged in as a prison bail referrer
//    Then I see a tab to view prison bail applications
//
//  Scenario: don't see prison dashboard
//    Given I am logged in as a court bail referrer
//    Then I should not see a tab to view prison bail applications

import ApplicationListPage from '../../pages/apply/applicationListPage'
import { applicationSummaryFactory } from '../../../server/testutils/factories'

context('Applications dashboard as a prison bail referrer', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_CAS2_PRISON_BAIL_REFERRER'] })
    cy.task('stubAuthUser')

    // Given I am logged in as a prison bail referrer
    cy.signIn()
  })

  //  Scenario: show in progress applications
  // ----------------------------------------------
  it('shows in progress applications', () => {
    // There are applications in the database
    const inProgressApplications = applicationSummaryFactory.buildList(5, {
      status: 'inProgress',
      latestStatusUpdate: null,
    })

    cy.task('stubApplications', inProgressApplications)

    // I visit the applications page
    const page = ApplicationListPage.visit(inProgressApplications)

    // I should see all of the in progress applications
    page.shouldShowInProgressApplications()
  })

  //  Scenario: show submitted applications
  it('shows submitted applications', () => {
    // There are applications in the database
    const submittedApplications = applicationSummaryFactory.buildList(5, {
      status: 'submitted',
    })
    cy.task('stubApplications', submittedApplications)

    // I visit the submitted applications tab
    const page = ApplicationListPage.visit(submittedApplications)

    // I should see all the in progress applications
    page.shouldShowSubmittedApplications()
  })

  //  Scenario: see prison dashboard
  it('shows prison dashboard tab', () => {
    cy.task('stubApplications', [])

    // Then I see a tab for my prison's applications
    const page = ApplicationListPage.visit([])
    page.shouldShowPrisonTab()
  })
})

context('Applications dashboard as a court bail referrer', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_CAS2_COURT_BAIL_REFERRER'] })
    cy.task('stubAuthUser')

    // Given I am logged in as a court bail referrer
    cy.signIn()
  })

  //  Scenario: don't see prison dashboard
  it('does not show prison dashboard tab', () => {
    cy.task('stubApplications', [])

    // Then I should not see a tab to view prison bail applications
    const page = ApplicationListPage.visit([])
    page.shouldNotShowPrisonTab()
  })
})
