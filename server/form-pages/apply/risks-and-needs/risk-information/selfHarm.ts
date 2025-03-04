import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type SelfHarmBody = {}

@Page({
  name: 'self-harm',
  bodyProperties: [],
})
export default class SelfHarm implements TaskListPage {
  documentTitle = 'Self harm'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Self harm'

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
    return 'acct'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
