import { Cas2Application as Application, FullPerson } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class OrdersPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Is ${(application.person as FullPerson).name} subject to any civil or criminal orders?`,
      application,
      'orders-and-licence-conditions',
      'orders',
      'licence-conditions',
    )
  }

  checkErrors() {
    this.shouldShowErrorSummary(`Select yes if they are subject to any civil or criminal orders`)
  }

  completeForm(): void {
    this.checkRadioByNameAndValue('hasOrders', 'no')
  }
}
