import Page from '../../page'

export default class BeforeYouStartPage extends Page {
  constructor(options: { isBail: boolean }) {
    if (options.isBail) {
      super('Apply for short-term accommodation (CAS2) for bail')
    } else {
      super('Apply for short-term accommodation (CAS2)')
    }
  }

  static visit(options: { isBail: boolean }): BeforeYouStartPage {
    if (options.isBail) {
      cy.visit('/new-cohorts/applications/bail/before-you-start')
    } else {
      cy.visit('/new-cohorts/applications/before-you-start')
    }

    return new BeforeYouStartPage(options)
  }
}
