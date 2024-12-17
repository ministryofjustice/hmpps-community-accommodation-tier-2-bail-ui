/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import CourtName from './courtName'
import BailHearingDate from './bailHearingDate'

@Task({
  name: 'Add bail hearing information',
  slug: 'bail-hearing-information',
  pages: [CourtName, BailHearingDate],
})
export default class BailHearingInformation {}
