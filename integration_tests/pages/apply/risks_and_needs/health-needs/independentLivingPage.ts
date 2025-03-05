import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class IndependentLivingPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Can ${nameOrPlaceholderCopy(application.person)} live independently and in shared accommodation?`,
      application,
      'health-needs',
      'independent-living',
    )
  }

  static visit(application: Application): IndependentLivingPage {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'independent-living',
      }),
    )

    return new IndependentLivingPage(application)
  }
}
