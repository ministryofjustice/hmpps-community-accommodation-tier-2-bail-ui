import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'

type IndependentLivingBody = Record<string, never>

@Page({
  name: 'independent-living',
  bodyProperties: [],
})
export default class IndependentLiving implements TaskListPage {
  documentTitle = 'Can the applicant live independently and in shared accommodation?'

  title = `Can ${nameOrPlaceholderCopy(this.application.person)} live independently and in shared accommodation?`

  body: IndependentLivingBody

  constructor(
    body: Partial<IndependentLivingBody>,
    private readonly application: Application,
  ) {
    this.body = body as IndependentLivingBody
  }

  previous() {
    return 'liaison-and-diversion'
  }

  next() {
    return 'health-needs-information'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
