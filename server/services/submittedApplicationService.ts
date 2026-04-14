import {
  Cas2v2SubmittedApplication as SubmittedApplication,
  Cas2v2ApplicationStatus as ApplicationStatus,
  Cas2v2SubmittedApplicationSummary,
  Cas2v2ApplicationNote,
} from '@approved-premises/api'
import { PaginatedResponse } from '@approved-premises/ui'

import type { SubmittedApplicationClient, ReferenceDataClient, RestClientBuilder } from '../data'

export default class SubmittedApplicationService {
  constructor(
    private readonly submittedApplicationClientFactory: RestClientBuilder<SubmittedApplicationClient>,
    private readonly referenceDataClientFactory: RestClientBuilder<ReferenceDataClient>,
  ) {}

  async getAll(token: string, pageNumber: number = 1): Promise<PaginatedResponse<Cas2v2SubmittedApplicationSummary>> {
    const applicationClient = this.submittedApplicationClientFactory(token)

    return applicationClient.all(pageNumber)
  }

  async findApplication(token: string, id: string): Promise<SubmittedApplication> {
    const applicationClient = this.submittedApplicationClientFactory(token)

    return applicationClient.find(id)
  }

  async getApplicationStatuses(token: string): Promise<Array<ApplicationStatus>> {
    const referenceDataClient = this.referenceDataClientFactory(token)

    return referenceDataClient.getApplicationStatuses()
  }

  async addApplicationNote(token: string, applicationId: string, newNote: string): Promise<Cas2v2ApplicationNote> {
    const applicationClient = this.submittedApplicationClientFactory(token)

    return applicationClient.addNote(applicationId, newNote)
  }
}
