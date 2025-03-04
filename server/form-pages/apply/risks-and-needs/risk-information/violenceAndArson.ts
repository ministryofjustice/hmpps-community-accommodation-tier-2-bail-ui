import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type ViolenceAndArsonBody = {}

@Page({
  name: 'violence-and-arson',
  bodyProperties: [],
})
export default class ViolenceAndArson implements TaskListPage {
  documentTitle = 'Violence and arson'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Violence and arson'

  questions = getQuestions(this.personName)['risk-information']['violence-and-arson']

  body: ViolenceAndArsonBody

  constructor(
    body: Partial<ViolenceAndArsonBody>,
    private readonly application: Application,
  ) {
    this.body = body as ViolenceAndArsonBody
  }

  previous() {
    return 'acct'
  }

  next() {
    return 'living-in-the-community'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
