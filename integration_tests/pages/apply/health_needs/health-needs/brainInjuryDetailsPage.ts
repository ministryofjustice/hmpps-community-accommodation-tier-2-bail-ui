import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class BrainInjuryDetailsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Add brain injury details for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'health-needs',
      'brain-injury-details',
    )

    pageIsActiveInNavigation('Brain injury')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'brain-injury-details',
      }),
    )
  }

  pageHasBrainInjuryGuidance = (): void => {
    cy.get('p').contains('This could be as a result of accident')
  }

  describeInjury = (): void => {
    this.getTextInputByIdAndEnterDetails('injuryDetail', 'Has frontal lobe damange')
  }

  describeSupportNeeded = (): void => {
    this.checkRadioByNameAndValue('supportNeeded', 'yes')
    this.getTextInputByIdAndEnterDetails('supportDetail', 'Requires regular support')
  }

  describeTreatment = (): void => {
    this.checkRadioByNameAndValue('receivingTreatment', 'yes')
    this.getTextInputByIdAndEnterDetails('treatmentDetail', 'Lots of treatment')
  }

  describeVulnerability = (): void => {
    this.checkRadioByNameAndValue('isVulnerable', 'yes')
    this.getTextInputByIdAndEnterDetails('vulnerabilityDetail', 'Medium: can put themselves in danger')
  }

  describeDifficultiesInteracting = (): void => {
    this.checkRadioByNameAndValue('hasDifficultyInteracting', 'yes')
    this.getTextInputByIdAndEnterDetails('interactionDetail', 'Can misunderstand situations')
  }
}
