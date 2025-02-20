import type { TaskListErrors, YesNoOrDontKnow, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'

export type FundingSources = 'personalSavings' | 'benefits'

const hasNationalInsuranceOptions =
  getQuestions('')['funding-information']['funding-cas2-accommodation'].hasNationalInsuranceNumber.answers

export type FundingCas2AccommodationBody = {
  fundingSource: FundingSources
  fundingSourceDetail: string
  hasNationalInsuranceNumber: YesNoOrDontKnow
  nationalInsuranceNumber: string
  receivingBenefits: YesOrNo
  receivedBenefitSanctions: YesOrNo
  inEducationOrTraining: YesOrNo
}

@Page({
  name: 'funding-cas2-accommodation',
  bodyProperties: [
    'fundingSource',
    'fundingSourceDetail',
    'hasNationalInsuranceNumber',
    'nationalInsuranceNumber',
    'receivingBenefits',
    'receivedBenefitSanctions',
    'inEducationOrTraining',
  ],
})
export default class FundingCas2Accommodation implements TaskListPage {
  documentTitle = 'Funding CAS-2 accommodation'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Funding CAS-2 accommodation'

  questions

  options: Record<string, string>

  body: FundingCas2AccommodationBody

  constructor(
    body: Partial<FundingCas2AccommodationBody>,
    private readonly application: Application,
  ) {
    this.body = body as FundingCas2AccommodationBody

    const applicationQuestions = getQuestions(this.personName)
    this.questions = applicationQuestions['funding-information']['funding-cas2-accommodation']
  }

  previous() {
    return 'taskList'
  }

  next() {
    if (this.body.fundingSource === 'personalSavings') {
      return ''
    }
    return 'applicant-id'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (this.body.fundingSource !== 'personalSavings' && this.body.fundingSource !== 'benefits') {
      errors.fundingSource = 'Select how the applicant will pay for their accommodation and the service charge'
    }
    if (!this.body.hasNationalInsuranceNumber) {
      errors.hasNationalInsuranceNumber = 'Select if the applicant has a National Insurance number'
    }
    if (!this.body.receivingBenefits) {
      errors.receivingBenefits = 'Select if the applicant is currently receiving any benefits'
    }
    if (this.body.receivingBenefits === 'yes' && !this.body.receivedBenefitSanctions) {
      errors.receivedBenefitSanctions =
        'Select if the applicant has received any benefit sanctions in the last 6 months'
    }
    if (!this.body.inEducationOrTraining) {
      errors.inEducationOrTraining = 'Select if the applicant is currently in education or receiving any training'
    }
    return errors
  }

  items(conditionalHtml: string) {
    const items = convertKeyValuePairToRadioItems(hasNationalInsuranceOptions, this.body.hasNationalInsuranceNumber)

    const yes = items.shift()
    const dontKnow = items.pop()
    items.push({ divider: 'or' })

    return [{ ...yes, conditional: { html: conditionalHtml } }, ...items, { ...dontKnow }]
  }
}
