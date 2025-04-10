import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class SubstanceMisusePage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Substance and alcohol use details for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'health-needs',
      'substance-misuse',
    )
    pageIsActiveInNavigation('Substance and alcohol')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'substance-misuse',
      }),
    )
  }

  describeSubstanceAndAlcoholUse = (): void => {
    this.checkRadioByNameAndValue('substanceAndAlcoholUse', 'yes')
    this.getTextInputByIdAndEnterDetails('substanceAndAlcoholUseDetail', 'Heroin user')
  }

  provideSubstituteMedicationDetails = (): void => {
    this.checkRadioByNameAndValue('requiresSubstituteMedication', 'yes')
    this.getTextInputByIdAndEnterDetails('substituteMedicationDetail', 'Methadone')
  }

  nameDrugAndAlcoholService = (): void => {
    this.checkRadioByNameAndValue('engagedWithDrugAndAlcoholService', 'yes')
    this.getTextInputByIdAndEnterDetails('serviceDetails', 'The Drugs Project')
  }

  provideDrugAndAlcoholServiceIntentionDetails = (): void => {
    this.checkRadioByNameAndValue('intentToReferToService', 'yes')
  }

  provideNaloxoneDetails = (): void => {
    this.checkRadioByNameAndValue('releasedWithNaloxone', 'yes')
  }
}
