import { Radio, TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'

export type CommunitySupervisionBody = {
  probationSupervision: YesOrNo
}

@Page({
  name: 'community-supervision',
  bodyProperties: ['probationSupervision'],
})
export default class CommunitySupervision implements TaskListPage {
  documentTitle = 'Is the person currently supervised by probation?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['community-supervision-and-current-offences']['community-supervision']

  body: CommunitySupervisionBody

  constructor(
    body: Partial<CommunitySupervisionBody>,
    private readonly application: Application,
  ) {
    this.body = body as CommunitySupervisionBody
    this.title = this.questions.probationSupervision.question
  }

  previous() {
    return 'taskList'
  }

  next() {
    if (this.body.probationSupervision === 'yes') {
      return 'cpp-details'
    }
    return ''
  }

  items() {
    return convertKeyValuePairToRadioItems(
      this.questions.probationSupervision.answers,
      this.body.probationSupervision,
    ) as Array<Radio>
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.probationSupervision) {
      errors.probationSupervision = 'Confirm whether the applicant is currently supervised by probation'
    }
    return errors
  }
}
