import { Factory } from 'fishery'
import { faker } from '@faker-js/faker/locale/en_GB'
import { Cas2v2ApplicationStatus as ApplicationStatus } from '@approved-premises/api'
import applicationStatusDetailFactory from './applicationStatusDetailFactory'

export default Factory.define<ApplicationStatus>(() => ({
  id: faker.string.uuid(),
  name: 'onWaitingList',
  label: 'On waiting list',
  description: 'The applicant has been added to the waiting list for CAS2 for Bail.',
  statusDetails: [applicationStatusDetailFactory.build()],
}))
