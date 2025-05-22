import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { AddAcctNoteBody } from './custom-forms/addAcctNote'
import { DateFormats } from '../../../../utils/dateUtils'
import paths from '../../../../paths/apply'
import { createQueryString, nameOrPlaceholderCopy } from '../../../../utils/utils'

type AcctBody = { acctList: string }

type AcctUI = {
  title: string
  referringInstitution: string
  acctDetails: string
  createdDate: string
  closedDate?: string
}

@Page({
  name: 'acct',
  bodyProperties: ['acctList'],
})
export default class Acct implements TaskListPage {
  documentTitle = `The person's ACCT`

  title = `${nameOrPlaceholderCopy(this.application.person)}'s ACCT`

  body: AcctBody

  accts: AcctUI[]

  hasExistingAcctNotes: boolean

  constructor(
    body: Partial<AcctBody>,
    private readonly application: Application,
  ) {
    if (application.data['risk-information'] && application.data['risk-information']['add-acct-note']) {
      const acctData = application.data['risk-information']['add-acct-note'] as [AddAcctNoteBody]

      this.accts = acctData.map((acct, index) => {
        const query = {
          redirectPage: 'acct',
        }
        const isOngoing = acct.isOngoing === 'yes'
        const createdDate = DateFormats.dateAndTimeInputsToUiDate(acct, 'createdDate')
        const closedDate = !isOngoing && DateFormats.dateAndTimeInputsToUiDate(acct, 'closedDate')

        return {
          title: `${createdDate} - ${isOngoing ? 'Ongoing' : closedDate}`,
          referringInstitution: acct.referringInstitution,
          acctDetails: acct.acctDetails,
          createdDate,
          closedDate,
          removeLink: `${paths.applications.removeFromList({
            id: application.id,
            task: 'risk-information',
            page: 'add-acct-note',
            index: index.toString(),
          })}?${createQueryString(query)}`,
        }
      })
    }
    this.body = body as AcctBody
    this.hasExistingAcctNotes = Boolean(application.data['risk-information']?.['add-acct-note']?.length)
  }

  previous() {
    return 'does-the-applicant-have-acct-notes'
  }

  next() {
    return 'domestic-abuse-concerns'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.hasExistingAcctNotes) {
      errors.acctList = 'ACCT notes must be added to the application'
    }

    return errors
  }

  response() {
    const response: Record<string, string> = {}

    this.accts?.forEach(acct => {
      const key = getAcctMetadata(acct)
      response[key] = `Referring institution: ${acct.referringInstitution}\nDetails: ${acct.acctDetails}`
    })

    return response
  }
}

const getAcctMetadata = (acct: AcctUI): string => {
  let key = `ACCT<br />Created: ${acct.createdDate}`

  if (acct.closedDate) {
    key += `<br />Closed: ${acct.closedDate}`
    return key
  }

  key += `<br />Ongoing`
  return key
}
