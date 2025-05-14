import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class ContactedCppAboutCurrentRiskLevelsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Have you contacted the CPP about ${nameOrPlaceholderCopy(application.person)}'s current risk levels?`,
      application,
      'add-probation-supervision-details',
      'contacted-cpp-about-current-risk-levels',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'add-probation-supervision-details',
        page: 'contacted-cpp-about-current-risk-levels',
      }),
    )
  }

  selectYesToContactingCpp(): void {
    this.checkRadioByNameAndValue('hasContactedCppAboutCurrentRiskLevels', 'yes')
  }

  selectNoToContactingCpp(): void {
    this.checkRadioByNameAndValue('hasContactedCppAboutCurrentRiskLevels', 'no')
  }

  enterContactDate(): void {
    this.completeDateInputs('contactDate', '2024-06-01')
  }
}
