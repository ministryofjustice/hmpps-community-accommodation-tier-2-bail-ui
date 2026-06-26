import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import { summaryListItem } from '../../../../../server/utils/formUtils'
import { DateFormats } from '../../../../../server/utils/dateUtils'
import { Offence } from './currentOffencesData'

export default class CurrentConvictionsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Current offences for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'current-offences',
      'current-offences',
    )
  }

  checkOffence(offence: Offence) {
    cy.contains(offence.title)
      .parents('.govuk-summary-card')
      .within(() => {
        this.shouldContainSummaryListItems([summaryListItem('Type:', offence.offenceCategory)])
        this.shouldContainSummaryListItems([
          summaryListItem('Offence date:', DateFormats.isoDateToUIDate(offence.offenceDate, { format: 'medium' })),
        ])
        this.shouldContainSummaryListItems([summaryListItem('Sentence length:', offence.sentenceLength)])
        this.shouldContainSummaryListItems([summaryListItem('Offence details:', offence.summary)])
      })
  }

  completeForm(): void {
    this.getTextInputByIdAndEnterDetails('titleAndNumber', 'Offence title')
    this.getSelectInputByIdAndSelectAnEntry('offenceCategory', 'Weapons or Firearms')
    this.completeDateInputs('offenceDate', '2026-05-15')
    this.getTextInputByIdAndEnterDetails('sentenceLength', '4 years')
    this.getTextInputByIdAndEnterDetails('summary', 'Summary of offence')
  }
}
