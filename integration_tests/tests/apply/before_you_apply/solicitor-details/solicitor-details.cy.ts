import { ApplicationOrigin, Cas2CohortDto, Cas2v2Application } from '@approved-premises/api'
import { applicationFactory, personFactory, solicitorFactory } from '../../../../../server/testutils/factories'
import TaskListPage from '../../../../pages/apply/taskListPage'
import Page from '../../../../pages/page'
import HasSolicitorPage from '../../../../pages/apply/before_you_apply/solicitor-details/hasSolicitor'
import Chainable = Cypress.Chainable
import SolicitorDetailsPage from '../../../../pages/apply/before_you_apply/solicitor-details/solicitorDetails'

context('Complete "Add solicitor details" task in "Before you apply" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.signIn()
  })

  const getApplication = (cohort: Cas2CohortDto): Chainable<Cas2v2Application> => {
    return cy.fixture('applicationData.json').then(applicationData => {
      return applicationFactory.build({
        person,
        data: { ...applicationData, 'cohort-selection': { 'cohort-selection': { cohort } } },
        applicationOrigin: !['courtBail', 'prisonBail'].includes(cohort) ? 'other' : (cohort as ApplicationOrigin),
      })
    })
  }

  it('allows the user to submit with no solicitor', () => {
    // Given we have created a prison bail application
    getApplication('prisonBail').then(application => {
      cy.task('stubApplicationGet', { application })
      cy.task('stubApplicationUpdate', { application })

      // And I am on the task list
      const taskListPage = TaskListPage.visit(application)

      // When I select the "Add solicitor details" task
      taskListPage.visitTask('Add solicitor details')

      // Then I should see the "Does <name> have a solicitor" page
      const solicitorPage = Page.verifyOnPage(HasSolicitorPage, application)

      // When I submit "no"
      solicitorPage.checkRadioByNameAndLabel('hasSolicitor', 'No')
      solicitorPage.clickSubmit()

      // Then I should be redirected back to the task list
      Page.verifyOnPage(TaskListPage, application)

      // And the Solicitor details should have been updated
      cy.task('verifyApplicationUpdate', application.id).then(requests => {
        expect(JSON.parse(requests[0].body).data['solicitor-details']['has-solicitor'].hasSolicitor).eq('no')
      })
    })
  })

  it('allows the user to enter the details for the applicants solicitor', () => {
    // Given we have created a prison bail application
    getApplication('courtBail').then(application => {
      cy.task('stubApplicationGet', { application })
      cy.task('stubApplicationUpdate', { application })

      // And I am on the task list
      const taskListPage = TaskListPage.visit(application)

      // When I select the "Add solicitor details" task
      taskListPage.visitTask('Add solicitor details')

      // Then I should see the "Does <name> have a solicitor" page
      const hasSolicitorPage = Page.verifyOnPage(HasSolicitorPage, application)

      // When I submit "no"
      hasSolicitorPage.checkRadioByNameAndLabel('hasSolicitor', 'Yes')
      hasSolicitorPage.clickSubmit()

      // Then I should see the "Add solicitor's contact information"
      const solicitorDetailsPage = Page.verifyOnPage(SolicitorDetailsPage, application)

      // When I fill and submit the form
      const contactInformation = solicitorFactory.build({})
      solicitorDetailsPage.populateForm(contactInformation)
      solicitorDetailsPage.clickSubmit()

      // Then I should be redirected back to the task list
      Page.verifyOnPage(TaskListPage, application)

      // And the Solicitor details should have been updated
      cy.task('verifyApplicationUpdate', application.id).then(requests => {
        expect(JSON.parse(requests[0].body).data['solicitor-details']['has-solicitor'].hasSolicitor).eq('yes')
        const solicitorDetails = JSON.parse(requests[1].body).data['solicitor-details']
        expect(solicitorDetails['contact-information'].name).eq(contactInformation.fullName)
        expect(solicitorDetails['contact-information'].legalFirmAndAddress).eq(contactInformation.legalFirmAddress)
        expect(solicitorDetails['contact-information'].email).eq(contactInformation.emailAddress)
        expect(solicitorDetails['contact-information'].number).eq(contactInformation.phoneNumber)
      })
    })
  })

  it('should not allow the user to see the task when the application cohort is not bail', () => {
    getApplication('atcr').then(application => {
      cy.task('stubApplicationGet', { application })

      // And I am on the task list
      const taskListPage = TaskListPage.visit(application)

      taskListPage.shouldNotShowTask('Add solicitor details')
    })
  })

  it('should reports errors to the user for missing form data', () => {
    // Given we have created a prison bail application
    getApplication('prisonBail').then(application => {
      const applicationWithoutContactInfo = {
        ...application,
        data: {
          ...application.data,
          'solicitor-details': { 'has-solicitor': { hasSolicitor: 'yes' } },
        },
      }

      cy.task('stubApplicationGet', { application: applicationWithoutContactInfo })
      cy.task('stubApplicationUpdate', { application: applicationWithoutContactInfo })

      // And I am on the task list
      const taskListPage = TaskListPage.visit(applicationWithoutContactInfo)

      // When I select the "Add solicitor details" taskk
      taskListPage.visitTask('Add solicitor details')

      // Then I should see the "Does <name> have a solicitor" page
      const hasSolicitorPage = Page.verifyOnPage(HasSolicitorPage, applicationWithoutContactInfo)

      // When I submit "Yes" to proceed to the contact information page
      hasSolicitorPage.checkRadioByNameAndLabel('hasSolicitor', 'Yes')
      hasSolicitorPage.clickSubmit()

      // Then I should see the "Add solicitor's contact information" page
      const solicitorDetailsPage = Page.verifyOnPage(SolicitorDetailsPage, applicationWithoutContactInfo)

      // When I submit the form without filling any fields
      solicitorDetailsPage.clickSubmit()

      // Then I should see errors for all required fields
      solicitorDetailsPage.shouldShowErrorMessagesForFields(['name'], "Enter the solicitor's full name")
      solicitorDetailsPage.shouldShowErrorMessagesForFields(
        ['legalFirmAndAddress'],
        "Enter the solicitor's legal firm and address",
      )
      solicitorDetailsPage.shouldShowErrorMessagesForFields(['email'], "Enter the solicitor's email address")
      solicitorDetailsPage.shouldShowErrorMessagesForFields(['number'], "Enter the solicitor's contact number")
    })
  })
})
