import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'

export default class BailHearingInformationPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(`Add bail hearing information`, application, 'bail-hearing-information', 'bail-hearing-information')
  }

  static visit(application: Application): BailHearingInformationPage {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'bail-hearing-information',
        page: 'bail-hearing-information',
      }),
    )

    return new BailHearingInformationPage(application)
  }

  addBailHearingDate(): void {
    this.checkRadioByNameAndValue('isBailHearingDateKnown', 'yes')
    this.completeDateInputs('bailHearingDate', '3000-09-19')
  }

  addCourt(): void {
    this.getTextInputByIdAndEnterDetails('courtName', 'the odd bailey')
  }

  addHearingMedium(): void {
    this.checkRadioByNameAndValue('bailHearingMedium', 'inCourt')
  }
}
