import { Cas2v2UserDto } from '@approved-premises/api'
import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

export default Factory.define<Cas2v2UserDto>(() => ({
  username: faker.internet.username(),
  type: faker.helpers.arrayElement(['NOMIS', 'DELIUS', 'EXTERNAL']),
  deliusUserInfo: {
    probationArea: {
      code: faker.string.alpha({ length: 6 }),
      description: faker.location.state(),
    },
  },
}))
