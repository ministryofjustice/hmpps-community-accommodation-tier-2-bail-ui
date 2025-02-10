import errorLookups from '../../server/i18n/en/errors.json'

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
  }

  checkNameIsNotInDocumentTitle(): void {
    cy.title().should('not.include', this.name)
  }

  clickSubmit(text = 'Save and continue'): void {
    cy.get('button').contains(text).click()
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

  clickBack(): void {
    cy.get('a').contains('Back').click()
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')
}
