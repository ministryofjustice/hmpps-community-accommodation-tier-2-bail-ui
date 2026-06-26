import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export type Offence = {
  title: string
  offenceCategory: string
  offenceDate: string
  sentenceLength: string
  summary: string
}

export default class CurrentConvictionsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Add ${nameOrPlaceholderCopy(application.person)}'s current offence details`,
      application,
      'current-offences',
      'current-offences',
    )
  }

  checkErrors() {
    this.shouldShowErrorSummary('Enter the offence title')
    this.shouldShowErrorSummary('Select the offence type')
    this.shouldShowErrorSummary('Enter the date the offence was committed')
    this.shouldShowErrorSummary('Enter the sentence length')
    this.shouldShowErrorSummary('Enter a summary of the offence')
  }

  completeForm(offence: Offence): void {
    this.getTextInputByIdAndEnterDetails('titleAndNumber', offence.title)
    this.getSelectInputByIdAndSelectAnEntry('offenceCategory', offence.offenceCategory.toLowerCase())
    this.completeDateInputs('offenceDate', offence.offenceDate)
    this.getTextInputByIdAndEnterDetails('sentenceLength', offence.sentenceLength)
    this.getTextInputByIdAndEnterDetails('summary', offence.summary)
  }
}
