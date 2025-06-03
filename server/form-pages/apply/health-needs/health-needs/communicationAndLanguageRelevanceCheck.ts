import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type CommunicationAndLanguageRelevanceCheckBody = {
  hasCommunicationAndLanguageNeeds: YesOrNo
}

@Page({
  name: 'communication-and-language-relevance-check',
  bodyProperties: ['hasCommunicationAndLanguageNeeds'],
})
export default class CommunicationAndLanguageRelevanceCheck implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  documentTitle = `Does the applicant have any communication and language needs?`

  title = `Does ${this.personName} have any communication and language needs?`

  questions = getQuestions(this.personName)['health-needs']['communication-and-language-relevance-check']

  body: CommunicationAndLanguageRelevanceCheckBody

  constructor(
    body: Partial<CommunicationAndLanguageRelevanceCheckBody>,
    private readonly application: Application,
  ) {
    this.body = body as CommunicationAndLanguageRelevanceCheckBody
  }

  previous() {
    return 'mental-health'
  }

  next() {
    if (this.body.hasCommunicationAndLanguageNeeds === 'yes') {
      return 'communication-and-language'
    }

    return 'learning-difficulties'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasCommunicationAndLanguageNeeds) {
      errors.hasCommunicationAndLanguageNeeds = 'Select yes if they have any communication and language needs'
    }

    return errors
  }
}
