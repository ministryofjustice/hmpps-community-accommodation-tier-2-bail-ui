import type { SelectItem, TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application } from '@approved-premises/api'
import { Page } from '../../../../utils/decorators'
import TaskListPage from '../../../../taskListPage'
import { getQuestions } from '../../../../utils/questions'
import { nameOrPlaceholderCopy } from '../../../../../utils/utils'

export type UnspentConvictionsDataBody = {
  convictionType: string
  numberOfConvictions: string
  currentlyServing: YesOrNo
  convictionDetails: string
  areOtherDetails: YesOrNo
  otherDetails: string
}

@Page({
  name: 'unspent-convictions-data',
  bodyProperties: [
    'convictionType',
    'numberOfConvictions',
    'currentlyServing',
    'convictionDetails',
    'areOtherDetails',
    'otherDetails',
  ],
})
export default class UnspentConvictionsData implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  documentTitle = 'Add previous unspent convictions for the applicant'

  title = `Add previous unspent convictions for ${this.personName}`

  body: UnspentConvictionsDataBody

  taskName = 'previous-unspent-convictions'

  pageName = 'unspent-convictions-data'

  questions = getQuestions('')['previous-unspent-convictions']['unspent-convictions-data']

  convictionTypes: Array<SelectItem>

  hasPreviouslySavedAnUnspentConviction: boolean

  constructor(
    body: Partial<UnspentConvictionsDataBody>,
    private readonly application: Cas2v2Application,
  ) {
    this.body = body as UnspentConvictionsDataBody
    this.convictionTypes = this.getConvictionTypeAsItemsForSelect(this.body.convictionType)
    this.hasPreviouslySavedAnUnspentConviction = Boolean(
      application.data['previous-unspent-convictions']?.['unspent-convictions-data'],
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
    return 'any-previous-convictions'
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
      errors.currentlyServing = 'Select yes if they are serving a sentence'
    }
    if (!this.body.convictionDetails) {
      errors.convictionDetails = 'Enter what the convictions were and when they happened'
    }
    if (!this.body.areOtherDetails) {
      errors.areOtherDetails = 'Select yes if there are other details to add'
    }
    if (this.body.areOtherDetails === 'yes' && !this.body.otherDetails) {
      errors.otherDetails = 'Enter more details'
    }

    return errors
  }

  response() {
    return {}
  }
}
