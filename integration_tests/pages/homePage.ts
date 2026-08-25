import paths from '../../server/paths/static'
import Page, { PageElement } from './page'

export default class HomePage extends Page {
  constructor() {
    const name = undefined
    super('CAS2', name)
    this.checkPhaseBanner()
  }

  static visit(): HomePage {
    cy.visit('/')

    return new HomePage()
  }

  shouldShowSignOutButton(): void {
    cy.get('[data-qa="signOut"]').should('exist')
  }

  shouldShowCards(sections: Array<string>) {
    sections.forEach(section => cy.get(`[data-cy-card-section="${section}"]`).should('exist'))
  }

  shouldNotShowCards(sections: Array<string>) {
    sections.forEach(section => cy.get(`[data-cy-card-section="${section}"]`).should('not.exist'))
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  checkPhaseBanner(): void {
    cy.get('[data-cy-phase-banner="phase-banner"]').contains('This is a new service')
  }

  shouldShowInterviewQuestionLinks(): void {
    cy.contains('interview questions sheet (DOCX, 124KB)').should(
      'have.attr',
      'href',
      paths.static.interviewQuestionsDocx({}),
    )
    cy.contains('interview questions sheet (HTML, 21KB)(opens in new tab)').should(
      'have.attr',
      'href',
      paths.static.interviewQuestionsHtml({}),
    )
  }

  shouldNotShowInterviewQuestionLinks(): void {
    cy.contains('interview questions sheet (DOCX, 124KB)').should('not.exist')
    cy.contains('interview questions sheet (HTML, 21KB)(opens in new tab)').should('not.exist')
  }

  shouldShowApplicationTypes(): void {
    cy.contains('Types of application you can submit')
      .siblings('ul')
      .within(_ => {
        cy.get('li').contains('Bail').should('exist')
        cy.get('li').contains('Alternative to custodial recall (ATCR)').should('exist')
        cy.get('li').contains('Homeless at conditional release date (HCRD)').should('exist')
        cy.get('li').contains('Homeless at end of fixed-term recall').should('exist')
        cy.get('li').contains('Intensive supervision courts (ISC)').should('exist')
        cy.get('li').contains('Risk Assessed Recall Review (RARR)').should('exist')
        cy.get('li').contains('Move on from Approved Premises').should('exist')
      })
  }

  shouldNotShowApplicationTypes(): void {
    cy.contains('Types of application you can submit').should('not.exist')
  }
}
