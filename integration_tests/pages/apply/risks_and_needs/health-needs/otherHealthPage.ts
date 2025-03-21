import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class OtherHealthPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Other health needs for ${nameOrPlaceholderCopy(application.person)}`,
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

  describeLongTermHealthConditions = (): void => {
    this.checkRadioByNameAndValue('hasLongTermHealthCondition', 'yes')
    this.getTextInputByIdAndEnterDetails('healthConditionDetail', 'Chronic arthritis')
  }

  describeSeizures = (): void => {
    this.checkRadioByNameAndValue('hasSeizures', 'yes')
    this.getTextInputByIdAndEnterDetails('seizuresDetail', 'Epilepsy: controlled by meds')
  }

  selectHasHadStroke = (): void => {
    this.checkRadioByNameAndValue('hasHadStroke', 'no')
  }

  selectBeingTreatedForCancer = (): void => {
    this.checkRadioByNameAndValue('beingTreatedForCancer', 'no')
  }

  describeOtherHealthNeeds = (): void => {
    this.checkRadioByNameAndValue('otherHealthNeeds', 'yes')
    this.getTextInputByIdAndEnterDetails('otherHealthNeedsDetail', 'Other health needs detail')
  }
}
