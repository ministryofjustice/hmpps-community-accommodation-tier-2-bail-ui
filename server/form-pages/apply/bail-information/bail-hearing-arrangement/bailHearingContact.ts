import { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

export type BailHearingContactBody = {
  name: string
  legalFirmAndAddress: string
  email: string
  number: string
}

@Page({
  name: 'bail-hearing-contact',
  bodyProperties: ['name', 'legalFirmAndAddress', 'email', 'number'],
})
export default class BailHearingContact implements TaskListPage {
  documentTitle = 'Add legal advisor contact information'

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['bail-hearing-arrangement']['bail-hearing-contact']

  body: BailHearingContactBody

  constructor(
    body: Partial<BailHearingContactBody>,
    private readonly application: Application,
  ) {
    this.body = body as BailHearingContactBody
    this.title = this.questions.bailHearingContact.question
  }

  previous() {
    return 'bail-hearing-arranger'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    return errors
  }

  response(): Record<string, string> {
    const response: Record<string, string> = {}

    const answerData: BailHearingContactBody = this.application.data['bail-hearing-arrangement']['bail-hearing-contact']

    let contactInformation = ''

    if (answerData.name) {
      contactInformation += `Name: ${answerData.name}\r\n`
    }

    if (answerData.legalFirmAndAddress) {
      contactInformation += `Legal firm address: ${answerData.legalFirmAndAddress}\r\n`
    }

    if (answerData.email) {
      contactInformation += `Email: ${answerData.email}\r\n`
    }

    if (answerData.number) {
      contactInformation += `Phone number: ${answerData.number}\r\n`
    }

    response['Legal advisor contact information'] = contactInformation

    return response
  }
}
