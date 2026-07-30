import Page from '../../page'

export default class ApplicationOriginPage extends Page {
  constructor(name?: string) {
    super(`Are you applying for someone who is seeking bail?`, name)
  }

  static visit(name?: string): ApplicationOriginPage {
    cy.visit('/new-cohorts/applications/application-type')
    return new ApplicationOriginPage(name)
  }

  selectBail() {
    this.checkRadioByNameAndLabel('applicationOrigin', 'Yes')
  }

  selectOther() {
    this.checkRadioByNameAndLabel('applicationOrigin', 'No')
  }
}
