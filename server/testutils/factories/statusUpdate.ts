import { Cas2v2StatusUpdate } from '@approved-premises/api'
import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'
import { DateFormats } from '../../utils/dateUtils'
import cas2v2User from './cas2v2User'
import statusUpdateDetail from './statusUpdateDetail'

export default Factory.define<Cas2v2StatusUpdate>(() => ({
  id: faker.string.uuid(),
  name: 'onWaitingList',
  label: 'On waiting list',
  description: 'No suitable place is currently available.',
  updatedBy: cas2v2User.build(),
  updatedAt: DateFormats.dateObjToIsoDateTime(faker.date.recent()),
  statusUpdateDetails: [statusUpdateDetail.build()],
}))
