import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { custodialCohorts } from '../../../../utils/applications/cohortLabels'

export type HasFixedAddressBody = {
  hasFixedAddress: YesOrNo
}

@Page({
  name: 'has-fixed-address',
  bodyProperties: ['hasFixedAddress'],
})
export default class HasFixedAddress implements TaskListPage {
  isCustodialCohort = custodialCohorts.includes(this.application.cohort)

  documentTitle = this.isCustodialCohort
    ? 'Did the person have a fixed address before entering custody?'
    : 'Does the person have a fixed address?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = this.isCustodialCohort
    ? `Did ${this.personName} have a fixed address before entering custody?`
    : `Does ${this.personName} have a fixed address?`

  questions = getQuestions(this.personName)['address-history']['has-fixed-address']

  body: HasFixedAddressBody

  constructor(
    body: Partial<HasFixedAddressBody>,
    private readonly application: Application,
  ) {
    this.body = body as HasFixedAddressBody
    this.questions.hasFixedAddress.question = this.title
  }

  previous() {
    return 'taskList'
  }

  next() {
    if (this.body.hasFixedAddress === 'yes') {
      return 'last-fixed-address'
    }
    return 'no-fixed-address'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.hasFixedAddress) {
      errors.hasFixedAddress = this.isCustodialCohort
        ? 'Select yes if the applicant had a fixed address before entering custody'
        : 'Select yes if the applicant has a fixed address'
    }
    return errors
  }

  items() {
    return convertKeyValuePairToRadioItems(this.questions.hasFixedAddress.answers, this.body.hasFixedAddress)
  }

  response() {
    return {
      [this.questions.hasFixedAddress.question]: this.questions.hasFixedAddress.answers[this.body.hasFixedAddress],
    }
  }
}
