import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import paths from '../../../../../server/paths/apply'

export default class GenderPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Is the gender ${nameOrPlaceholderCopy(application.person)} identifies with the same as the sex registered at birth?`,
      application,
      'personal-information',
      'gender',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'personal-information',
        page: 'gender',
      }),
    )
  }

  completeForm(): void {
    this.checkRadioByNameAndValue('gender', 'no')
    this.getTextInputByIdAndEnterDetails('genderIdentity', 'Non binary')
  }
}
