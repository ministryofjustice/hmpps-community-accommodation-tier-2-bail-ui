import type { TaskListErrors, YesOrNo, YesNoOrDontKnow } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

type SelfHarmBody = {
  pastHarm: YesOrNo
  pastHarmDetail: string
  currentConcerns: YesOrNo
  currentConcernsDetail: string
  specificTriggers: YesNoOrDontKnow
  specificTriggersDetail: string
  specificTriggersNotKnownDetail: string
  currentlyPresenting: string
}

@Page({
  name: 'self-harm',
  bodyProperties: [
    'pastHarm',
    'pastHarmDetail',
    'currentConcerns',
    'currentConcernsDetail',
    'specificTriggers',
    'specificTriggersDetail',
    'specificTriggersNotKnownDetail',
    'currentlyPresenting',
  ],
})
export default class SelfHarm implements TaskListPage {
  documentTitle = 'Concerns of self-harm and suicide'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Concerns of self-harm and suicide for ${this.personName}`

  questions = getQuestions(this.personName)['risk-information']['self-harm']

  body: SelfHarmBody

  constructor(
    body: Partial<SelfHarmBody>,
    private readonly application: Application,
  ) {
    this.body = body as SelfHarmBody
  }

  previous() {
    return 'concerns'
  }

  next() {
    return 'does-the-applicant-have-acct-notes'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.pastHarm) {
      errors.pastHarm = 'Select if they have self-harmed or attempted suicide in the past'
    }

    if (this.body.pastHarm === 'yes' && !this.body.pastHarmDetail) {
      errors.pastHarmDetail = 'Enter details of the incident'
    }

    if (!this.body.currentConcerns) {
      errors.currentConcerns = 'Select if there are current concerns of self-harm or suicide'
    }

    if (this.body.currentConcerns === 'yes' && !this.body.currentConcernsDetail) {
      errors.currentConcernsDetail = 'Enter details of current concerns'
    }

    if (!this.body.specificTriggers) {
      errors.specificTriggers = 'Select if they have any triggers, or if it is not known'
    }

    if (this.body.specificTriggers === 'yes' && !this.body.specificTriggersDetail) {
      errors.specificTriggersDetail = 'Enter details about situations, topics and triggers'
    }

    if (this.body.specificTriggers === 'dontKnow' && !this.body.specificTriggersNotKnownDetail) {
      errors.specificTriggersNotKnownDetail = 'Enter the reason why it is not known'
    }

    return errors
  }

  onSave(): void {
    if (this.body.pastHarm !== 'yes') {
      delete this.body.pastHarmDetail
    }

    if (this.body.currentConcerns !== 'yes') {
      delete this.body.currentConcernsDetail
    }

    if (this.body.specificTriggers !== 'yes' && this.body.specificTriggersDetail) {
      delete this.body.specificTriggersDetail
    }

    if (this.body.specificTriggers !== 'dontKnow' && this.body.specificTriggersNotKnownDetail) {
      delete this.body.specificTriggersNotKnownDetail
    }
  }
}
