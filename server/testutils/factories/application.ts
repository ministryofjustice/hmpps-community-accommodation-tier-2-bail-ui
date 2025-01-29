import { faker } from '@faker-js/faker/locale/en_GB'
import { Factory } from 'fishery'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { DateFormats } from '../../utils/dateUtils'
import { fullPersonFactory, restrictedPersonFactory } from './person'
import cas2v2UserFactory from './cas2v2User'

export default Factory.define<Application>(() => ({
  id: faker.string.uuid(),
  applicationOrigin: 'prisonBail',
  person: faker.helpers.arrayElement([fullPersonFactory.build(), restrictedPersonFactory.build()]),
  createdBy: cas2v2UserFactory.build({}),
  schemaVersion: faker.string.uuid(),
  createdAt: DateFormats.dateObjToIsoDateTime(faker.date.past()),
  submittedAt: undefined,
  data: {},
  document: {},
  outdatedSchema: faker.datatype.boolean(),
  status: 'inProgress' as const,
  type: 'CAS2V2',
  telephoneNumber: null,
  statusUpdates: null,
  assessment: null,
}))
