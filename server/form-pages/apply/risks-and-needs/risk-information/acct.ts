import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { AcctDataBody } from './custom-forms/acctData'
import { DateFormats } from '../../../../utils/dateUtils'
import paths from '../../../../paths/apply'
import { createQueryString, nameOrPlaceholderCopy } from '../../../../utils/utils'

type AcctBody = Record<string, never>

type AcctUI = {
  title: string
  referringInstitution: string
  acctDetails: string
  createdDate: string
  closedDate?: string
}

@Page({
  name: 'acct',
  bodyProperties: ['acctDetail'],
})
export default class Acct implements TaskListPage {
  documentTitle = 'Assessment, Care in Custody and Teamwork (ACCT) notes for the person'

  title = `Assessment, Care in Custody and Teamwork (ACCT) notes for ${nameOrPlaceholderCopy(this.application.person)}`

  body: AcctBody

  accts: AcctUI[]

  constructor(
    body: Partial<AcctBody>,
    private readonly application: Application,
  ) {
    if (application.data['risk-information'] && application.data['risk-information']['acct-data']) {
      const acctData = application.data['risk-information']['acct-data'] as [AcctDataBody]

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
            page: 'acct-data',
            index: index.toString(),
          })}?${createQueryString(query)}`,
        }
      })
    }
    this.body = body as AcctBody
  }

  previous() {
    return 'self-harm'
  }

  next() {
    return 'violence-and-arson'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }

  response() {
    const response: Record<string, string> = {}

    this.accts?.forEach(acct => {
      const key = getAcctMetadata(acct)
      response[key] = acct.acctDetails
    })

    return response
  }
}

const getAcctMetadata = (acct: AcctUI): string => {
  let key = `ACCT<br />Created: ${acct.createdDate}`

  if (acct.closedDate) {
    key += `<br />Expiry: ${acct.closedDate}`
    return key
  }

  key += `<br />Ongoing`
  return key
}
