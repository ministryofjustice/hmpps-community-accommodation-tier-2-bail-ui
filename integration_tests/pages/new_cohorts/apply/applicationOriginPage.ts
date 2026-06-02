import Page from '../../page'

export default class ApplicationOriginPage extends Page {
  constructor(name: string) {
    super(`Which type of application do you want to make?`, name)
  }

  static visit(name: string): ApplicationOriginPage {
    cy.visit('/new-cohorts/applications/application-type')
    return new ApplicationOriginPage(name)
  }
}
