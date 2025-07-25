import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

type DoesTheApplicantHaveAcctNotesBody = {
  applicantHasAcctNotes: YesOrNo | 'notInPrisonCustody'
}

@Page({
  name: 'does-the-applicant-have-acct-notes',
  bodyProperties: ['applicantHasAcctNotes'],
})
export default class DoesTheApplicantHaveAcctNotes implements TaskListPage {
  documentTitle = `Does the applicant have any ACCT notes`

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Assessment, Care in Custody and Teamwork (ACCT) notes for ${this.personName}`

  body: DoesTheApplicantHaveAcctNotesBody

  questions = getQuestions(this.personName)['risk-information']['does-the-applicant-have-acct-notes']

  constructor(
    body: Partial<DoesTheApplicantHaveAcctNotesBody>,
    private readonly application: Application,
  ) {
    this.body = body as DoesTheApplicantHaveAcctNotesBody
  }

  previous() {
    return 'self-harm'
  }

  next() {
    if (this.body.applicantHasAcctNotes === 'yes') {
      return this.hasExistingACCTNotes() ? 'acct' : 'add-acct-note'
    }

    return 'domestic-abuse-concerns'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.applicantHasAcctNotes) {
      errors.applicantHasAcctNotes = 'Select if they have any ACCT notes, or if they are not in prison custody'
    }
    return errors
  }

  private hasExistingACCTNotes(): boolean {
    return Boolean(this.application.data['risk-information']?.['add-acct-note']?.length)
  }
}
