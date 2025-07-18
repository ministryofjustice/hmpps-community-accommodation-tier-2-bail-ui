/* eslint-disable no-param-reassign */
import type { Request } from 'express'
import { Cas2v2Application, Cas2v2ApplicationSummary } from '@approved-premises/api'
import type { ApplicationOrigin, DataServices, GroupedApplications, PaginatedResponse } from '@approved-premises/ui'
import { getBody, getPageName, getTaskName, pageBodyShallowEquals } from '../form-pages/utils'
import type { ApplicationClient, RestClientBuilder } from '../data'
import { getApplicationSubmissionData, getApplicationUpdateData } from '../utils/applications/getApplicationData'
import TaskListPage, { TaskListPageInterface } from '../form-pages/taskListPage'
import CheckYourAnswers from '../form-pages/apply/check-your-answers/check-your-answers/checkYourAnswers'
import { ValidationError } from '../utils/errors'
import deleteOrphanedFollowOnAnswers from '../utils/applications/deleteOrphanedData'

export default class ApplicationService {
  constructor(private readonly applicationClientFactory: RestClientBuilder<ApplicationClient>) {}

  async createApplication(
    token: string,
    crn: string,
    applicationOrigin: ApplicationOrigin,
  ): Promise<Cas2v2Application> {
    const applicationClient = this.applicationClientFactory(token)

    const application = await applicationClient.create(crn, applicationOrigin)

    return application
  }

  async findApplication(token: string, id: string): Promise<Cas2v2Application> {
    const applicationClient = this.applicationClientFactory(token)

    const application = await applicationClient.find(id)

    return application
  }

  async getAllForLoggedInUser(token: string): Promise<GroupedApplications> {
    const applicationClient = this.applicationClientFactory(token)

    const allApplications = await applicationClient.all()

    const result = {
      inProgress: [],
      submitted: [],
    } as GroupedApplications

    allApplications.map(async application => {
      if (application.status === 'inProgress') {
        result.inProgress.push(application)
      } else if (application.status === 'submitted') {
        result.submitted.push(application)
      }
    })

    return result
  }

  async getAllByPrison(
    token: string,
    prisonCode: string,
    pageNumber: number = 1,
  ): Promise<PaginatedResponse<Cas2v2ApplicationSummary>> {
    const applicationClient = this.applicationClientFactory(token)

    const applications = await applicationClient.getAllByPrison(prisonCode, pageNumber)

    return applications
  }

  async getAllByOrigin(
    token: string,
    applicationOrigin: string,
    pageNumber: number = 1,
  ): Promise<PaginatedResponse<Cas2v2ApplicationSummary>> {
    const applicationClient = this.applicationClientFactory(token)
    return applicationClient.getAllByOrigin(applicationOrigin, pageNumber)
  }

  async save(page: TaskListPage, request: Request) {
    const errors = page.errors()

    if (Object.keys(errors).length) {
      throw new ValidationError<typeof page>(errors)
    } else {
      const application = await this.findApplication(request.user.token, request.params.id)
      const client = this.applicationClientFactory(request.user.token)

      if (typeof page.onSave === 'function') {
        page.onSave()
      }

      const pageName = getPageName(page.constructor)
      const taskName = getTaskName(page.constructor)
      const oldBody = application.data?.[taskName]?.[pageName]

      application.data = this.addPageDataToApplicationData(application.data, taskName, pageName, page)
      application.data = deleteOrphanedFollowOnAnswers(application.data)
      application.data = this.deleteCheckYourAnswersIfPageChange(application.data, pageName, oldBody, page.body)

      await client.update(application.id, getApplicationUpdateData(application))
    }
  }

  private addPageDataToApplicationData(
    applicationData: Cas2v2Application['data'],
    taskName: string,
    pageName: string,
    page: TaskListPage,
  ): Cas2v2Application['data'] {
    const newApplicationData = applicationData || {}
    newApplicationData[taskName] = newApplicationData[taskName] || {}
    newApplicationData[taskName][pageName] = page.body
    return newApplicationData
  }

  private deleteCheckYourAnswersIfPageChange(
    applicationData: Cas2v2Application['data'],
    pageName: string,
    oldBody: Record<string, unknown>,
    newBody: Record<string, unknown>,
  ) {
    const checkYourAnswersTaskName = getTaskName(CheckYourAnswers)
    const checkYourAnswersPageName = getPageName(CheckYourAnswers)

    const pageHasChangedSinceLastSave = () => {
      return !oldBody || !pageBodyShallowEquals(oldBody, newBody)
    }

    if (pageName !== checkYourAnswersPageName) {
      if (pageHasChangedSinceLastSave()) {
        delete applicationData[checkYourAnswersTaskName]
      }
    }

    return applicationData
  }

  async saveData(taskData: Record<string, unknown>, request: Request) {
    const application = await this.findApplication(request.user.token, request.params.id)
    const client = this.applicationClientFactory(request.user.token)

    application.data = {
      ...application.data,
      ...taskData,
    }

    await client.update(application.id, getApplicationUpdateData(application))
  }

  async appendToList(page: TaskListPage, request: Request) {
    const errors = page.errors()

    if (Object.keys(errors).length) {
      throw new ValidationError<typeof page>(errors)
    } else {
      const application = await this.findApplication(request.user.token, request.params.id)
      const client = this.applicationClientFactory(request.user.token)

      const pageName = getPageName(page.constructor)
      const taskName = getTaskName(page.constructor)

      /* eslint-disable no-underscore-dangle */
      delete request.body._csrf

      if (this.hasPageData(application, taskName, pageName)) {
        application.data[taskName][pageName].push(request.body)
      } else {
        application.data = application.data || {}
        application.data[taskName] = application.data[taskName] || {}
        application.data[taskName][pageName] = [{ ...request.body }]
      }

      await client.update(application.id, getApplicationUpdateData(application))
    }
  }

  async removeFromList(request: Request) {
    const application = await this.findApplication(request.user.token, request.params.id)
    const client = this.applicationClientFactory(request.user.token)

    const { page, task, index } = request.params

    if (this.hasPageData(application, task, page)) {
      application.data[task][page].splice(index, 1)
      await client.update(application.id, getApplicationUpdateData(application))
    }
  }

  private hasPageData(application: Cas2v2Application, taskName: string, pageName: string) {
    return application.data && application.data[taskName] && application.data[taskName][pageName]
  }

  async initializePage(
    Page: TaskListPageInterface,
    request: Request,
    dataServices: DataServices,
    userInput?: Record<string, unknown>,
  ): Promise<TaskListPage> {
    const application = await this.findApplication(request.user.token, request.params.id)
    const body = getBody(Page, application, request, userInput)

    const page = Page.initialize
      ? await Page.initialize(body, application, request.user.token, dataServices)
      : new Page(body, application, request.session.previousPage)

    return page
  }

  async submit(token: string, application: Cas2v2Application) {
    const client = this.applicationClientFactory(token)

    await client.submit(application.id, getApplicationSubmissionData(application))
  }

  async cancel(token: string, application: Cas2v2Application) {
    const client = this.applicationClientFactory(token)

    await client.abandon(application.id)
  }
}
