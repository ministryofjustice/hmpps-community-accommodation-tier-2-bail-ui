import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'

export default class NonStandardBailConditionsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Are there any non-standard bail conditions being considered?`,
      application,
      'bail-conditions',
      'non-standard-bail-conditions',
    )
  }

  static visit(application: Application): NonStandardBailConditionsPage {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'bail-conditions',
        page: 'non-standard-bail-conditions',
      }),
    )

    return new NonStandardBailConditionsPage(application)
  }

  completeForm(): void {
    this.checkRadioByNameAndValue('nonStandardBailConditions', 'yes')
    this.getTextInputByIdAndEnterDetails('nonStandardBailConditionsDetail', 'some conditions')
  }
}
