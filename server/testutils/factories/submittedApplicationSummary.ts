import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { Cas2SubmittedApplicationSummary } from '@approved-premises/api'

import { DateFormats } from '../../utils/dateUtils'
import { fullPersonFactory } from './person'

export default Factory.define<Cas2SubmittedApplicationSummary>(() => {
  const crn = faker.string.alphanumeric(5)
  const personName = faker.person.fullName()

  return {
    id: faker.string.uuid(),
    type: 'CAS2V2',
    person: fullPersonFactory.build(),
    createdAt: DateFormats.dateObjToIsoDateTime(faker.date.past()),
    submittedAt: DateFormats.dateObjToIsoDateTime(faker.date.past()),
    createdByUserId: faker.string.uuid(),
    status: 'submitted',
    crn,
    nomsNumber: faker.string.alphanumeric(5),
    personName,
    personSummary: { personType: 'Found', crn, name: personName },
  }
})
