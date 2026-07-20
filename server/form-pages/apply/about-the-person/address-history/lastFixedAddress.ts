import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

export type LastFixedAddressBody = {
  addressLine1: string
  addressLine2?: string
  townOrCity: string
  county?: string
  postcode: string
}

@Page({
  name: 'last-fixed-address',
  bodyProperties: ['addressLine1', 'addressLine2', 'townOrCity', 'county', 'postcode'],
})
export default class LastFixedAddress implements TaskListPage {
  documentTitle = "Enter the person's last fixed address"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Enter ${this.personName}'s last fixed address`

  questions = getQuestions(this.personName)['address-history']['last-fixed-address']

  body: LastFixedAddressBody

  constructor(
    body: Partial<LastFixedAddressBody>,
    private readonly application: Application,
  ) {
    this.body = body as LastFixedAddressBody
  }

  previous() {
    return 'has-fixed-address-before-custody'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.addressLine1) {
      errors.addressLine1 = 'Enter address line 1'
    }
    if (!this.body.townOrCity) {
      errors.townOrCity = 'Enter the town or city'
    }
    if (!this.body.postcode) {
      errors.postcode = 'Enter the postcode'
    }
    return errors
  }
}
