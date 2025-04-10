/* eslint-disable no-param-reassign */
import type { Radio, TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

const applicationQuestions = getQuestions('')

const latestLivingSituationOptions =
  applicationQuestions['address-history']['previous-address'].latestLivingSituation.answers

export type PreviousAddressBody = {
  hasPreviousAddress: YesOrNo
  previousAddress: string
  howLong: string
  lastKnownAddress: string
  latestLivingSituation: keyof typeof latestLivingSituationOptions
  otherLivingSituation: string
}

@Page({
  name: 'previous-address',
  bodyProperties: [
    'hasPreviousAddress',
    'previousAddress',
    'howLong',
    'lastKnownAddress',
    'latestLivingSituation',
    'otherLivingSituation',
  ],
})
export default class PreviousAddress implements TaskListPage {
  documentTitle = 'Did the person have a fixed address before being arrested?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Did ${this.personName} have a fixed address before being arrested?`

  questions = getQuestions(this.personName)['address-history']['previous-address']

  body: PreviousAddressBody

  constructor(
    body: Partial<PreviousAddressBody>,
    private readonly application: Application,
  ) {}

  previous() {
    return 'taskList'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.hasPreviousAddress) {
      errors.hasPreviousAddress = 'Select yes if the applicant had a fixed address before being held'
    }

    if (this.body.hasPreviousAddress === 'yes' && !this.body.previousAddress) {
      errors.previousAddress = 'Enter their last fixed address'
    }

    if (this.body.hasPreviousAddress === 'no' && !this.body.howLong) {
      errors.howLong = 'Enter how long they have had no fixed address for'
    }

    if (!this.body.latestLivingSituation) {
      errors.latestLivingSituation = 'Select their living situation'
    }

    if (this.body.latestLivingSituation === 'other' && !this.body.otherLivingSituation) {
      errors.otherLivingSituation = 'Enter details of other living situation'
    }

    return errors
  }

  latestLivingSituationItems(otherLivingSituation: string) {
    const items = convertKeyValuePairToRadioItems(latestLivingSituationOptions, this.body.latestLivingSituation) as [
      Radio,
    ]

    items.forEach(item => {
      if (item.value === 'other') {
        item.conditional = {
          html: otherLivingSituation,
        }
      }
    })

    const other = items.pop()

    return [...items, { divider: 'or' }, { ...other }]
  }

  addressItems(previousAddress: string, lastKnownAddress: string) {
    const items = convertKeyValuePairToRadioItems(
      this.questions.hasPreviousAddress.answers,
      this.body.hasPreviousAddress,
    ) as [Radio]

    items.forEach(item => {
      if (item.value === 'yes') {
        item.conditional = {
          html: previousAddress,
        }
      }
      if (item.value === 'no') {
        item.conditional = {
          html: lastKnownAddress,
        }
      }
    })

    return items
  }

  onSave(): void {
    if (this.body.hasPreviousAddress !== 'no') {
      delete this.body.lastKnownAddress
      delete this.body.howLong
    }

    if (this.body.hasPreviousAddress !== 'yes') {
      delete this.body.previousAddress
    }

    if (this.body.latestLivingSituation !== 'other') {
      delete this.body.otherLivingSituation
    }
  }
}
