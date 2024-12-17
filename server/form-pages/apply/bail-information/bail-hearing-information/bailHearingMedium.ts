import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'

const applicationQuestions = getQuestions('')

export const hearingMediumOptions =
  applicationQuestions['bail-hearing-information']['bail-hearing-medium'].bailHearingMedium.answers

type BailHearingMediumBody = {
  bailHearingMedium: keyof typeof hearingMediumOptions
}

@Page({
  name: 'bail-hearing-medium',
  bodyProperties: ['bailHearingMedium'],
})
export default class BailHearingMedium implements TaskListPage {
  documentTitle = "How will the person's bail hearing be heard?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['bail-hearing-information']['bail-hearing-medium']

  body: BailHearingMediumBody

  constructor(
    body: Partial<BailHearingMediumBody>,
    private readonly application: Application,
  ) {
    this.body = body as BailHearingMediumBody
    this.title = this.questions.bailHearingMedium.question
  }

  previous() {
    return 'bail-hearing-date'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }

  items() {
    const items = convertKeyValuePairToRadioItems(hearingMediumOptions, this.body.bailHearingMedium)

    return items
  }
}
