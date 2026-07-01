import Page from '../../../pages/page'
import TaskListPage from '../../../pages/apply/taskListPage'
import {
  applicationFactory,
  cas2OAsysRiskToSelfDtoFactory,
  personFactory,
} from '../../../../server/testutils/factories'
import OasysImportPage from '../../../pages/apply/health_needs/risk-to-self/oasysImportPage'
import VulnerabilityPage from '../../../pages/apply/health_needs/risk-to-self/vulnerabilityPage'
import AcctPage from '../../../pages/apply/health_needs/risk-to-self/acctPage'
import AcctDataPage, { AcctData } from '../../../pages/apply/health_needs/risk-to-self/acctDataPage'
import AdditionalInformationPage from '../../../pages/apply/health_needs/risk-to-self/additionalInformation'
import OldOasysPage from '../../../pages/apply/health_needs/risk-to-self/oldOasysPage'
import CurrentAndPreviousRiskPage from '../../../pages/apply/health_needs/risk-to-self/curreneAndPreviousRiskPage'

const testAccts: Array<AcctData> = [
  {
    createdDate: '2026-03-12',
    isOngoing: 'yes',
    referringInstitution: 'Prison 1',
    acctDetails: 'Details 1',
  },
  {
    createdDate: '2026-01-26',
    isOngoing: 'no',
    closedDate: '2026-02-15',
    referringInstitution: 'Prison 2',
    acctDetails: 'Details 2',
  },
]
context('Risk to self task', () => {
  const person = personFactory.build({ name: 'Roger Smith' })
  let applicationData: unknown

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(data => {
      applicationData = { ...data }
    })
  })

  beforeEach(() => {
    //  Given I am logged in
    cy.signIn()
  })

  it('Risk to self task no OASys data available', () => {
    const application = applicationFactory.build({
      applicationOrigin: 'other',
      person,
      data: applicationData,
    })

    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    // Given I am on the tasklist page
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // And the risk to self task is not started
    taskListPage.shouldShowTaskStatus('risk-to-self', 'Not yet started')

    // When I start the task
    taskListPage.visitTask('Add risk to self information')

    // Then I am on the oasysy import page showing no oasysy
    const oasysImportPage = Page.verifyOnPage(OasysImportPage, application)
    oasysImportPage.verifyNoOasys()
    // When I click continue
    oasysImportPage.clickLink('Continue')
    // oasysImportPage.refreshMock()

    // Then I am on the old-oasys question page
    const oldOasysPage = Page.verifyOnPage(OldOasysPage, application)
    // When I complete and submit the old-oasys question page
    oldOasysPage.checkErrorsAndSubmit()

    // Then I should be on the vulnerability page
    const vulnerabilityPage = Page.verifyOnPage(VulnerabilityPage, application)
    // When I complete and submit the page
    vulnerabilityPage.checkErrorsAndSubmit()

    // Then I am on the current and previous risk page
    const riskPage = Page.verifyOnPage(CurrentAndPreviousRiskPage, application)
    // When I complete and submit the risk page
    riskPage.checkErrorsAndSubmit()

    // Then I should be on the empty ACCT list page
    const acctPage = Page.verifyOnPage(AcctPage, application)
    cy.contains('No ACCT notes have been added.')
    // When I click to add a new note
    acctPage.clickLink('Add an ACCT note')

    // Then I am on the acct data page
    const acctDataPage = Page.verifyOnPage(AcctDataPage, application)
    acctDataPage.checkErrorsAndSubmit(testAccts[0])

    // Then, I am back on the acct list page showing one acct.
    acctPage.checkOnPage()
    acctPage.verifyAcctInList(testAccts[0])

    // When I add another ACCT
    acctPage.clickLink('Add an ACCT note')
    acctDataPage.checkErrorsAndSubmit(testAccts[1])

    // Then I am back on the acct page with two accts
    acctPage.checkOnPage()
    acctPage.verifyListLength(2)
    acctPage.verifyAcctInList(testAccts[0])
    acctPage.verifyAcctInList(testAccts[1])

    // When I remove the first ACCT
    acctPage.clickLink('Remove')

    // Then only the second acct is left
    acctDataPage.refreshMock()
    acctPage.verifyListLength(1)
    acctPage.verifyAcctInList(testAccts[1])

    // When I click to continue
    acctPage.clickSubmit('Save and continue')
    acctDataPage.refreshMock()

    // Then I am on the additional information page
    const infoPage = Page.verifyOnPage(AdditionalInformationPage, application)
    // When I add information and submit
    infoPage.checkErrorsAndSubmit()

    // Then I am back on the task list with the task completed
    taskListPage.checkOnPage()
    taskListPage.shouldShowTaskStatus('risk-to-self', 'Completed')

    // When I go back into the task and follow all the pages forwards to the additional information page
    taskListPage.visitTask('Add risk to self information')
    oldOasysPage.checkOnPage()
    oldOasysPage.clickSubmit()
    vulnerabilityPage.checkOnPage()
    vulnerabilityPage.clickSubmit()
    riskPage.checkOnPage()
    riskPage.clickSubmit()
    acctPage.checkOnPage()
    acctPage.clickSubmit()
    infoPage.checkOnPage()

    // And I follow all the backlinks
    infoPage.clickBack()
    acctPage.checkOnPage()
    acctPage.clickBack()
    riskPage.checkOnPage()
    riskPage.clickBack()
    vulnerabilityPage.checkOnPage()
    vulnerabilityPage.clickBack()

    // Then I am back on the tasklist page
    taskListPage.checkOnPage()
  })

  it('The detail fields are pre-populated when oasys available', () => {
    const application = applicationFactory.build({
      applicationOrigin: 'other',
      person,
      data: applicationData,
    })
    const data = cas2OAsysRiskToSelfDtoFactory.build()

    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })
    cy.task('stubGetOasysRiskToSelf', { person, data })

    // Given I am on the tasklist page
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // When I start the risk-to-self task
    taskListPage.visitTask('Add risk to self information')

    // Then I am on the OASys import page
    const oasysImportPage = Page.verifyOnPage(OasysImportPage, application)
    oasysImportPage.verifyOasysMetadata(data.metadata)

    // When I click "Import and continue"
    oasysImportPage.clickSubmit('Import and continue')
    oasysImportPage.refreshMock()

    // Then I should be on the vulnerability page
    const vulnerabilityPage = Page.verifyOnPage(VulnerabilityPage, application)

    // And the detail should already be populated
    vulnerabilityPage.shouldShowTextArea('vulnerabilityDetail', data.analysisVulnerabilities)

    // when I complete the form and submit
    vulnerabilityPage.completeForm()
    vulnerabilityPage.clickSubmit('Save and continue')
    vulnerabilityPage.refreshMock()

    // Then I should be on the current and previous risk page
    const riskPage = Page.verifyOnPage(CurrentAndPreviousRiskPage, application)

    // And the risk detail should be populated
    riskPage.shouldShowTextArea('currentAndPreviousRiskDetail', data.analysisSuicideSelfharm)
  })

  it('The risk to self task is not shown for bail applications', () => {
    const application = applicationFactory.build({
      person,
      data: applicationData,
    })

    // Given I have a bail application
    cy.task('stubApplicationGet', { application })

    // Given I am on the tasklist page
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    taskListPage.shouldNotShowTask('risk-to-self')
  })
})
