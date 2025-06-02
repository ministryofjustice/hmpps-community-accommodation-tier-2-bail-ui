import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type MentalHealthBody = {
  hasMentalHealthNeeds: YesOrNo
  needsDetail: string
  hasSupportNeeds: YesOrNo
  supportNeedsDetail: string
  receivesTreatment: YesOrNo
  treatmentDetail: string
  isEngagedWithService: YesOrNo | 'awaitingAssessment'
  serviceDetail: string
  willReferralBeMade: YesOrNo | 'notInPrisonCustody'
  needsPresentation: string
}

@Page({
  name: 'mental-health',
  bodyProperties: [
    'hasMentalHealthNeeds',
    'needsDetail',
    'hasSupportNeeds',
    'supportNeedsDetail',
    'receivesTreatment',
    'treatmentDetail',
    'isEngagedWithService',
    'serviceDetail',
    'willReferralBeMade',
    'needsPresentation',
  ],
})
export default class MentalHealth implements TaskListPage {
  documentTitle = 'Mental health needs details for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Mental health needs details for ${this.personName}`

  questions = getQuestions(this.personName)['health-needs']['mental-health']

  body: MentalHealthBody

  constructor(
    body: Partial<MentalHealthBody>,
    private readonly application: Application,
  ) {
    this.body = body as MentalHealthBody
  }

  previous() {
    return 'physical-health'
  }

  next() {
    return 'communication-and-language-relevance-check'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasMentalHealthNeeds) {
      errors.hasMentalHealthNeeds = 'Select if they have any mental health needs'
    }
    if (this.body.hasMentalHealthNeeds === 'yes' && !this.body.needsDetail) {
      errors.needsDetail = 'Enter details of their needs'
    }

    if (!this.body.hasSupportNeeds) {
      errors.hasSupportNeeds = 'Select if they need any support'
    }
    if (this.body.hasSupportNeeds === 'yes' && !this.body.supportNeedsDetail) {
      errors.supportNeedsDetail = 'Enter the type of support needed'
    }

    if (!this.body.receivesTreatment) {
      errors.receivesTreatment = 'Select if they receive any treatment'
    }
    if (this.body.receivesTreatment === 'yes' && !this.body.treatmentDetail) {
      errors.treatmentDetail = 'Enter details about their treatment'
    }

    if (!this.body.isEngagedWithService) {
      errors.isEngagedWithService =
        'Select if they are engaged with a mental health service, or if awaiting an assessment'
    }
    if (this.body.isEngagedWithService === 'yes' && !this.body.serviceDetail) {
      errors.serviceDetail = 'Enter the mental health service'
    }

    if (!this.body.willReferralBeMade) {
      errors.willReferralBeMade = 'Select if a referral for support will be made, or if they are not in prison custody'
    }

    return errors
  }

  onSave(): void {
    if (this.body.hasMentalHealthNeeds !== 'yes') {
      delete this.body.needsDetail
    }

    if (this.body.hasSupportNeeds !== 'yes') {
      delete this.body.supportNeedsDetail
    }

    if (this.body.receivesTreatment !== 'yes') {
      delete this.body.treatmentDetail
    }

    if (this.body.isEngagedWithService !== 'yes') {
      delete this.body.serviceDetail
    }
  }
}
