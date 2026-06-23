import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions, Question } from '../../../utils/questions'
import BasePage from '../../../utils/basePage'

type CppCheckBody = {
  isCpp: YesOrNo
}

@Page({
  name: 'cpp-check',
  bodyProperties: ['isCpp'],
})
export default class CppCheck extends BasePage {
  documentTitle = 'Is CPP'

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions

  body: CppCheckBody

  constructor(
    body: Partial<CppCheckBody>,
    private readonly application: Application,
  ) {
    super()
    this.questions = getQuestions(this.personName)['referrer-details']['cpp-check']
    this.title = (Object.values(this.questions)[0] as Question)?.question
  }

  previous() {
    return 'confirm-details'
  }

  next() {
    return this.body.isCpp === 'yes' ? 'contact-number' : 'community-probation-practitioner-details'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.isCpp) errors.isCpp = `Select if you are ${this.personName}'s community probation practitioner`
    return errors
  }
}
