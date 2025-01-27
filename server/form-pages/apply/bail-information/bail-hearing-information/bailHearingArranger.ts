import { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'

const applicationQuestions = getQuestions('')

export const arrangerOptions =
  applicationQuestions['bail-hearing-information']['bail-hearing-arranger'].bailHearingArranger.answers

type BailHearingArrangerBody = {
  bailHearingArranger: keyof typeof arrangerOptions
}

@Page({
  name: 'bail-hearing-arranger',
  bodyProperties: ['bailHearingArranger'],
})
export default class BailHearingArranger implements TaskListPage {
  documentTitle = 'Who will arrange the bail hearing?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['bail-hearing-information']['bail-hearing-arranger']

  body: BailHearingArrangerBody

  constructor(
    body: Partial<BailHearingArrangerBody>,
    private readonly application: Application,
  ) {
    this.body = body as BailHearingArrangerBody
    this.title = this.questions.bailHearingArranger.question
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'bail-hearing-date'
  }

  items() {
    return convertKeyValuePairToRadioItems(arrangerOptions, this.body.bailHearingArranger) as Array<Radio>
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    return errors
  }
}
