import type { FullPerson } from '@approved-premises/api'
import type { PersonClient, RestClientBuilder } from '../data'

export default class PersonService {
  constructor(private readonly personClientFactory: RestClientBuilder<PersonClient>) {}

  async findByPrisonNumber(token: string, nomsNumber: string): Promise<FullPerson> {
    const personClient = this.personClientFactory(token)

    const person = await personClient.searchByPrisonNumber(nomsNumber)
    return person
  }

  async findByCrn(token: string, crn: string): Promise<FullPerson> {
    const personClient = this.personClientFactory(token)

    const person = await personClient.searchByCrn(crn)
    return person
  }
}
