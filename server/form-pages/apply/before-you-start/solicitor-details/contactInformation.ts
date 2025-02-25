import { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

export type ContactInformationBody = {
  name: string
  legalFirmAndAddress: string
  email: string
  number: string
}

@Page({
  name: 'contact-information',
  bodyProperties: ['name', 'legalFirmAndAddress', 'email', 'number'],
})
export default class ContactInformation implements TaskListPage {
  documentTitle = "Add solicitor's contact information"

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['solicitor-details']['contact-information']

  body: ContactInformationBody

  constructor(
    body: Partial<ContactInformationBody>,
    private readonly application: Application,
  ) {
    this.body = body as ContactInformationBody
    this.title = this.questions.contactInformation.question
  }

  previous() {
    return 'has-solicitor'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.name) {
      errors.name = "Enter the solicitor's full name"
    }

    if (!this.body.legalFirmAndAddress) {
      errors.legalFirmAndAddress = "Enter the solicitor's legal firm and address"
    }

    if (!this.body.email) {
      errors.email = "Enter the solicitor's email address"
    }

    if (!this.body.number) {
      errors.number = "Enter the solicitor's contact number"
    }

    return errors
  }

  response(): Record<string, string> {
    const response: Record<string, string> = {}

    const answerData: ContactInformationBody = this.application.data['solicitor-details']['contact-information']

    response['Solicitor contact information'] =
      `Name: ${answerData.name}\r\nLegal firm address: ${answerData.legalFirmAndAddress}\r\nEmail: ${answerData.email}\r\nPhone number: ${answerData.number}\r\n`

    return response
  }
}
