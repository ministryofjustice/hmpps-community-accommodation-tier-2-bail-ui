import { Radio, TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'

export type ConsultSolicitorBody = {
  consultSolicitor: YesOrNo
}

@Page({
  name: 'consult-solicitor',
  bodyProperties: ['consultSolicitor'],
})
export default class ConsultSolicitor implements TaskListPage {
  documentTitle = "Have you spoken to the person's solicitor about this application?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['solicitor-details']['consult-solicitor']

  body: ConsultSolicitorBody

  constructor(
    body: Partial<ConsultSolicitorBody>,
    private readonly application: Application,
  ) {
    this.body = body as ConsultSolicitorBody
    this.title = this.questions.consultSolicitor.question
  }

  previous() {
    return 'contact-information'
  }

  next() {
    return ''
  }

  items() {
    return convertKeyValuePairToRadioItems(
      this.questions.consultSolicitor.answers,
      this.body.consultSolicitor,
    ) as Array<Radio>
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    return errors
  }
}
