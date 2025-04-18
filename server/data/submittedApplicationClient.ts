import {
  Cas2v2SubmittedApplication as SubmittedApplication,
  Cas2v2SubmittedApplicationSummary,
  Cas2v2ApplicationNote,
} from '@approved-premises/api'
import { PaginatedResponse } from '@approved-premises/ui'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import paths from '../paths/api'

export default class SubmittedApplicationClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('submittedApplicationClient', config.apis.approvedPremises as ApiConfig, token)
  }

  async all(pageNumber: number): Promise<PaginatedResponse<Cas2v2SubmittedApplicationSummary>> {
    return this.restClient.getPaginatedResponse<Cas2v2SubmittedApplicationSummary>({
      path: paths.submissions.index.pattern,
      page: pageNumber.toString(),
      query: {},
    })
  }

  async find(applicationId: string): Promise<SubmittedApplication> {
    return (await this.restClient.get({
      path: paths.submissions.show({ id: applicationId }),
    })) as SubmittedApplication
  }

  async addNote(assessmentId: string, newNote: string): Promise<Cas2v2ApplicationNote> {
    return (await this.restClient.post({
      path: paths.assessments.applicationNotes.create({ id: assessmentId }),
      data: { note: newNote },
    })) as Cas2v2ApplicationNote
  }
}
