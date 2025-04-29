import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application } from '@approved-premises/api'
import { Page } from '../../../../utils/decorators'
import TaskListPage from '../../../../taskListPage'
import { dateAndTimeInputsAreValidDates } from '../../../../../utils/dateUtils'
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

  constructor(
    body: Partial<AddAcctNoteBody>,
    private readonly application: Cas2v2Application,
  ) {
    this.body = body as AddAcctNoteBody
  }

  previous() {
    return 'acct'
  }

  next() {
    return 'acct'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!dateAndTimeInputsAreValidDates(this.body, 'createdDate')) {
      errors.createdDate = 'Add a valid created date, for example 2 3 2013'
    }
    if (!this.body.isOngoing) {
      errors.isOngoing = 'Select whether this ACCT is ongoing'
    }
    if (this.body.isOngoing === 'no' && !dateAndTimeInputsAreValidDates(this.body, 'closedDate')) {
      errors.closedDate = 'Add a valid closed date, for example 2 3 2013'
    }
    if (!this.body.referringInstitution) {
      errors.referringInstitution = 'Add a referring institution'
    }
    if (!this.body.acctDetails) {
      errors.acctDetails = 'Enter the details of the ACCT'
    }

    return errors
  }

  response() {
    return {}
  }
}
