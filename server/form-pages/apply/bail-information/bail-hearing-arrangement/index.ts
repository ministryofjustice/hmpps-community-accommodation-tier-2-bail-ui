/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import BailHearingArranger from './bailHearingArranger'
import BailHearingContact from './bailHearingContact'
import ConsultLegalAdvisor from './consultLegalAdvisor'

@Task({
  name: 'Add bail hearing arrangement information',
  slug: 'bail-hearing-arrangement',
  pages: [BailHearingArranger, BailHearingContact, ConsultLegalAdvisor],
})
export default class BailHearingArrangementInformation {}
