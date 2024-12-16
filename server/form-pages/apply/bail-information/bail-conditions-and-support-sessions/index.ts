/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import NonStandardBailConditions from './nonStandardBailConditions'
import MandatorySupportSessions from './mandatorySupportSessions'

@Task({
  name: 'Add bail conditions and support sessions',
  slug: 'bail-conditions-and-support-sessions',
  pages: [NonStandardBailConditions, MandatorySupportSessions],
})
export default class BailConditionsAndSupportSessions {}
