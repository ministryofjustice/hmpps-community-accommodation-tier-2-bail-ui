import { Factory } from 'fishery'
import { faker } from '@faker-js/faker/locale/en_GB'

import type { FullPerson, RestrictedPerson, TierDto } from '@approved-premises/api'
import { DateFormats } from '../../utils/dateUtils'

export const tierFactory = Factory.define<TierDto>(() => ({
  calculationDate: DateFormats.dateObjToIsoDate(faker.date.past()),
  tierScore: faker.helpers.arrayElement(['A1', 'A2', 'B1']),
  version: faker.helpers.arrayElement(['V2', 'V3']),
}))

export const fullPersonFactory = Factory.define<FullPerson>(() => ({
  crn: `C${faker.number.int({ min: 100000, max: 999999 })}`,
  name: faker.person.fullName(),
  dateOfBirth: DateFormats.dateObjToIsoDate(faker.date.past()),
  sex: faker.helpers.arrayElement(['Male', 'Female', 'Other', 'Prefer not to say']),
  status: faker.helpers.arrayElement(['InCustody', 'InCommunity']),
  nomsNumber: `NOMS${faker.number.int({ min: 100, max: 999 })}`,
  pncNumber: `PNC${faker.number.int({ min: 100, max: 999 })}`,
  nationality: faker.location.country(),
  religionOrBelief: faker.helpers.arrayElement(['Christian', 'Muslim', 'Jewish', 'Hindu', 'Buddhist', 'Sikh', 'None']),
  prisonName: `HMP ${faker.location.street()}`,
  tier: tierFactory.build(),
  type: 'FullPerson',
}))

export const restrictedPersonFactory = Factory.define<RestrictedPerson>(() => ({
  crn: `C${faker.number.int({ min: 100000, max: 999999 })}`,
  tier: tierFactory.build(),
  type: 'RestrictedPerson',
}))
