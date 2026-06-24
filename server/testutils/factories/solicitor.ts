import { faker } from '@faker-js/faker/locale/en_GB'
import { Factory } from 'fishery'

type Solicitor = {
  fullName: string
  legalFirmAddress: string
  emailAddress: string
  phoneNumber: string
}

function getAddress() {
  const streetAddress = faker.location.streetAddress()
  const city = faker.location.city()
  const postcode = faker.location.zipCode()
  return `${streetAddress}, ${city} ${postcode}`
}

export default Factory.define<Solicitor>(() => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    fullName: faker.person.fullName({ firstName, lastName }),
    legalFirmAddress: getAddress(),
    emailAddress: faker.internet.email({ firstName, lastName }),
    phoneNumber: faker.phone.number(),
  }
})
