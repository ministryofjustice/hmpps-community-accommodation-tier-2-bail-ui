import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class DoesTheApplicantHaveAcctNotesPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Assessment, Care in Custody and Teamwork (ACCT) notes for ${nameOrPlaceholderCopy(application.person, 'The person')}`,
      application,
      'risk-information',
      'does-the-applicant-have-acct-notes',
    )
    pageIsActiveInNavigation('ACCT notes')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risk-information',
        page: 'does-the-applicant-have-acct-notes',
      }),
    )
  }

  selectApplicantHasAcctNotes(): void {
    this.checkRadioByNameAndValue('applicantHasAcctNotes', 'yes')
  }

  selectApplicantDoesNotHaveAcctNotes(): void {
    this.checkRadioByNameAndValue('applicantHasAcctNotes', 'no')
  }

  selectApplicantIsNotInPrisonCustody(): void {
    this.checkRadioByNameAndValue('applicantHasAcctNotes', 'notInPrisonCustody')
  }
}
