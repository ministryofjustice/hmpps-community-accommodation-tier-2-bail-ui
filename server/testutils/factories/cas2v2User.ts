import { Cas2v2User } from '@approved-premises/api'
import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

export default Factory.define<Cas2v2User>(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  username: faker.internet.username(),
  authSource: 'nomis',
  email: faker.internet.email(),
  isActive: faker.datatype.boolean(),
}))
