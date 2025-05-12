import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application } from '@approved-premises/api'
import { Page } from '../../../../utils/decorators'
import TaskListPage from '../../../../taskListPage'
import { dateIsTodayOrInThePast, dateIsComplete, dateAndTimeInputsAreValidDates } from '../../../../../utils/dateUtils'
import { getQuestions } from '../../../../utils/questions'
import { nameOrPlaceholderCopy } from '../../../../../utils/utils'

export type AddAcctNoteBody = {
  referringInstitution: string
  createdDate: string
  'createdDate-day': string
  'createdDate-month': string
  'createdDate-year': string
  isOngoing: string
  closedDate?: string
  'closedDate-day': string
  'closedDate-month': string
  'closedDate-year': string
  acctDetails: string
}

@Page({
  name: 'add-acct-note',
  bodyProperties: [
    'referringInstitution',
    'createdDate-day',
    'createdDate-month',
    'createdDate-year',
    'isOngoing',
    'closedDate-day',
    'closedDate-month',
    'closedDate-year',
    'acctDetails',
  ],
})
export default class AcctData implements TaskListPage {
  title = `Add an ACCT note for ${nameOrPlaceholderCopy(this.application.person)}`

  documentTitle = 'Add an ACCT note for the applicant'

  body: AddAcctNoteBody

  questions = getQuestions('')['risk-information']['add-acct-note']

  taskName = 'risk-information'

  pageName = 'add-acct-note'

  hasExistingAcctNotes: boolean

  constructor(
    body: Partial<AddAcctNoteBody>,
    private readonly application: Cas2v2Application,
  ) {
    this.body = body as AddAcctNoteBody
    this.hasExistingAcctNotes = Boolean(application.data['risk-information']?.['add-acct-note']?.length)
  }

  previous() {
    return 'does-the-applicant-have-acct-notes'
  }

  next() {
    return 'acct'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!dateIsComplete(this.body, 'createdDate')) {
      errors.createdDate = 'Enter when the ACCT was created'
    }

    if (dateIsComplete(this.body, 'createdDate') && !dateAndTimeInputsAreValidDates(this.body, 'createdDate')) {
      errors.createdDate = 'Date created must be a real date'
    }

    if (
      dateIsComplete(this.body, 'createdDate') &&
      dateAndTimeInputsAreValidDates(this.body, 'createdDate') &&
      !dateIsTodayOrInThePast(this.body, 'createdDate')
    ) {
      errors.createdDate = 'Date created must be today or in the past'
    }

    if (!this.body.isOngoing) {
      errors.isOngoing = 'Select if the ACCT is ongoing'
    }

    if (this.body.isOngoing === 'no') {
      if (!dateIsComplete(this.body, 'closedDate')) {
        errors.closedDate = 'Enter when the ACCT was closed'
      }
      if (dateIsComplete(this.body, 'closedDate') && !dateAndTimeInputsAreValidDates(this.body, 'closedDate')) {
        errors.closedDate = 'Date closed must be a real date'
      }
      if (
        dateIsComplete(this.body, 'closedDate') &&
        dateAndTimeInputsAreValidDates(this.body, 'closedDate') &&
        !dateIsTodayOrInThePast(this.body, 'closedDate')
      ) {
        errors.closedDate = 'Date closed must be today or in the past'
      }
    }

    if (!this.body.referringInstitution) {
      errors.referringInstitution = 'Enter the referring institution'
    }
    if (!this.body.acctDetails) {
      errors.acctDetails = 'Enter details about the ACCT'
    }

    return errors
  }

  response() {
    return {}
  }
}
