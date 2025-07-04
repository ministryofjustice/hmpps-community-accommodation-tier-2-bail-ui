import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class OtherHealthPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Does ${nameOrPlaceholderCopy(application.person)} have other health needs?`,
      application,
      'health-needs',
      'other-health',
    )
    pageIsActiveInNavigation('Other health needs')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'other-health',
      }),
    )
  }

  describeOtherHealthNeeds = (): void => {
    this.checkRadioByNameAndValue('hasOtherHealthNeeds', 'yes')
    this.getTextInputByIdAndEnterDetails('healthNeedsDetail', 'Other health needs detail')
  }
}
