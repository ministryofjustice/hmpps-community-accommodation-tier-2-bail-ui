import { Radio, TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'

export type ConsultLegalAdvisorBody = {
  consultLegalAdvisor: YesOrNo
}

@Page({
  name: 'consult-legal-advisor',
  bodyProperties: ['consultLegalAdvisor'],
})
export default class ConsultLegalAdvisor implements TaskListPage {
  documentTitle = "Have you spoken to the person's legal advisor about this application?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['bail-hearing-arrangement']['consult-legal-advisor']

  body: ConsultLegalAdvisorBody

  constructor(
    body: Partial<ConsultLegalAdvisorBody>,
    private readonly application: Application,
  ) {
    this.body = body as ConsultLegalAdvisorBody
    this.title = this.questions.consultLegalAdvisor.question
  }

  previous() {
    return 'bail-hearing-contact'
  }

  next() {
    return ''
  }

  items() {
    return convertKeyValuePairToRadioItems(
      this.questions.consultLegalAdvisor.answers,
      this.body.consultLegalAdvisor,
    ) as Array<Radio>
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    return errors
  }
}
