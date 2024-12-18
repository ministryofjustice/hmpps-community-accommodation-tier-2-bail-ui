/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import BailHearingArranger from './bailHearingArranger'
import BailHearingContact from './bailHearingContact'

@Task({
  name: 'Add bail hearing arrangement information',
  slug: 'bail-hearing-arrangement',
  pages: [BailHearingArranger, BailHearingContact],
})
export default class BailHearingArrangementInformation {}
