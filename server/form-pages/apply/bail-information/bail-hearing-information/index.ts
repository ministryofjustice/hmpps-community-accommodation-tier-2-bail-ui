/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import CourtName from './courtName'
import BailHearingDate from './bailHearingDate'
import BailHearingMedium from './bailHearingMedium'

@Task({
  name: 'Add bail hearing information',
  slug: 'bail-hearing-information',
  pages: [CourtName, BailHearingDate, BailHearingMedium],
})
export default class BailHearingInformation {}
