import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'

@Page({
  name: 'health-needs-information',
  bodyProperties: [],
})
export default class Guidance implements TaskListPage {
  documentTitle = "Provide information about the applicant's health needs"

  title = `Provide information about ${nameOrPlaceholderCopy(this.application.person)}'s health needs`

  body: Record<string, unknown>

  constructor(
    body: Partial<Record<string, unknown>>,
    private readonly application: Application,
  ) {
    this.body = body as Record<string, unknown>
  }

  previous() {
    return 'liaison-and-diversion'
  }

  next() {
    return 'substance-misuse'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
