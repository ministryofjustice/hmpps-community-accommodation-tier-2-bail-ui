import type { SelectItem, TaskListErrors, YesNoOrDontKnow, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application } from '@approved-premises/api'
import { Page } from '../../../../utils/decorators'
import TaskListPage from '../../../../taskListPage'
import { getQuestions } from '../../../../utils/questions'
import { nameOrPlaceholderCopy } from '../../../../../utils/utils'

export type OffenceHistoryDataBody = {
  convictionType: string
  numberOfConvictions: string
  currentlyServing: YesOrNo
  safeguarding: YesNoOrDontKnow
  safeguardingDetail: string
}

@Page({
  name: 'offence-history-data',
  bodyProperties: ['convictionType', 'numberOfConvictions', 'currentlyServing', 'safeguarding', 'safeguardingDetail'],
})
export default class OffenceHistoryData implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  documentTitle = 'Add previous unspent convictions for the applicant'

  title = `Add previous unspent convictions for ${this.personName}`

  body: OffenceHistoryDataBody

  taskName = 'previous-unspent-convictions'

  pageName = 'offence-history-data'

  questions = getQuestions('')['previous-unspent-convictions']['offence-history-data']

  convictionTypes: Array<SelectItem>

  hasPreviouslySavedAnUnspentConviction: boolean

  constructor(
    body: Partial<OffenceHistoryDataBody>,
    private readonly application: Cas2v2Application,
  ) {
    this.body = body as OffenceHistoryDataBody
    this.convictionTypes = this.getConvictionTypeAsItemsForSelect(this.body.convictionType)
    this.hasPreviouslySavedAnUnspentConviction = Boolean(
      application.data['previous-unspent-convictions']?.['offence-history-data'],
    )
  }

  private getConvictionTypeAsItemsForSelect(selectedItem: string) {
    const items = [
      {
        value: 'choose',
        text: 'Select conviction type',
        selected: selectedItem === '',
      },
    ]
    Object.keys(this.questions.convictionType.answers).forEach(value => {
      items.push({
        value,
        text: this.questions.convictionType.answers[
          value as keyof typeof this.questions.convictionType.answers
        ] as string,
        selected: selectedItem === value,
      })
    })

    return items
  }

  previous() {
    return 'unspent-convictions'
  }

  next() {
    return 'unspent-convictions'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (this.body.convictionType === 'choose') {
      errors.convictionType = 'Select the type of conviction'
    }
    if (!this.body.numberOfConvictions) {
      errors.numberOfConvictions = 'Enter the number of convictions of this type'
    }
    if (!this.body.currentlyServing) {
      errors.currentlyServing = 'Select if they are serving a sentence for any of these convictions'
    }
    if (!this.body.safeguarding) {
      errors.safeguarding = 'Select if there are any safeguarding details to add, or if it is not known'
    }
    if (this.body.safeguarding === 'yes' && !this.body.safeguardingDetail) {
      errors.safeguardingDetail = 'Enter details of the safeguarding measures'
    }

    return errors
  }

  response() {
    return {}
  }
}
