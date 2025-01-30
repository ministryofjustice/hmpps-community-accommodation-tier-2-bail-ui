import { Radio, TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'

export type MandatorySupportSessionsBody = {
  mandatorySupportSessions: YesOrNo
  mandatorySupportSessionsDetail: string
}

@Page({
  name: 'mandatory-support-sessions',
  bodyProperties: ['mandatorySupportSessions', 'mandatorySupportSessionsDetail'],
})
export default class MandatorySupportSessions implements TaskListPage {
  documentTitle = 'Does the court require more than one mandatory support session per week for the applicant?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['bail-conditions-and-support-sessions']['mandatory-support-sessions']

  body: MandatorySupportSessionsBody

  constructor(
    body: Partial<MandatorySupportSessionsBody>,
    private readonly application: Application,
  ) {
    this.body = body as MandatorySupportSessionsBody
    this.title = this.questions.mandatorySupportSessions.question
  }

  previous() {
    return 'non-standard-bail-conditions'
  }

  next() {
    return ''
  }

  items(detailConditionalHtml: string) {
    const items = convertKeyValuePairToRadioItems(
      this.questions.mandatorySupportSessions.answers,
      this.body.mandatorySupportSessions,
    ) as Array<Radio>

    items.forEach(item => {
      if (item.value === 'yes') {
        item.conditional = { html: detailConditionalHtml }
      }
    })

    return items
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    return errors
  }

  onSave(): void {
    if (this.body.mandatorySupportSessions !== 'yes') {
      delete this.body.mandatorySupportSessionsDetail
    }
  }
}
