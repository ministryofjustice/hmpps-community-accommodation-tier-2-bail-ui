import { TaskListErrors, YesNoOrDontKnow } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

type OrdersBody = {
  hasOrders: YesNoOrDontKnow
  notes: string
}

@Page({
  name: 'orders',
  bodyProperties: ['hasOrders', 'notes'],
})
export default class LicenceConditions implements TaskListPage {
  documentTitle = `Add non-standard licence conditions`

  personName = nameOrPlaceholderCopy(this.application.person)

  title: string

  questions = getQuestions(this.personName)['orders-and-licence-conditions'].orders

  body: OrdersBody

  constructor(
    body: Partial<OrdersBody>,
    private readonly application: Application,
  ) {
    this.body = body as OrdersBody
    this.title = this.questions.hasOrders.question
  }

  previous() {
    return 'licence-conditions'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.hasOrders) errors.hasOrders = 'Select yes if they are subject to any civil or criminal orders'
    else if (this.body.hasOrders === 'yes' && !this.body.notes)
      errors.notes = 'Provide details of the civil or criminal orders'

    return errors
  }

  onSave(): void {
    if (this.body.hasOrders !== 'yes') {
      delete this.body.notes
    }
  }
}
