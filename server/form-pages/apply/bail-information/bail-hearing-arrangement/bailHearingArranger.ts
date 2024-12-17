import { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'

const arrangerOptions = {
  legalAdvisor: 'Legal Advisor (from the court)',
  applicant: "Applicant with prison referrer's help",
}

export type BailHearingArrangerOptions = keyof typeof arrangerOptions

export type BailHearingArrangerBody = {
  bailHearingArranger: BailHearingArrangerOptions
}

@Page({
  name: 'bail-hearing-arranger',
  bodyProperties: ['bailHearingArranger'],
})
export default class BailHearingArranger implements TaskListPage {
  documentTitle = 'Who will arrange the bail hearing?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['bail-hearing-arrangement']['bail-hearing-arranger']

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
    return ''
  }

  items() {
    return convertKeyValuePairToRadioItems(arrangerOptions, this.body.bailHearingArranger) as Array<Radio>
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    return errors
  }
}
