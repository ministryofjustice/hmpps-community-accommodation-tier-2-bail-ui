import type {
  Cas2OASysAssessmentMetadataDto,
  Cas2OAsysRiskToSelfDto,
  Cas2OAsysRoshRatingsDto,
  Cas2OAsysRoshSummaryDto,
  FullPerson,
} from '@approved-premises/api'

import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import paths from '../paths/api'

export default class PersonClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('personClient', config.apis.approvedPremises as ApiConfig, token)
  }

  async searchByPrisonNumber(nomsNumber: string): Promise<FullPerson> {
    const encodedNomsNumber = encodeURIComponent(nomsNumber)
    const path = paths.people.searchByPrisonNumber({ nomsNumber: encodedNomsNumber })

    return this.restClient.get<FullPerson>({ path })
  }

  async searchByCrn(crn: string): Promise<FullPerson> {
    const encodedCrn = encodeURIComponent(crn)
    const path = `${paths.people.searchByCrn({ crn: encodedCrn })}`

    return this.restClient.get<FullPerson>({ path })
  }

  async oasysRiskToSelf(crn: string): Promise<Cas2OAsysRiskToSelfDto> {
    return this.restClient.get<Cas2OAsysRiskToSelfDto>({
      path: paths.people.oasys.riskToSelf({ crn }),
    })
  }

  async oasysMetadata(crn: string): Promise<Cas2OASysAssessmentMetadataDto> {
    const encodedCrn = encodeURIComponent(crn)
    const path = paths.people.oasys.metadata({ crn: encodedCrn })

    return this.restClient.get<Cas2OASysAssessmentMetadataDto>({ path })
  }

  async oasysRoshRatings(crn: string): Promise<Cas2OAsysRoshRatingsDto> {
    const encodedCrn = encodeURIComponent(crn)
    const path = paths.people.oasys.roshRatings({ crn: encodedCrn })

    return this.restClient.get<Cas2OAsysRoshRatingsDto>({ path })
  }

  async oasysRoshSummary(crn: string): Promise<Cas2OAsysRoshSummaryDto> {
    const encodedCrn = encodeURIComponent(crn)
    const path = paths.people.oasys.roshSummary({ crn: encodedCrn })

    return this.restClient.get<Cas2OAsysRoshSummaryDto>({ path })
  }
}
