import { faker } from '@faker-js/faker/locale/en_GB'
import { Factory } from 'fishery'
import { Cas2v2SubmittedApplication as SubmittedApplication } from '@approved-premises/api'
import { DateFormats } from '../../utils/dateUtils'
import { fullPersonFactory } from './person'
import cas2v2User from './cas2v2User'
import timelineEvents from './timelineEvents'
import assessmentFactory from './assessment'

export default Factory.define<SubmittedApplication>(() => ({
  id: faker.string.uuid(),
  person: fullPersonFactory.build(),
  submittedBy: cas2v2User.build(),
  schemaVersion: faker.string.uuid(),
  createdAt: DateFormats.dateObjToIsoDateTime(faker.date.past()),
  submittedAt: DateFormats.dateObjToIsoDateTime(faker.date.past()),
  document: {},
  outdatedSchema: faker.datatype.boolean(),
  telephoneNumber: faker.string.numeric({ length: 8 }),
  timelineEvents: [timelineEvents.build()],
  assessment: assessmentFactory.build(),
}))
