import 'cypress-axe'
import { Result } from 'axe-core'
import {
  Cas2v2ApplicationSummary,
  FullPerson,
  Cas2v2SubmittedApplication as SubmittedApplication,
} from '@approved-premises/api'
import errorLookups from '../../server/i18n/en/errors.json'
import { DateFormats } from '../../server/utils/dateUtils'
import paths from '../../server/paths/apply'
import { camelCaseToCapitaliseFirstWordAndAddSpaces } from '../../server/utils/utils'

export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new (...args: Array<unknown>) => T, ...args: Array<unknown>): T {
    return new constructor(...args)
  }

  protected constructor(
    private readonly title: string,
    private readonly name: string,
  ) {
    this.checkOnPage()
    this.checkNameIsNotInDocumentTitle()
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.title)
    cy.injectAxe()
    cy.configureAxe({
      rules: [
        // Temporary rule whilst this issue is resolved https://github.com/w3c/aria/issues/1404
        { id: 'aria-allowed-attr', reviewOnFail: true },
        // Ignore the "All page content should be contained by landmarks", which conflicts with GOV.UK guidance (https://design-system.service.gov.uk/components/back-link/#how-it-works)
        { id: 'region', reviewOnFail: true, selector: '.govuk-back-link' },
      ],
    })
    cy.checkA11y(undefined, undefined, this.logAccessibilityViolations)
  }

  checkNameIsNotInDocumentTitle(): void {
    cy.title().should('not.include', this.name)
  }

  clickSubmit(text = 'Save and continue'): void {
    cy.get('button').contains(text).click()
  }

  clickContinue(): void {
    cy.get('button').contains('Continue').click()
  }

  checkRadioByNameAndValue(name: string, option: string): void {
    cy.get(`input[name="${name}"][value="${option}"]`).check()
  }

  checkCheckboxByValue(option: string): void {
    cy.get(`input[value="${option}"]`).check()
  }

  getTextInputByIdAndEnterDetails(id: string, details: string): void {
    cy.get(`#${id}`).type(details)
  }

  shouldShowErrorMessagesForFields(fields: Array<string>, error?: string): void {
    fields.forEach(field => {
      const errorMessagesLookup = error || errorLookups[error || field].empty

      cy.get('.govuk-error-summary').should('contain', errorMessagesLookup)
      cy.get(`[data-cy-error-${field}]`).should('contain', errorMessagesLookup)
    })
  }

  shouldShowPrisonApplications(applications: Array<Cas2v2ApplicationSummary>): void {
    applications.forEach(application => {
      const { personName, nomsNumber, createdByUserName, applicationOrigin } = application
      const statusLabel = application.latestStatusUpdate?.label

      cy.contains(personName)
        .should('have.attr', 'href', paths.applications.overview({ id: application.id }))
        .parent()
        .parent()
        .within(() => {
          cy.get('th').eq(0).contains(personName)
          cy.get('td').eq(0).should('contain.text', nomsNumber)
          cy.get('td').eq(1).should('contain.text', createdByUserName)
          cy.get('td').eq(2).should('contain.text', camelCaseToCapitaliseFirstWordAndAddSpaces(applicationOrigin))
          cy.get('td').eq(3).should('contain.text', statusLabel)
        })
    })
  }

  clickBack(): void {
    cy.get('a').contains('Back').click()
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  logAccessibilityViolations(violations: Result[]): void {
    cy.task('logAccessibilityViolationsSummary', `Accessibility violations detected: ${violations.length}`)

    const violationData = violations.map(({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
      nodeTargets: nodes.map(node => node.target).join(' - '),
    }))

    cy.task('logAccessibilityViolationsTable', violationData)
  }

  clickLink(label: string): void {
    cy.get('a:visible').contains(label).click()
  }

  clickRemove(): void {
    cy.get('a').contains('Remove').click()
  }

  getSelectInputByIdAndSelectAnEntry(id: string, entry: string): void {
    cy.get(`#${id}`).select(entry)
  }

  completeDateInputs(prefix: string, date: string): void {
    const parsedDate = DateFormats.isoToDateObj(date)
    cy.get(`#${prefix}-day`).type(parsedDate.getDate().toString())
    cy.get(`#${prefix}-month`).type(`${parsedDate.getMonth() + 1}`)
    cy.get(`#${prefix}-year`).type(parsedDate.getFullYear().toString())
  }

  checkTermAndDescription(term: string, description: string): void {
    const formattedDescription = this.removeWhiteSpaceAndLineBreaks(description)
    const formattedTerm = this.removeHtmlBreaks(term)

    cy.get('dt')
      .contains(formattedTerm)
      .parents('.govuk-summary-list__row')
      .within(() => {
        cy.get('dd').invoke('text').should('contain', formattedDescription)
      })
  }

  checkTermAndDescriptionForAnswers(term: string, description: string, testId: string): void {
    const formattedDescription = this.removeWhiteSpaceAndLineBreaks(description)
    const formattedTerm = this.removeHtmlBreaks(term)

    cy.get(`[data-testid=${testId}]`)
      .parents('.govuk-summary-list__row')
      .within(() => {
        cy.get('dt').contains(formattedTerm)
        cy.get('dd').invoke('text').should('contain', formattedDescription)
      })
  }

  removeWhiteSpaceAndLineBreaks(stringToReplace: string = ''): string {
    return stringToReplace.trim().replace(/(\r\n|\n|\r)/gm, '')
  }

  removeHtmlBreaks(stringToReplace: string): string {
    return stringToReplace.replace(/<br \/>/g, '')
  }

  hasApplicantDetails(application: SubmittedApplication): void {
    const person = application.person as FullPerson
    cy.get(`[data-cy-check-your-answers-section="applicant-details"]`).within(() => {
      this.checkTermAndDescription(
        'Application type',
        application.applicationOrigin === 'courtBail' ? 'Court Bail' : 'Prison Bail',
      )
      this.checkTermAndDescription('Full name', person.name)
      this.checkTermAndDescription(
        'Date of birth',
        DateFormats.isoDateToUIDate(person.dateOfBirth, { format: 'short' }),
      )
      this.checkTermAndDescription('Nationality', person.nationality)
      this.checkTermAndDescription('Sex', person.sex)
      this.checkTermAndDescription('Prison number', person.nomsNumber)
      cy.get('dt')
        .contains(/Prison $/)
        .parent()
        .within(() => {
          cy.get('dd').invoke('text').should('contain', person.prisonName)
        })
      this.checkTermAndDescription('PNC number', person.pncNumber)
      this.checkTermAndDescription('CRN from NDelius', person.crn)
    })
  }
}
