import {
  Cas2v2Assessment,
  Cas2v2AssessmentStatusUpdate as AssessmentStatusUpdate,
  UpdateCas2v2Assessment,
} from '@approved-premises/api'
import { AssessmentClient, RestClientBuilder } from '../data'

export default class AssessmentService {
  constructor(private readonly assessmentClientFactory: RestClientBuilder<AssessmentClient>) {}

  async findAssessment(token: string, assessmentId: string): Promise<Cas2v2Assessment> {
    const assessmentClient = this.assessmentClientFactory(token)

    return assessmentClient.find(assessmentId)
  }

  async updateAssessment(
    token: string,
    assessmentId: string,
    updateData: UpdateCas2v2Assessment,
  ): Promise<Cas2v2Assessment> {
    const assessmentClient = this.assessmentClientFactory(token)

    return assessmentClient.update(assessmentId, updateData)
  }

  async updateAssessmentStatus(token: string, assessmentId: string, newStatus: AssessmentStatusUpdate): Promise<void> {
    const assessmentClient = this.assessmentClientFactory(token)

    return assessmentClient.updateStatus(assessmentId, newStatus)
  }
}
