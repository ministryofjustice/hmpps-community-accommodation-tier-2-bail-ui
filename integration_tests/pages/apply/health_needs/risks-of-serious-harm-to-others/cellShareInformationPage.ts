import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class CellShareInformationPage extends ApplyPage {
  constructor(application: Application) {
    super(
      `Cell share information for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'risks-of-serious-harm-to-others',
      'cell-share-information',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risks-of-serious-harm-to-others',
        page: 'cell-share-information',
      }),
    )
  }

  checkErrors(): void {
    this.shouldShowErrorSummary('Select whether there are any comments about cell sharing')
  }

  completeForm(): void {
    this.checkRadioByNameAndValue('hasCellShareComments', 'no')
  }
}
