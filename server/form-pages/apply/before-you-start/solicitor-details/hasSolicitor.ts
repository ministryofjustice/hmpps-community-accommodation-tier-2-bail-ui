import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

type HasSolicitorBody = {
  hasSolicitor: YesOrNo
}
@Page({
  name: 'has-solicitor',
  bodyProperties: ['hasSolicitor'],
})
export default class HasSolicitor implements TaskListPage {
  documentTitle = 'Does the person have a solicitor?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Does ${this.personName} have a solicitor?`

  questions: Record<string, string>

  options: Record<string, string>

  body: HasSolicitorBody

  constructor(
    body: Partial<HasSolicitorBody>,
    private readonly application: Application,
  ) {
    this.body = body as HasSolicitorBody

    const applicationQuestions = getQuestions(this.personName)
    this.questions = {
      hasSolicitor: applicationQuestions['solicitor-details']['has-solicitor'].hasSolicitor.question,
    }
    this.options = applicationQuestions['solicitor-details']['has-solicitor'].hasSolicitor.answers
  }

  previous() {
    return 'taskList'
  }

  next() {
    if (this.body.hasSolicitor === 'no') {
      return ''
    }
    return 'contact-information'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.hasSolicitor) {
      errors.hasSolicitor = 'Choose either Yes or No'
    }
    return errors
  }

  items() {
    return convertKeyValuePairToRadioItems(this.options, this.body.hasSolicitor)
  }
}
