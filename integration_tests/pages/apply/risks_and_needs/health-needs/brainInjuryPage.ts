import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class BrainInjuryPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Brain injury needs for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'health-needs',
      'brain-injury',
    )

    pageIsActiveInNavigation('Brain injury')
    this.pageHasBrainInjuryGuidance()
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'brain-injury',
      }),
    )
  }

  pageHasBrainInjuryGuidance = (): void => {
    cy.get('.guidance').contains('This could be as a result of accident')
  }

  describeInjuryAndNeeds = (): void => {
    this.checkRadioByNameAndValue('hasBrainInjury', 'yes')
    this.getTextInputByIdAndEnterDetails('injuryDetail', 'Has frontal lobe damange')
  }

  describeVulnerability = (): void => {
    this.checkRadioByNameAndValue('isVulnerable', 'yes')
    this.getTextInputByIdAndEnterDetails('vulnerabilityDetail', 'Medium: can put themselves in danger')
  }

  describeDifficultiesInteracting = (): void => {
    this.checkRadioByNameAndValue('hasDifficultyInteracting', 'yes')
    this.getTextInputByIdAndEnterDetails('interactionDetail', 'Can misunderstand situations')
  }

  describeAdditionalSupportNeeded = (): void => {
    this.checkRadioByNameAndValue('requiresAdditionalSupport', 'yes')
    this.getTextInputByIdAndEnterDetails('addSupportDetail', 'Requires regular support')
  }
}
