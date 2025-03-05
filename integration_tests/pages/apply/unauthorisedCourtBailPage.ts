import Page from '../page'

export default class UnauthorisedCourtBailPage extends Page {
  constructor(name: string) {
    super(`You are unauthorised to start a court bail application.`, name)
  }

  static visit(name: string): UnauthorisedCourtBailPage {
    cy.visit('/applications/unauthorised-court-bail-application')
    return new UnauthorisedCourtBailPage(name)
  }
}
