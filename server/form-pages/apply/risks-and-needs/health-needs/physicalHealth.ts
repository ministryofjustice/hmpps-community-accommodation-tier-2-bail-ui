import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type PhysicalHealthBody = {
  hasPhyHealthNeeds: YesOrNo
  needsDetail: string
  requiresSupport: YesOrNo
  supportDetail: string
  canClimbStairs: YesOrNo
  canLiveIndependently: YesOrNo
  indyLivingDetail: string
}

@Page({
  name: 'physical-health',
  bodyProperties: [
    'hasPhyHealthNeeds',
    'needsDetail',
    'requiresSupport',
    'supportDetail',
    'canClimbStairs',
    'canLiveIndependently',
    'indyLivingDetail',
  ],
})
export default class PhysicalHealth implements TaskListPage {
  documentTitle = 'Physical and mobility needs details for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Physical and mobility needs details for ${this.personName}`

  questions = getQuestions(this.personName)['health-needs']['physical-health']

  body: PhysicalHealthBody

  constructor(
    body: Partial<PhysicalHealthBody>,
    private readonly application: Application,
  ) {
    this.body = body as PhysicalHealthBody
  }

  previous() {
    return 'substance-misuse'
  }

  next() {
    return 'mental-health'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasPhyHealthNeeds) {
      errors.hasPhyHealthNeeds = 'Select if they have any physical and mobility needs'
    }

    if (this.body.hasPhyHealthNeeds === 'yes' && !this.body.needsDetail) {
      errors.needsDetail = 'Enter details of their needs'
    }

    if (!this.body.requiresSupport) {
      errors.requiresSupport = 'Select if they need any support'
    }

    if (this.body.requiresSupport === 'yes' && !this.body.supportDetail) {
      errors.supportDetail = 'Enter the type of support needed'
    }

    if (!this.body.canClimbStairs) {
      errors.canClimbStairs = 'Select if they can climb stairs'
    }

    if (!this.body.canLiveIndependently) {
      errors.canLiveIndependently = 'Select if they can live independently'
    }

    if (this.body.canLiveIndependently === 'no' && !this.body.indyLivingDetail) {
      errors.indyLivingDetail = 'Enter why they are unable to live independently'
    }

    return errors
  }

  onSave(): void {
    if (this.body.hasPhyHealthNeeds !== 'yes') {
      delete this.body.needsDetail
    }

    if (this.body.requiresSupport !== 'yes') {
      delete this.body.supportDetail
    }

    if (this.body.canLiveIndependently !== 'no') {
      delete this.body.indyLivingDetail
    }
  }
}
