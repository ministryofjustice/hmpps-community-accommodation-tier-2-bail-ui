import Page from '../page'

export default class UnauthorisedPrisonBailPage extends Page {
  constructor(name: string) {
    super(`You are unauthorised to start a prison bail application.`, name)
  }

  static visit(name: string): UnauthorisedPrisonBailPage {
    cy.visit('/applications/unauthorised-prison-bail-application')
    return new UnauthorisedPrisonBailPage(name)
  }
}
