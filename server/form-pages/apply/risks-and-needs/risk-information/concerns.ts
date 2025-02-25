import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type ConcernsBody = {}

@Page({
  name: 'concerns',
  bodyProperties: [],
})
export default class Concerns implements TaskListPage {
  documentTitle = 'Concerns'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Concerns'

  questions = getQuestions(this.personName)['risk-information'].concerns

  body: ConcernsBody

  constructor(
    body: Partial<ConcernsBody>,
    private readonly application: Application,
  ) {
    this.body = body as ConcernsBody
  }

  previous() {
    return ''
  }

  next() {
    return 'self-harm'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
