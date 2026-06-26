import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import { AcctData } from './acctDataPage'
import { DateFormats } from '../../../../../server/utils/dateUtils'
import { summaryListItem } from '../../../../../server/utils/formUtils'

export default class AcctPage extends ApplyPage {
  constructor(application: Application) {
    super(`${nameOrPlaceholderCopy(application.person)}'s ACCT notes`, application, 'risk-to-self', 'acct')
  }

  verifyAcctInList(acct: AcctData) {
    const title = `${DateFormats.isoDateToUIDate(acct.createdDate, { format: 'medium' })} - ${acct.closedDate ? DateFormats.isoDateToUIDate(acct.closedDate, { format: 'medium' }) : 'Ongoing'}`
    cy.contains(title)
      .parents('.govuk-summary-card')
      .within(() => {
        this.shouldContainSummaryListItems([
          summaryListItem('Referring institution', acct.referringInstitution),
          summaryListItem('Details', acct.acctDetails),
        ])
      })
  }

  verifyListLength(length: number) {
    cy.get('.govuk-summary-card').should('have.length', length)
  }
}
