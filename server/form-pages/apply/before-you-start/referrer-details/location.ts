import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

type LocationBody = {
  location: string
}

@Page({
  name: 'location',
  bodyProperties: ['location'],
})
export default class Location implements TaskListPage {
  documentTitle: string

  personName = nameOrPlaceholderCopy(this.application.person)

  title: string

  questions

  body: LocationBody

  constructor(
    body: Partial<LocationBody>,
    private readonly application: Application,
  ) {
    this.body = body as LocationBody

    const applicationQuestions = getQuestions(this.personName)
    this.questions = applicationQuestions['referrer-details'].location
    this.documentTitle = this.questions.location.question
    this.title = this.questions.location.question
  }

  previous() {
    return 'contact-number'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.location) {
      errors.location = 'Enter where you are based'
    }

    return errors
  }
}
