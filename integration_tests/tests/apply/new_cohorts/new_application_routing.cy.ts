import Page from '../../../pages/page'
import HomePage from '../../../pages/homePage'
import ApplicationOriginPage from '../../../pages/new_cohorts/apply/applicationOriginPage'

context('Route bail and non-bail applications to the correct start pages', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_CAS2_COURT_BAIL_REFERRER'] })
    cy.task('stubAuthUser')

    // Given I am logged in
    cy.signIn()
  })

  it('start new application button takes me to the application type selection page', () => {
    // When I visit the home page
    HomePage.visit()
    const homePage = Page.verifyOnPage(HomePage)

    // And I start a new application
    homePage.clickLink('Start a new application (new cohorts)')

    // Then I should see the application type selection screen
    Page.verifyOnPage(ApplicationOriginPage)
  })
})
