import Page from './page'

export default class InterviewQuestionsPage extends Page {
  constructor() {
    const name = undefined
    super('Apply for short-term accommodation (CAS2) for bail interview questions sheet', name)
  }

  static visit(): InterviewQuestionsPage {
    cy.visit('/interview-questions.html')

    return new InterviewQuestionsPage()
  }

  shouldShowSections(): void {
    cy.get('h2').contains('Before you start, check you have:')
    cy.get('h2').contains('Applicant details')
    cy.get('h2').contains('Exclusion zones and preferred areas')
    cy.get('h2').contains('Gang affiliation and family unit')
    cy.get('h2').contains('Funding CAS2 accommodation')
    cy.get('h2').contains('Offence information')
    cy.get('h2').contains('Health needs')
    cy.get('h2').contains('Concerns to the applicant and others')
    cy.get('h2').contains('Bail information')
    cy.get('h2').contains('Equality and diversity monitoring information')
  }
}
