import Page from '../../../pages/page'
import { applicationFactory, personFactory } from '../../../../server/testutils/factories'
import TaskListPage from '../../../pages/apply/taskListPage'
import HealthNeedsInformationPage from '../../../pages/apply/health_needs/health-needs/healthNeedsInformationPage'
import LiaisonAndDiversionPage from '../../../pages/apply/health_needs/health-needs/liaisonAndDiversionPage'
import SubstanceMisusePage from '../../../pages/apply/health_needs/health-needs/substanceMisusePage'
import PhysicalHealthPage from '../../../pages/apply/health_needs/health-needs/physicalHealthPage'
import MentalHealthPage from '../../../pages/apply/health_needs/health-needs/mentalHealthPage'
import CommunicationAndLanguageRelevanceCheckPage from '../../../pages/apply/health_needs/health-needs/communicationAndLanguageRelevanceCheckPage'
import CommunicationAndLanguagePage from '../../../pages/apply/health_needs/health-needs/communicationAndLanguagePage'
import LearningDifficultiesPage from '../../../pages/apply/health_needs/health-needs/learningDifficultiesPage'
import LearningDifficultiesDetailsPage from '../../../pages/apply/health_needs/health-needs/learningDifficultiesDetailsPage'
import BrainInjuryPage from '../../../pages/apply/health_needs/health-needs/brainInjuryPage'
import BrainInjuryDetailsPage from '../../../pages/apply/health_needs/health-needs/brainInjuryDetailsPage'
import OtherHealthPage from '../../../pages/apply/health_needs/health-needs/otherHealthPage'
import InformationSourcesPage from '../../../pages/apply/health_needs/health-needs/informationSourcesPage'

