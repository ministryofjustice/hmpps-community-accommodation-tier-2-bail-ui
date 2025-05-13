/* eslint-disable no-param-reassign */
import type { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { convertKeyValuePairToCheckboxItems } from '../../../../utils/formUtils'
import { getQuestions } from '../../../utils/questions'

const arrangementOptions = getQuestions('')['risk-information']['risk-management-arrangements'].arrangements.answers
export type RiskManagementArrangementsOptions = keyof typeof arrangementOptions

export type RiskManagementArrangementsBody = {
  arrangements: Array<RiskManagementArrangementsOptions>
  mappaDetails?: string
  maracDetails?: string
  iomDetails?: string
}

@Page({
  name: 'risk-management-arrangements',
  bodyProperties: ['arrangements', 'mappaDetails', 'maracDetails', 'iomDetails'],
})
export default class RiskManagementArrangements implements TaskListPage {
  documentTitle = 'Risk management arrangements'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Risk management arrangements'

  body: RiskManagementArrangementsBody

  questions = getQuestions(this.personName)['risk-information']['risk-management-arrangements']

  constructor(
    body: Partial<RiskManagementArrangementsBody>,
    private readonly application: Application,
  ) {
    this.body = body as RiskManagementArrangementsBody
  }

  previous() {
    return 'additional-concerns'
  }

  next() {
    return 'information-sources'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.arrangements) {
      errors.arrangements = 'Select if there are any multi-agency risk management arrangements'
    } else {
      if (this.body.arrangements.includes('mappa') && !this.body.mappaDetails) {
        errors.mappaDetails = 'Enter MAPPA details'
      }
      if (this.body.arrangements.includes('marac') && !this.body.maracDetails) {
        errors.maracDetails = 'Enter MARAC details'
      }
      if (this.body.arrangements.includes('iom') && !this.body.iomDetails) {
        errors.iomDetails = 'Enter IOM details'
      }
    }

    return errors
  }

  items(mappaDetailsHtml: string, maracDetailsHtml: string, iomDetailsHtml: string) {
    const items = convertKeyValuePairToCheckboxItems(arrangementOptions, this.body.arrangements) as [Radio]

    items.forEach(item => {
      if (item.value === 'mappa') {
        item.attributes = { 'data-selector': 'arrangements' }
        item.conditional = { html: mappaDetailsHtml }
      } else if (item.value === 'marac') {
        item.attributes = { 'data-selector': 'arrangements' }
        item.conditional = { html: maracDetailsHtml }
      } else if (item.value === 'iom') {
        item.attributes = { 'data-selector': 'arrangements' }
        item.conditional = { html: iomDetailsHtml }
      }
    })
    const noCheckbox = items.pop()

    return [...items, { divider: 'or' }, { ...noCheckbox }]
  }

  onSave(): void {
    if (!this.body.arrangements.includes('mappa')) {
      delete this.body.mappaDetails
    }

    if (!this.body.arrangements.includes('iom')) {
      delete this.body.iomDetails
    }

    if (!this.body.arrangements.includes('marac')) {
      delete this.body.maracDetails
    }
  }
}
