//  Feature: referrer views prison applications
//    So that I can see recently created prison bail applications
//    So that I can manage applications
//
//  Scenario: viewing the prison applications page as a referrer
//      Given I am logged in as a prison bail referrer
//      And there are submitted prison bail applications in the database
//      When I visit the prison applications page
//      Then I can see the prison applications page
//      And I can see a list of prison bail applications
//
//  Scenario: searching for a specific Crn as a referrer
//      Given I am logged in as a prison bail referrer
//      And there are some matching prison bail applications in the database
//      When I visit the prison applications page
//      Then I should be able to see the full list of prison bail applications
//      When I search for the Crn
//      Then I should be able to see the matching list of prison bail applications
//      When I clear the search field
//      Then I should be able to see the full list of prison bail applications again
//
//  Scenario: searching for a Noms number with no results as a referrer
//      Given I am logged in as a prison bail referrer
//      And there are no matching bail applications in the database
//      When I visit the prison applications page
//      Then I should be able to see the full list of prison bail applications
//      When I search for the Crn
//      Then I should be able to see the matching list of prison bail applications
//      When I clear the search field
//      Then I should be able to see the full list of prison bail applications again

import { Cas2v2ApplicationSummary } from '@approved-premises/api'
import { applicationSummaryFactory } from '../../../server/testutils/factories'
import PrisonApplicationsPage from '../../pages/apply/prisonApplicationsPage'
import Page from '../../pages/page'

context('Prison applications', () => {
  beforeEach(() => {
    // Given I am logged in as a prison bail referrer
    cy.task('stubSignIn', { roles: ['ROLE_CAS2_PRISON_BAIL_REFERRER'] })
    cy.task('stubAuthUser')

    cy.signIn()
  })

  //  Scenario: viewing the home page as a referrer
  it('displays the prison applications page', () => {
    // And there are submitted prison bail applications in the database
    const prisonApplications = applicationSummaryFactory.buildList(3, { applicationOrigin: 'prisonBail' })
    cy.task('stubApplicationOrigin', { applications: prisonApplications })

    // When I visit the prison applications page
    PrisonApplicationsPage.visit()

    // Then I can see the prison applications page
    const prisonApplicationsPage = Page.verifyOnPage(PrisonApplicationsPage)

    // And I can see a list of prison bail applications
    prisonApplicationsPage.shouldShowApplications(prisonApplications)
  })

  // Scenario: searching for a specific Crn as a referrer
  it('displays the applications for the queried Crn', () => {
    const crn = 'SOME-CRN'

    // And there are some matching prison bail applications in the database
    const prisonApplicationsForCrn = applicationSummaryFactory.buildList(3, { crn })
    const allPrisonApplications = [
      ...prisonApplicationsForCrn,
      applicationSummaryFactory.build({ crn: 'SOME-OTHER-CRN' }),
      applicationSummaryFactory.build({ crn: 'YET-ANOTHER-CRN' }),
    ]
    cy.task('stubApplicationOrigin', { applications: allPrisonApplications })
    cy.task('stubApplicationOriginSearch', { applications: prisonApplicationsForCrn, crnOrNomsNumber: crn })

    // When I visit the prison applications page
    const prisonApplicationsPage = PrisonApplicationsPage.visit()

    // Then I should be able to see the full list of prison bail applications
    prisonApplicationsPage.shouldShowApplications(allPrisonApplications)

    // When I search for the Crn
    prisonApplicationsPage.getTextInputByIdAndEnterDetails('crnOrNomsNumber', crn)
    prisonApplicationsPage.clickSubmit('Search')

    // Then I should be able to see the matching list of prison bail applications
    prisonApplicationsPage.shouldShowApplications(prisonApplicationsForCrn)

    // When I clear the search field
    prisonApplicationsPage.clickLink('Clear search results')

    // Then I should be able to see the full list of prison bail applications again
    prisonApplicationsPage.shouldShowApplications(allPrisonApplications)
  })

  // Scenario: searching for a Noms number with no results as a referrer
  it('displays an empty table when searching for a Noms number with no results', () => {
    const nomsNumber = 'SOME-NOMS-NUMBER'

    // And there are no matching bail applications in the database
    const prisonApplicationsForNomsNumber: Array<Cas2v2ApplicationSummary> = []
    const allPrisonApplications = [
      applicationSummaryFactory.build({ nomsNumber: 'SOME-OTHER-NOMS-NUMBER' }),
      applicationSummaryFactory.build({ nomsNumber: 'YET-ANOTHER-NOMS-NUMBER' }),
    ]

    cy.task('stubApplicationOrigin', { applications: allPrisonApplications })
    cy.task('stubApplicationOriginSearch', {
      applications: prisonApplicationsForNomsNumber,
      crnOrNomsNumber: nomsNumber,
    })

    // When I visit the prison applications page
    const prisonApplicationsPage = PrisonApplicationsPage.visit()

    // Then I should be able to see the full list of prison bail applications
    prisonApplicationsPage.shouldShowApplications(allPrisonApplications)

    // When I search for the Crn
    prisonApplicationsPage.getTextInputByIdAndEnterDetails('crnOrNomsNumber', nomsNumber)
    prisonApplicationsPage.clickSubmit('Search')

    // Then I should be able to see the matching list of prison bail applications
    prisonApplicationsPage.shouldShowApplications(prisonApplicationsForNomsNumber)

    // When I clear the search field
    prisonApplicationsPage.clickLink('Clear search results')

    // Then I should be able to see the full list of prison bail applications again
    prisonApplicationsPage.shouldShowApplications(allPrisonApplications)
  })
})
