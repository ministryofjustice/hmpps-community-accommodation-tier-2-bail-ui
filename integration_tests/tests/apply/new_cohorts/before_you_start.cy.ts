import ApplicationOriginPage from '../../../pages/new_cohorts/apply/applicationOriginPage'
import BeforeYouStartPage from '../../../pages/new_cohorts/apply/beforeYouStartPage'
import Page from '../../../pages/page'

context('Display application specific before-you-start pages after selecting an application type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    // Given I am logged in
    cy.signIn()
  })

  it('Selecting the bail application type takes me to the bail before-you-start page', () => {
    // When I'm on the application type selection page
    const applicationTypePage = ApplicationOriginPage.visit()

    // And I select the Bail application type
    applicationTypePage.selectBail()
    applicationTypePage.clickContinue()

    // Then I should see the Bail-specific before-you-start page
    Page.verifyOnPage(BeforeYouStartPage, { isBail: true })
  })

  it('Selecting the other application type takes me to the other before-you-start page', () => {
    // When I'm on the application type selection page
    const applicationTypePage = ApplicationOriginPage.visit()

    // And I select the Other application type
    applicationTypePage.selectOther()
    applicationTypePage.clickContinue()

    // Then I should see the before-you-start page for other applications
    Page.verifyOnPage(BeforeYouStartPage, { isBail: false })
  })
})
