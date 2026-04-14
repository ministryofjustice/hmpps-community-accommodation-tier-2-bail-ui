import type { FullPerson } from '@approved-premises/api'
import type { PersonClient, RestClientBuilder } from '../data'

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
}
