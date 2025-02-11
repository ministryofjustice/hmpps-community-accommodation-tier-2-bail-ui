import { Cas2v2Application as Application } from '@approved-premises/api'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import ApplyPage from '../../applyPage'

export default class MilitaryVeteranPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Is ${nameOrPlaceholderCopy(application.person)} a military veteran?`,
      application,
      'equality-and-diversity-monitoring',
      'military-veteran',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'equality-and-diversity-monitoring',
        page: 'military-veteran',
      }),
    )
  }
}
