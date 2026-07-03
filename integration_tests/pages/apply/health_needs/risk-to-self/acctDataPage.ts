import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export type AcctData = {
  createdDate: string
  isOngoing: string
  closedDate?: string
  referringInstitution: string
  acctDetails: string
}
export default class AcctDataPage extends ApplyPage {
  constructor(application: Application) {
    super(`Add an ACCT note`, application, 'risk-to-self', 'acct-data')
  }

  checkErrors(): void {
    this.shouldShowErrorSummary('Add a valid created date, for example 2 3 2013')
    this.shouldShowErrorSummary('Select whether this ACCT is ongoing')
    this.shouldShowErrorSummary('Add a referring institution')
    this.shouldShowErrorSummary('Enter the details of the ACCT')
  }

  completeForm({ createdDate, referringInstitution, isOngoing, acctDetails, closedDate }: AcctData): void {
    this.completeDateInputs('createdDate', createdDate)
    this.checkRadioByNameAndValue('isOngoing', isOngoing)
    this.getTextInputByIdAndEnterDetails('referringInstitution', referringInstitution)
    this.getTextInputByIdAndEnterDetails('acctDetails', acctDetails)
    if (closedDate) {
      this.completeDateInputs('closedDate', closedDate)
    }
  }
}