context('Complete the "Add health needs" task in "Health needs"', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      cy.wrap(applicationData).as('applicationData')
    })

    // Given I am logged in
    cy.signIn()
  })

  it('Runs the "Add health needs task" for a non-bail application', function test() {
    const application = applicationFactory.build({
      applicationOrigin: 'other',
      cohort: 'atcr',
      person,
      data: { ...this.applicationData, 'health-needs': undefined },
    })

    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    // Given I am on the task list
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // Then the health needs task should not be started
    taskListPage.shouldShowTaskStatus('health-needs', 'Not yet started')

    // When I select the "Add health needs" task
    taskListPage.visitTask('Add health needs')

    // Then I should see the health needs information page
    const healthNeedsPage = Page.verifyOnPage(HealthNeedsInformationPage, application)
    healthNeedsPage.hasGuidance()

    // When I complete the health needs information page
    healthNeedsPage.clickSubmit('Confirm and continue')
    healthNeedsPage.refreshMock()

    // Then I should see the substance misuse page
    const substanceMisusePage = Page.verifyOnPage(SubstanceMisusePage, application)

    // When I complete the substance misuse page
    substanceMisusePage.checkErrorsAndSubmit()

    // Then I should see the physical health page
    const physicalHealthPage = Page.verifyOnPage(PhysicalHealthPage, application)

    // When I complete the physical health page
    physicalHealthPage.checkErrorsAndSubmit()

    // Then I should see the mental health page
    const mentalHealthPage = Page.verifyOnPage(MentalHealthPage, application)

    // When I complete the mental health page
    mentalHealthPage.checkErrorsAndSubmit()

    // Then I should see the communication and language relevance check page
    const communicationAndLanguageRelevanceCheckPage = Page.verifyOnPage(
      CommunicationAndLanguageRelevanceCheckPage,
      application,
    )

    // When I complete the communication and language relevance check page with "no"
    communicationAndLanguageRelevanceCheckPage.checkErrorsAndSubmit({ option: 'no' })

    // Then I should see the learning difficulties page
    const learningDifficultiesPage = Page.verifyOnPage(LearningDifficultiesPage, application)

    // When I complete the learning difficulties page with "no"
    learningDifficultiesPage.checkErrorsAndSubmit({ option: 'no' })

    // Then I should see the brain injury page
    const brainInjuryPage = Page.verifyOnPage(BrainInjuryPage, application)

    // When I complete the brain injury page with "no"
    brainInjuryPage.checkErrorsAndSubmit({ option: 'no' })

    // Then I should see the other health page
    const otherHealthPage = Page.verifyOnPage(OtherHealthPage, application)

    // When I complete the other health page
    otherHealthPage.checkErrorsAndSubmit()

    // Then I should see the information sources page
    const informationSourcesPage = Page.verifyOnPage(InformationSourcesPage, application)

    // When I complete the information sources page
    informationSourcesPage.checkErrorsAndSubmit()

    // Then I should see the task list
    const page = Page.verifyOnPage(TaskListPage, application)

    // And the health needs task should be completed
    page.shouldShowTaskStatus('health-needs', 'Completed')
  })

  it('Runs the "Add health needs task" for a bail application', function test() {
    const application = applicationFactory.build({
      applicationOrigin: 'courtBail',
      cohort: 'courtBail',
      person,
      data: { ...this.applicationData, 'health-needs': undefined },
    })

    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    // Given I am on the task list
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // Then the health needs task should not be started
    taskListPage.shouldShowTaskStatus('health-needs', 'Not yet started')

    // When I select the "Add health needs" task
    taskListPage.clickLink('Add health needs')

    // Then I should see the health needs information page
    const healthNeedsPage = Page.verifyOnPage(HealthNeedsInformationPage, application)
    healthNeedsPage.hasGuidance()

    // When I complete the health needs information page
    healthNeedsPage.clickSubmit('Confirm and continue')
    healthNeedsPage.refreshMock()

    // Then I should see the liaison and diversion page
    const liaisonAndDiversionPage = Page.verifyOnPage(LiaisonAndDiversionPage, application)

    // When I complete the liaison and diversion page
    liaisonAndDiversionPage.checkErrorsAndSubmit()

    // Then I should see the substance misuse page
    const substanceMisusePage = Page.verifyOnPage(SubstanceMisusePage, application)

    // When I complete the substance misuse page
    substanceMisusePage.checkErrorsAndSubmit()

    // Then I should see the physical health page
    const physicalHealthPage = Page.verifyOnPage(PhysicalHealthPage, application)

    // When I complete the physical health page
    physicalHealthPage.checkErrorsAndSubmit()

    // Then I should see the mental health page
    const mentalHealthPage = Page.verifyOnPage(MentalHealthPage, application)

    // When I complete the mental health page
    mentalHealthPage.checkErrorsAndSubmit()

    // Then I should see the communication and language relevance check page
    const communicationAndLanguageRelevanceCheckPage = Page.verifyOnPage(
      CommunicationAndLanguageRelevanceCheckPage,
      application,
    )

    // When I complete the communication and language relevance check page with "yes"
    communicationAndLanguageRelevanceCheckPage.checkErrorsAndSubmit({ option: 'yes' })

    // Then I should see the communication and language page
    const communicationAndLanguagePage = Page.verifyOnPage(CommunicationAndLanguagePage, application)

    // When I complete the communication and language page
    communicationAndLanguagePage.checkErrorsAndSubmit()

    // Then I should see the learning difficulties page
    const learningDifficultiesPage = Page.verifyOnPage(LearningDifficultiesPage, application)

    // When I complete the learning difficulties page with "yes"
    learningDifficultiesPage.checkErrorsAndSubmit({ option: 'yes' })

    // Then I should see the learning difficulties details page
    const learningDifficultiesDetailsPage = Page.verifyOnPage(LearningDifficultiesDetailsPage, application)

    // When I complete the learning difficulties details page
    learningDifficultiesDetailsPage.checkErrorsAndSubmit()

    // Then I should see the brain injury page
    const brainInjuryPage = Page.verifyOnPage(BrainInjuryPage, application)

    // When I complete the brain injury page with "yes"
    brainInjuryPage.checkErrorsAndSubmit({ option: 'yes' })

    // Then I should see the brain injury details page
    const brainInjuryDetailsPage = Page.verifyOnPage(BrainInjuryDetailsPage, application)

    // When I complete the brain injury details page
    brainInjuryDetailsPage.checkErrorsAndSubmit()

    // Then I should see the other health page
    const otherHealthPage = Page.verifyOnPage(OtherHealthPage, application)

    // When I complete the other health page
    otherHealthPage.checkErrorsAndSubmit()

    // Then I should see the information sources page
    const informationSourcesPage = Page.verifyOnPage(InformationSourcesPage, application)

    // When I complete the information sources page
    informationSourcesPage.checkErrorsAndSubmit()

    // Then I should see the task list
    const page = Page.verifyOnPage(TaskListPage, application)

    // And the health needs task should be completed
    page.shouldShowTaskStatus('health-needs', 'Completed')
  })
})
