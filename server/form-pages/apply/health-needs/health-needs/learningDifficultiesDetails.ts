import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type LearningDifficultiesDetailsBody = {
  learningNeedsDetail: string
  needsSupport: YesOrNo
  supportDetail: string
  receivesTreatment: YesOrNo
  treatmentDetail: string
  isVulnerable: YesOrNo
  vulnerabilityDetail: string
}

@Page({
  name: 'learning-difficulties-details',
  bodyProperties: [
    'learningNeedsDetail',
    'needsSupport',
    'supportDetail',
    'receivesTreatment',
    'treatmentDetail',
    'isVulnerable',
    'vulnerabilityDetail',
  ],
})
export default class LearningDifficultiesDetails implements TaskListPage {
  documentTitle = 'Add learning difficulties and neurodiversity needs details for the applicant'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Add learning difficulties and neurodiversity needs details for ${this.personName}`

  questions = getQuestions(this.personName)['health-needs']['learning-difficulties-details']

  body: LearningDifficultiesDetailsBody

  constructor(
    body: Partial<LearningDifficultiesDetailsBody>,
    private readonly application: Application,
  ) {
    this.body = body as LearningDifficultiesDetailsBody
  }

  previous() {
    return 'learning-difficulties'
  }

  next() {
    return 'brain-injury'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.learningNeedsDetail) {
      errors.learningNeedsDetail = 'Enter details of their needs'
    }

    if (!this.body.needsSupport) {
      errors.needsSupport = 'Select yes if they need any support'
    }
    if (this.body.needsSupport === 'yes' && !this.body.supportDetail) {
      errors.supportDetail = 'Enter the type of support needed'
    }

    if (!this.body.receivesTreatment) {
      errors.receivesTreatment = 'Select yes if they receive any treatment'
    }
    if (this.body.receivesTreatment === 'yes' && !this.body.treatmentDetail) {
      errors.treatmentDetail = 'Enter details about their treatment'
    }

    if (!this.body.isVulnerable) {
      errors.isVulnerable = 'Select yes if they are vulnerable'
    }
    if (this.body.isVulnerable === 'yes' && !this.body.vulnerabilityDetail) {
      errors.vulnerabilityDetail = 'Enter how they are vulnerable'
    }

    return errors
  }

  response() {
    return {}
  }

  onSave(): void {
    if (this.body.needsSupport !== 'yes') {
      delete this.body.supportDetail
    }

    if (this.body.receivesTreatment !== 'yes') {
      delete this.body.treatmentDetail
    }

    if (this.body.isVulnerable !== 'yes') {
      delete this.body.vulnerabilityDetail
    }
  }
}
