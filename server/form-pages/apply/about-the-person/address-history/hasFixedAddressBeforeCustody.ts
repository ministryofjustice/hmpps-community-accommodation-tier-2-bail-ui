import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { custodialCohorts } from '../../../../utils/applications/cohortLabels'

export type HasFixedAddressBeforeCustodyBody = {
  hasFixedAddressBeforeCustody: YesOrNo
}

@Page({
  name: 'has-fixed-address-before-custody',
  bodyProperties: ['hasFixedAddressBeforeCustody'],
})
export default class HasFixedAddressBeforeCustody implements TaskListPage {
  isCustodialCohort = custodialCohorts.includes(this.application.cohort)

  documentTitle = this.isCustodialCohort
    ? 'Did the person have a fixed address before entering custody?'
    : 'Does the person have a fixed address?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = this.isCustodialCohort
    ? `Did ${this.personName} have a fixed address before entering custody?`
    : `Does ${this.personName} have a fixed address?`

  questions = getQuestions(this.personName)['address-history']['has-fixed-address-before-custody']

  body: HasFixedAddressBeforeCustodyBody

  constructor(
    body: Partial<HasFixedAddressBeforeCustodyBody>,
    private readonly application: Application,
  ) {
    this.body = body as HasFixedAddressBeforeCustodyBody
    this.questions.hasFixedAddressBeforeCustody.question = this.title
  }

  previous() {
    return 'taskList'
  }

  next() {
    if (this.body.hasFixedAddressBeforeCustody === 'yes') {
      return 'last-fixed-address'
    }
    return 'no-fixed-address'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.hasFixedAddressBeforeCustody) {
      errors.hasFixedAddressBeforeCustody = 'Select yes if the applicant had a fixed address before entering custody'
    }
    return errors
  }

  items() {
    return convertKeyValuePairToRadioItems(
      this.questions.hasFixedAddressBeforeCustody.answers,
      this.body.hasFixedAddressBeforeCustody,
    )
  }

  response() {
    return {
      [this.questions.hasFixedAddressBeforeCustody.question]:
        this.questions.hasFixedAddressBeforeCustody.answers[this.body.hasFixedAddressBeforeCustody],
    }
  }
}
