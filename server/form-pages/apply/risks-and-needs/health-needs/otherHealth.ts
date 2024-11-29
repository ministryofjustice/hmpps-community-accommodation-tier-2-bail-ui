import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
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
      errors.hasLongTermHealthCondition = `Confirm whether they have a long term health condition`
    }
    if (this.body.hasLongTermHealthCondition === 'yes' && !this.body.healthConditionDetail) {
      errors.healthConditionDetail = 'Provide details of their health conditions'
    }
    if (this.body.hasLongTermHealthCondition === 'yes' && !this.body.hasHadStroke) {
      errors.hasHadStroke = 'Confirm whether they have had a stroke'
    }

    if (!this.body.hasSeizures) {
      errors.hasSeizures = `Confirm whether they have seizures`
    }
    if (this.body.hasSeizures === 'yes' && !this.body.seizuresDetail) {
      errors.seizuresDetail = 'Provide details of the seizure type and treatment'
    }

    if (!this.body.beingTreatedForCancer) {
      errors.beingTreatedForCancer = `Confirm whether they are receiving cancer treatment`
    }

    return errors
  }

  onSave(): void {
    if (this.body.hasLongTermHealthCondition !== 'yes') {
      delete this.body.healthConditionDetail
      delete this.body.hasHadStroke
    }

    if (this.body.hasSeizures !== 'yes') {
      delete this.body.seizuresDetail
    }
  }
}
