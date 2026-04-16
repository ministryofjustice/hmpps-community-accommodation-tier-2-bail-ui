import type { FullPerson, PersonRisks } from '@approved-premises/api'

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

  async risks(crn: string): Promise<PersonRisks> {
    return this.restClient.get<PersonRisks>({ path: paths.people.risks.show({ crn }) })
  }
}
