import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type OtherHealthBody = {
  hasLongTermHealthCondition: YesOrNo
  healthConditionDetail: string
  hasHadStroke: YesOrNo
  hasSeizures: YesOrNo
  seizuresDetail: string
  beingTreatedForCancer: YesOrNo
  otherHealthNeeds: YesOrNo
  otherHealthNeedsDetail: string
}

@Page({
  name: 'other-health',
  bodyProperties: [
    'hasLongTermHealthCondition',
    'healthConditionDetail',
    'hasHadStroke',
    'hasSeizures',
    'seizuresDetail',
    'beingTreatedForCancer',
    'otherHealthNeeds',
    'otherHealthNeedsDetail',
  ],
})
export default class OtherHealth implements TaskListPage {
  documentTitle = 'Other health needs for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Other health needs for ${this.personName}`

  questions = getQuestions(this.personName)['health-needs']['other-health']

  body: OtherHealthBody

  constructor(
    body: Partial<OtherHealthBody>,
    private readonly application: Application,
  ) {
    this.body = body as OtherHealthBody
  }

  previous() {
    return 'brain-injury'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasLongTermHealthCondition) {
      errors.hasLongTermHealthCondition = 'Select if they are managing any long term health conditions'
    }
    if (this.body.hasLongTermHealthCondition === 'yes' && !this.body.healthConditionDetail) {
      errors.healthConditionDetail = 'Enter details of their condition'
    }
    if (!this.body.hasSeizures) {
      errors.hasSeizures = 'Select if they experience seizures or epilepsy'
    }
    if (this.body.hasSeizures === 'yes' && !this.body.seizuresDetail) {
      errors.seizuresDetail = 'Enter details of their last episode'
    }
    if (!this.body.hasHadStroke) {
      errors.hasHadStroke = 'Select if they have experienced a stroke'
    }
    if (!this.body.beingTreatedForCancer) {
      errors.beingTreatedForCancer = 'Select if they are receiving regular treatment for cancer'
    }
    if (!this.body.otherHealthNeeds) {
      errors.otherHealthNeeds = 'Select if they have any other health needs'
    }
    if (this.body.otherHealthNeeds === 'yes' && !this.body.otherHealthNeedsDetail) {
      errors.otherHealthNeedsDetail = 'Enter details of their other health needs'
    }

    return errors
  }

  onSave(): void {
    if (this.body.hasLongTermHealthCondition !== 'yes') {
      delete this.body.healthConditionDetail
    }

    if (this.body.hasSeizures !== 'yes') {
      delete this.body.seizuresDetail
    }

    if (this.body.otherHealthNeeds !== 'yes') {
      delete this.body.otherHealthNeedsDetail
    }
  }
}
