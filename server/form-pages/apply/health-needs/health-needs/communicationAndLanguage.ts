import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type CommunicationAndLanguageBody = {
  hasImpairments: YesOrNo
  impairmentsDetail: string
  requiresInterpreter: YesOrNo
  interpretationDetail: string
}

@Page({
  name: 'communication-and-language',
  bodyProperties: ['hasImpairments', 'impairmentsDetail', 'requiresInterpreter', 'interpretationDetail'],
})
export default class CommunicationAndLanguage implements TaskListPage {
  documentTitle = 'Communication and language needs details for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Communication and language needs details for ${this.personName}`

  questions = getQuestions(this.personName)['health-needs']['communication-and-language']

  body: CommunicationAndLanguageBody

  constructor(
    body: Partial<CommunicationAndLanguageBody>,
    private readonly application: Application,
  ) {
    this.body = body as CommunicationAndLanguageBody
  }

  previous() {
    return 'mental-health'
  }

  next() {
    return 'learning-difficulties'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasImpairments) {
      errors.hasImpairments = `Select if they have any literacy, visual or hearing impairments`
    }
    if (this.body.hasImpairments === 'yes' && !this.body.impairmentsDetail) {
      errors.impairmentsDetail = 'Enter details of their needs'
    }

    if (!this.body.requiresInterpreter) {
      errors.requiresInterpreter = `Select if they need an interpreter`
    }
    if (this.body.requiresInterpreter === 'yes' && !this.body.interpretationDetail) {
      errors.interpretationDetail = 'Enter the language they need an interpreter for'
    }

    return errors
  }

  onSave(): void {
    if (this.body.hasImpairments !== 'yes') {
      delete this.body.impairmentsDetail
    }

    if (this.body.requiresInterpreter !== 'yes') {
      delete this.body.interpretationDetail
    }
  }
}
