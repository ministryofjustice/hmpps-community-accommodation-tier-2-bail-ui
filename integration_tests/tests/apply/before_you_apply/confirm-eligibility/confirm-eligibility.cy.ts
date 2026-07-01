import { Cas2Application } from '@approved-premises/api'
import Page from '../../../../pages/page'
import TaskListPage from '../../../../pages/apply/taskListPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import ConfirmEligibilityPage from '../../../../pages/apply/before_you_apply/confirm-eligibility/confirmEligibilityPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

context('Complete "Confirm eligibility" task in "Before you start" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })
  let application: Cas2Application

  beforeEach(function test() {
    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['confirm-eligibility'] = {}
      application = applicationFactory.build({
        person,
        data: applicationData,
      })
    })

    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.signIn()
  })

  it('allows eligibility to be confirmed', () => {
    const prisonApplication: Cas2Application = {
      ...application,
      applicationOrigin: 'prisonBail',
      data: {
        ...application.data,
        'confirm-eligibility': {
          'confirm-eligibility': {
            isEligible: 'yes',
          },
        },
      },
    }
    cy.task('stubApplicationGet', { application: prisonApplication })
    cy.task('stubApplicationUpdate', { application: prisonApplication })

    // Given I am on the Eligibility page
    const page = ConfirmEligibilityPage.visit(prisonApplication)

    // And it should contain the correct content
    page.confirmBailContent()

    // When I select the 'Yes' option and click save and continue
    page.completeFormWithEligibility()

    page.clickSubmit('Confirm and continue')

    // Then I am redirected to the ineligible page
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // And I see that the task is now complete
    taskListPage.shouldShowTaskStatus('confirm-consent', 'Completed')
  })

  it('shows the correct content for a non-bail application', () => {
    const nbApplication: Cas2Application = {
      ...application,
      applicationOrigin: 'other',
    }
    cy.task('stubApplicationGet', { application: nbApplication })
    // Given I am on the Eligibility page
    const page = ConfirmEligibilityPage.visit(nbApplication)

    page.confirmNonBailContent()
  })

  it('allows eligibility to be rejected for a bail application', () => {
    const bailApplication: Cas2Application = {
      ...application,
      applicationOrigin: 'prisonBail',
      data: {
        ...application.data,
        'confirm-eligibility': {
          'confirm-eligibility': {
            isEligible: 'no',
          },
        },
      },
    }
    cy.task('stubApplicationGet', { application: bailApplication })
    cy.task('stubApplicationUpdate', { application: bailApplication })

    // Given I am on the Eligibility page
    const page = ConfirmEligibilityPage.visit(bailApplication)

    // When I select the 'no' option and click save and continue
    page.completeFormWithoutEligibility()
    page.clickSubmit('Confirm and continue')

    // Then I am directed to the ineligible page with the correct content
    cy.contains(
      `${nameOrPlaceholderCopy(application.person, 'The person')} is not eligible for CAS2 for bail accommodation`,
    )
  })

  it('allows eligibility to be rejected for a non-bail application', () => {
    const bailApplication: Cas2Application = {
      ...application,
      applicationOrigin: 'other',
      data: {
        ...application.data,
        'confirm-eligibility': {
          'confirm-eligibility': {
            isEligible: 'no',
          },
        },
      },
    }
    cy.task('stubApplicationGet', { application: bailApplication })
    cy.task('stubApplicationUpdate', { application: bailApplication })

    // Given I am on the Eligibility page
    const page = ConfirmEligibilityPage.visit(bailApplication)

    // When I select the 'no' option and click save and continue
    page.completeFormWithoutEligibility()
    page.clickSubmit('Confirm and continue')

    // Then I am directed to the ineligible page with the correct content
    cy.contains(`${nameOrPlaceholderCopy(application.person, 'The person')} is not eligible for CAS2 accommodation`)
  })
})
