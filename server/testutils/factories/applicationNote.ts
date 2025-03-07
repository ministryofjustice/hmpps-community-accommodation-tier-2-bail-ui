import { Factory } from 'fishery'
import { faker } from '@faker-js/faker/locale/en_GB'
import { Cas2v2ApplicationNote } from '@approved-premises/api'

import { DateFormats } from '../../utils/dateUtils'

export default Factory.define<Cas2v2ApplicationNote>(() => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  username: faker.internet.username(),
  name: faker.person.fullName(),
  body: faker.lorem.paragraph(),
  createdAt: DateFormats.dateObjToIsoDateTime(faker.date.past()),
}))
