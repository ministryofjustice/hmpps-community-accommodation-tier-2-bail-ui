import type { FullPerson, PersonRisks } from '@approved-premises/api'

import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import paths from '../paths/api'
import { createQueryString } from '../utils/utils'

export default class PersonClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('personClient', config.apis.approvedPremises as ApiConfig, token)
  }

  async search(nomsNumber: string): Promise<FullPerson> {
    const query = { nomsNumber } as Record<string, string | boolean>

    const path = `${paths.people.search({})}?${createQueryString(query)}`
    const response = await this.restClient.get({
      path,
    })

    return response as FullPerson
  }

  async risks(crn: string): Promise<PersonRisks> {
    const response = await this.restClient.get({
      path: paths.people.risks.show({ crn }),
    })

    return response as PersonRisks
  }
}
