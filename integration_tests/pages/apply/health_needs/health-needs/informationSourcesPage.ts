import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'

export default class InformationSourcesPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      "Where did you get the information on the applicant's health needs from?",
      application,
      'health-needs',
      'information-sources',
    )

    pageIsActiveInNavigation('Information sources')
  }

  static visit(application: Application): InformationSourcesPage {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'information-sources',
      }),
    )

    return new InformationSourcesPage(application)
  }

  completeForm(): void {
    this.checkCheckboxByValue('healthcare')
    this.checkCheckboxByValue('previousOasys')
    this.checkCheckboxByValue('other')
    this.completeDateInputs('previousOasysDate', '2022-10-04')
    this.getTextInputByIdAndEnterDetails('otherSourcesDetail', 'some other sources')
  }
}
