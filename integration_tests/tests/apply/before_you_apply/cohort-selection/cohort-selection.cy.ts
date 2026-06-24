import { Cas2CohortDto, Cas2Application } from '@approved-premises/api'
import { faker } from '@faker-js/faker'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import CohortSelectionPage from '../../../../pages/apply/before_you_apply/cohort-selection/cohortSelection'
import { cohortSelectionAnswers } from '../../../../../server/utils/applications/cohortLabels'
import LicenceDatesPage from '../../../../pages/apply/before_you_apply/cohort-selection/licenceDates'
import LicenceDatesNeededPage from '../../../../pages/apply/before_you_apply/cohort-selection/licenceDatesNeededPage'

context('Complete Cohort selection task in "Before you apply" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })
  let application: Cas2Application

  beforeEach(function test() {
    cy.fixture('applicationData.json').then(applicationData => {
      application = applicationFactory.build({
        person,
        data: { ...applicationData, 'cohort-selection': undefined },
        applicationOrigin: 'other',
        cohort: undefined,
      })
    })

    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.signIn()
  })

  it('allows the cohort to be selected', () => {
    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })
    const newCohort: Cas2CohortDto = faker.helpers.arrayElement(Object.keys(cohortSelectionAnswers)) as Cas2CohortDto

    // Given I am on the cohort selection page
    const page = CohortSelectionPage.visit(application)

    // And it should contain the correct content
    page.verifyQuestions()

    // When I submit an empty page
    page.clickSubmit('Confirm and continue')

    // Then I should see an error message
    page.shouldShowErrorSummary('Select why Roger Smith needs CAS2 accommodation')

    // When I select a cohort and submit again
    page.checkRadioByNameAndValue('cohort', newCohort)
    cy.task('stubApplicationGet', {
      application: {
        ...application,
        data: { ...application.data, 'cohort-selection': { 'cohort-selection': { cohort: newCohort } } },
      },
    })
    page.clickSubmit('Confirm and continue')

    // Then the application cohort is updated
    cy.task('verifyApplicationUpdate', application.id).then(requests => {
      expect(JSON.parse(requests[0].body).cohort).eq(newCohort)
    })
  })

  it('allows the licence dates to be entered', () => {
    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })
    const testCohorts: Array<Cas2CohortDto> = ['atcr', 'hcrd', 'isc']
    testCohorts.forEach((cohort: Cas2CohortDto) => {
      // Given I am on the cohort selection page
      const cohortPage = CohortSelectionPage.visit(application)

      // And I select a cohort
      cohortPage.checkRadioByNameAndValue('cohort', cohort)
      const updatedApplication = {
        ...application,
        cohort,
        data: { ...application.data, 'cohort-selection': { 'cohort-selection': { cohort } } },
      }
      cy.task('stubApplicationGet', { application: updatedApplication })

      // And submit
      cohortPage.clickSubmit('Confirm and continue')

      if (cohort === 'isc') {
        // Then I see the intermediate page
        const licenceNeededPage = new LicenceDatesNeededPage(application)

        // When I answer yes and submit
        licenceNeededPage.answerYes()
      }
      // Then I am on the licence dates page
      const licencePage = new LicenceDatesPage(application)

      // When I submit the empty form
      licencePage.clickSubmit('Save and continue')

      // Then I should see errors
      licencePage.shouldSeeErrrors(cohort)

      // When I complete the form and submit
      licencePage.completeForm({ cohort })
      licencePage.clickSubmit('Save and continue')
      // Then the correct dates will have been posted
      licencePage.verifyUpdate(updatedApplication)
    })
  })

  it('Removes orphaned data', () => {
    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    // Given I am on the cohort selection page
    const cohortPage = CohortSelectionPage.visit(application)

    // When I select cohort 'atcr'
    cohortPage.selectCohort('atcr')

    // Then I am on the licence dates page
    const licencePage = new LicenceDatesPage(application)
    licencePage.completeForm({ cohort: 'atcr' })

    // When I complete the dates including hdcExpiry
    licencePage.clickSubmit('Save and continue')
    cy.task('stubApplicationGetFromLastUpdate', { application })

    // And I return to the cohort page and switch to 'hcrd'
    cohortPage.selectCohort('rarr')

    // And I return to the cohort page and switch to 'atcr' again
    cohortPage.selectCohort('atcr')

    // When I submit the page
    licencePage.clickSubmit('Save and continue')

    // Then I see errors because the start date and hdc radion have been cleared
    licencePage.shouldShowErrorSummary('Licence start date must be entered')
    licencePage.shouldShowErrorSummary('Select yes if they have a HDC expiry date')

    // When I select yes to the HDC expiry date
    licencePage.checkRadioByNameAndValue('hasHdcExpiryDate', 'yes')
    licencePage.clickSubmit('Save and continue')
    // Then I can see that the hdc expiry date has been cleared too
    licencePage.shouldShowErrorSummary('HDC expiry date must be entered')
  })
})
