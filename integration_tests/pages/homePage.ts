import paths from '../../server/paths/static'
import Page, { PageElement } from './page'

export default class HomePage extends Page {
  constructor() {
    const name = undefined
    super('Short-term accommodation (CAS2) for bail', name)
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
    cy.contains('interview questions sheet (HTML, 21KB)(opens in a new window)').should(
      'have.attr',
      'href',
      paths.static.interviewQuestionsHtml({}),
    )
  }

  shouldNotShowInterviewQuestionLinks(): void {
    cy.contains('interview questions sheet (DOCX, 124KB)').should('not.exist')
    cy.contains('interview questions sheet (HTML, 21KB)(opens in a new window)').should('not.exist')
  }
}
