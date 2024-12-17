/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import BailHearingArranger from './bailHearingArranger'

@Task({
  name: 'Add bail hearing arrangement information',
  slug: 'bail-hearing-arrangement',
  pages: [BailHearingArranger],
})
export default class BailHearingArrangementInformation {}
