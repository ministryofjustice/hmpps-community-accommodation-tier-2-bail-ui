import type { DataServices, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application, Cas2v2UserDto } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions, Question } from '../../../utils/questions'
import { summaryListItem } from '../../../../utils/formUtils'

type ConfirmReferrerDetailsBody = {
  name: string
  email: string
  region: string
}

@Page({
  name: 'confirm-details',
  bodyProperties: ['name', 'email', 'region'],
})
export default class ConfirmReferrerDetails implements TaskListPage {
  documentTitle = 'Confirm your details'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Confirm your details`

  questions: Record<string, Question>

  body: ConfirmReferrerDetailsBody

  referrerDetails: ConfirmReferrerDetailsBody

  constructor(
    body: Partial<ConfirmReferrerDetailsBody>,
    private readonly application: Application,
    private readonly userDetails: Cas2v2UserDto,
  ) {
    this.referrerDetails = {
      name: application.createdBy.name,
      email: application.createdBy.email,
      region: userDetails?.deliusUserInfo?.probationArea?.description,
    }

    const applicationQuestions = getQuestions(this.personName)
    this.questions = applicationQuestions['referrer-details']['confirm-details']
  }

  static async initialize(
    body: Partial<ConfirmReferrerDetailsBody>,
    application: Application,
    request: { user: { token: string; username: string } },
    dataServices: DataServices,
  ) {
    const userDetails = await dataServices.userService.getUserDetails(request.user.token, request.user.username)

    return new ConfirmReferrerDetails(body, application, userDetails)
  }

  previous() {
    return 'taskList'
  }

  next() {
    return this.application.applicationOrigin === 'other' ? 'cpp-check' : 'job-title'
  }

  summaryRows() {
    return Object.entries(this.questions)
      .map(([key, { question }]) => {
        const value = this.referrerDetails[key as keyof ConfirmReferrerDetailsBody]
        return value && summaryListItem(question, value)
      })
      .filter(Boolean)
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
