import { Cas2Application as Application, FullPerson } from '@approved-premises/api'
import Page from '../page'
import TaskListPage from '../../../server/form-pages/taskListPage'
import { DateFormats } from '../../../server/utils/dateUtils'

import Apply from '../../../server/form-pages/apply'

export default class ApplyPage extends Page {
  taskListPage: TaskListPage

  private app: Application

  constructor(title: string, application: Application, taskName: string, pageName: string, _backLink?: string) {
    const person = application.person as FullPerson
    super(title, person.name)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Class = Apply.pages[taskName][pageName] as any
    this.taskListPage = new Class(!!application.data?.[taskName]?.[pageName], application)
    this.app = application
  }

  selectAnswer(name: string, option: string): void {
    this.checkRadioByNameAndValue(name, option)
  }

  shouldShowOasysImportDate(application: Application, task: string): void {
    const date = application.data[task]['oasys-import'].oasysImportedDate

    cy.get('p').contains(`Imported from OASys on ${DateFormats.isoDateToUIDate(date, { format: 'medium' })}`)
  }

  clickConfirm(): void {
    this.checkCheckboxByValue('confirmed')
  }

  shouldShowSuccessMessage(message: string): void {
    cy.get('.govuk-notification-banner').within(() => {
      cy.get('h2').contains('Success')
      cy.get('h3').contains(message)
    })
  }

  shouldShowPrintButton(text = 'Download as a PDF'): void {
    cy.get('button').contains(text)
  }

  checkErrors() {
    // Override this method in the child class
  }

  completeForm(_args = {}) {
    // Override this method in the child class
  }

  refreshMock() {
    // Save the submission and reload in case the form content changes
    cy.task('stubApplicationGetFromLastUpdate', { application: this.app })
    cy.reload()
  }

  checkErrorsAndSubmit(formArguments?: object) {
    // When I submit the empty form
    this.clickSubmit()

    // Then I see the mandatory field errors
    this.checkErrors()

    // When I complete the form and submit again
    this.completeForm(formArguments)
    this.clickSubmit()
    this.refreshMock()
  }
}
