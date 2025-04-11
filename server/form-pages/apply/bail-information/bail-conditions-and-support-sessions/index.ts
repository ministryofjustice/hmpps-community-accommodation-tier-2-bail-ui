/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import NonStandardBailConditions from './nonStandardBailConditions'

@Task({
  name: 'Add bail conditions and support sessions',
  slug: 'bail-conditions-and-support-sessions',
  pages: [NonStandardBailConditions],
})
export default class BailConditionsAndSupportSessions {}
