import type { Cas2OASysRiskLevel, Cas2OAsysRiskToSelfDto, FullPerson } from '@approved-premises/api'
import type { OASysRiskOfSeriousHarm, RoshRisks, RoshRisksEnvelope } from '@approved-premises/ui'
import type { PersonClient, RestClientBuilder } from '../data'

const riskLevel: Record<Cas2OASysRiskLevel, string> = {
  very_high: 'Very High',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export default class PersonService {
  constructor(private readonly personClientFactory: RestClientBuilder<PersonClient>) {}

  async findByPrisonNumber(token: string, nomsNumber: string): Promise<FullPerson> {
    const personClient = this.personClientFactory(token)

    return personClient.searchByPrisonNumber(nomsNumber)
  }

  async findByCrn(token: string, crn: string): Promise<FullPerson> {
    const personClient = this.personClientFactory(token)

    return personClient.searchByCrn(crn)
  }

  async getOasysRiskToSelf(token: string, crn: string): Promise<Cas2OAsysRiskToSelfDto> {
    const personClient = this.personClientFactory(token)
    const riskToSelf = await personClient.oasysRiskToSelf(crn)

    if (!riskToSelf?.metadata?.hasApplicableAssessment) {
      return null
    }

    return riskToSelf
  }

  async getOasysRosh(token: string, crn: string): Promise<OASysRiskOfSeriousHarm> {
    const personClient = this.personClientFactory(token)
    const summary = await personClient.oasysRoshSummary(crn)

    if (!summary?.metadata?.hasApplicableAssessment) {
      return null
    }

    return {
      assessmentId: null,
      assessmentState: summary.metadata.dateCompleted ? 'Completed' : 'Incomplete',
      dateStarted: summary.metadata.dateStarted,
      dateCompleted: summary.metadata.dateCompleted,
      rosh: [
        { questionNumber: 'R10.1', label: 'Who is at risk', answer: summary.whoIsAtRisk },
        { questionNumber: 'R10.2', label: 'What is the nature of the risk', answer: summary.natureOfRisk },
      ],
    }
  }

  async getRoshRisks(token: string, crn: string): Promise<RoshRisksEnvelope> {
    const personClient = this.personClientFactory(token)
    const ratings = await personClient.oasysRoshRatings(crn)

    if (!ratings?.metadata?.hasApplicableAssessment) {
      return { status: 'not_found' }
    }

    return {
      status: 'retrieved',
      value: {
        overallRisk: riskLevel[ratings.overallRisk],
        riskToChildren: riskLevel[ratings.riskToChildren],
        riskToPublic: riskLevel[ratings.riskToPublic],
        riskToKnownAdult: riskLevel[ratings.riskToKnownAdult],
        riskToStaff: riskLevel[ratings.riskToStaff],
      } as RoshRisks,
    }
  }
}
