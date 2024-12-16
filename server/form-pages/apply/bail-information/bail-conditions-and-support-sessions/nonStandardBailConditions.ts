import { Radio, TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'

export type NonStandardBailConditionsBody = {
  nonStandardBailConditions: YesOrNo
  nonStandardBailConditionsDetail: string
}

@Page({
  name: 'non-standard-bail-conditions',
  bodyProperties: ['nonStandardBailConditions', 'nonStandardBailConditionsDetail'],
})
export default class NonStandardBailConditions implements TaskListPage {
  documentTitle = 'Are there any non-standard bail conditions being considered for this applicant?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['bail-conditions-and-support-sessions']['non-standard-bail-conditions']

  body: NonStandardBailConditionsBody

  constructor(
    body: Partial<NonStandardBailConditionsBody>,
    private readonly application: Application,
  ) {
    this.body = body as NonStandardBailConditionsBody
    this.title = this.questions.nonStandardBailConditions.question
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'mandatory-support-sessions'
  }

  items(detailConditionalHtml: string) {
    const items = convertKeyValuePairToRadioItems(
      this.questions.nonStandardBailConditions.answers,
      this.body.nonStandardBailConditions,
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
    if (this.body.nonStandardBailConditions !== 'yes') {
      delete this.body.nonStandardBailConditionsDetail
    }
  }
}
