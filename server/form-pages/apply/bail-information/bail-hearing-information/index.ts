/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import CourtName from './courtName'

@Task({
  name: 'Add bail hearing information',
  slug: 'bail-hearing-information',
  pages: [CourtName],
})
export default class BailHearingInformation {}
