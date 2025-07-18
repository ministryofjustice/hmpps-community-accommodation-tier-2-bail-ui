import {
  Cas2v2Application as Application,
  Cas2v2ApplicationSummary,
  SubmitCas2v2Application,
  UpdateApplication,
  UpdateCas2v2Application,
} from '@approved-premises/api'
import { ApplicationOrigin, PaginatedResponse } from '@approved-premises/ui'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import paths from '../paths/api'

export default class ApplicationClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('applicationClient', config.apis.approvedPremises as ApiConfig, token)
  }

  async find(applicationId: string): Promise<Application> {
    return (await this.restClient.get({
      path: paths.applications.show({ id: applicationId }),
    })) as Application
  }

  async create(crn: string, applicationOrigin: ApplicationOrigin): Promise<Application> {
    return (await this.restClient.post({
      path: paths.applications.new.pattern,
      data: { crn: crn.trim(), applicationOrigin },
    })) as Application
  }

  async all(): Promise<Array<Cas2v2ApplicationSummary>> {
    return (await this.restClient.get({ path: paths.applications.index.pattern })) as Array<Cas2v2ApplicationSummary>
  }

  async getAllByPrison(prisonCode: string, pageNumber: number): Promise<PaginatedResponse<Cas2v2ApplicationSummary>> {
    return this.restClient.getPaginatedResponse<Cas2v2ApplicationSummary>({
      path: paths.applications.index.pattern,
      page: pageNumber.toString(),
      query: { isSubmitted: 'true', prisonCode },
    })
  }

  async getAllByOrigin(
    applicationOrigin: ApplicationOrigin,
    pageNumber: number,
  ): Promise<PaginatedResponse<Cas2v2ApplicationSummary>> {
    return this.restClient.getPaginatedResponse<Cas2v2ApplicationSummary>({
      path: paths.applications.index.pattern,
      page: pageNumber.toString(),
      query: { isSubmitted: 'true', applicationOrigin, limitByUser: 'false' },
    })
  }

  async update(applicationId: string, updateData: UpdateCas2v2Application): Promise<Application> {
    return (await this.restClient.put({
      path: paths.applications.update({ id: applicationId }),
      data: { ...updateData, type: 'CAS2V2' } as UpdateApplication,
    })) as Application
  }

  async submit(applicationId: string, submissionData: SubmitCas2v2Application): Promise<void> {
    await this.restClient.post({
      path: paths.submissions.create.pattern,
      data: { ...submissionData, applicationId },
    })
  }

  async abandon(applicationId: string): Promise<void> {
    await this.restClient.put({
      path: paths.applications.abandon({ id: applicationId }),
    })
  }
}
