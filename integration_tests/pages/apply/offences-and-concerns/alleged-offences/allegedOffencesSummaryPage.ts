import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class AllegedOffencesSummaryPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Add a summary of ${nameOrPlaceholderCopy(application.person)}'s current alleged offences`,
      application,
      'alleged-offences',
      'alleged-offences-summary',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'alleged-offences',
        page: 'alleged-offences-summary',
      }),
    )
  }

  describeAllegedOffencesSummary(): void {
    this.getTextInputByIdAndEnterDetails('summary', 'Alleged offences details')
  }
}
