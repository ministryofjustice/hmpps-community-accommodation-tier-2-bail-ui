import { Cas2v2Application as Application } from '@approved-premises/api'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import ApplyPage from '../../applyPage'

export default class ParentalCarerResponsibilitiesPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Does ${nameOrPlaceholderCopy(application.person)} have parental or carer responsibilities?`,
      application,
      'equality-and-diversity-monitoring',
      'parental-carer-responsibilities',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'equality-and-diversity-monitoring',
        page: 'parental-carer-responsibilities',
      }),
    )
  }
}
