import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class OffencesAndConvictionsGuidancePage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `${nameOrPlaceholderCopy(application.person)}'s current alleged offences and previous convictions`,
      application,
      'provide-offences-and-convictions-details',
      'offences-and-convictions-guidance',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'provide-offences-and-convictions-details',
        page: 'offences-and-convictions-guidance',
      }),
    )
  }
}
