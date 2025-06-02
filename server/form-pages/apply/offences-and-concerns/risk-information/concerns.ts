import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

@Page({
  name: 'concerns',
  bodyProperties: [],
})
export default class Concerns implements TaskListPage {
  documentTitle = 'Add information about concerns to the applicant and others'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Add information about concerns to ${this.personName} and others`

  questions = getQuestions(this.personName)['risk-information'].concerns

  body: Record<string, unknown>

  constructor(
    body: Partial<Record<string, unknown>>,
    private readonly application: Application,
  ) {
    this.body = body as Record<string, unknown>
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'self-harm'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
