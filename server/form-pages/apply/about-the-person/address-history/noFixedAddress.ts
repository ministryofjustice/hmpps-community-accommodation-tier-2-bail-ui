import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

export type NoFixedAddressBody = {
  howLong: string
  lastKnownAddressLine1?: string
  lastKnownAddressLine2?: string
  lastKnownTownOrCity?: string
  lastKnownCounty?: string
  lastKnownPostcode?: string
}

@Page({
  name: 'no-fixed-address',
  bodyProperties: [
    'howLong',
    'lastKnownAddressLine1',
    'lastKnownAddressLine2',
    'lastKnownTownOrCity',
    'lastKnownCounty',
    'lastKnownPostcode',
  ],
})
export default class NoFixedAddress implements TaskListPage {
  documentTitle = 'How long has the person had no fixed address for?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `How long has ${this.personName} had no fixed address for?`

  questions = getQuestions(this.personName)['address-history']['no-fixed-address']

  body: NoFixedAddressBody

  constructor(
    body: Partial<NoFixedAddressBody>,
    private readonly application: Application,
  ) {
    this.body = body as NoFixedAddressBody
  }

  previous() {
    return 'has-fixed-address-before-custody'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.howLong) {
      errors.howLong = 'Enter how long they have had no fixed address'
    }
    return errors
  }
}
