import { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'

type ConsentRefusedBody = Record<string, unknown>

@Page({
  name: 'consent-refused',
  bodyProperties: [],
})
export default class ConsentRefused implements TaskListPage {
  documentTitle = 'The applicant has not given their consent'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `${this.personName} has not given their consent`

  body: ConsentRefusedBody

  constructor(
    body: Partial<ConsentRefusedBody>,
    private readonly application: Application,
  ) {
    this.body = body as ConsentRefusedBody
  }

  previous() {
    return 'confirm-consent'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
