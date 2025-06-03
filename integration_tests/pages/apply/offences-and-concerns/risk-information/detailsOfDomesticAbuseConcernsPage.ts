import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'

export default class DetailsOfDomesticAbuseConcernsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Add concerns related to domestic abuse`,
      application,
      'risk-information',
      'details-of-domestic-abuse-concerns',
    )

    pageIsActiveInNavigation('Domestic abuse')
  }

  static visit(application: Application): DetailsOfDomesticAbuseConcernsPage {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risk-information',
        page: 'details-of-domestic-abuse-concerns',
      }),
    )

    return new DetailsOfDomesticAbuseConcernsPage(application)
  }

  enterVictimDetails(): void {
    this.getTextInputByIdAndEnterDetails('victimDetails', 'some details about victims')
  }

  enterSafeguardingDetails(): void {
    this.checkRadioByNameAndValue('safeguarding', 'yes')
    this.getTextInputByIdAndEnterDetails('safeguardingDetail', 'some details about safeguarding measures')
  }
}
