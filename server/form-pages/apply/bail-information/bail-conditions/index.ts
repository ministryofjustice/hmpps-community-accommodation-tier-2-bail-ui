/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import NonStandardBailConditions from './nonStandardBailConditions'

@Task({
  name: 'Add bail conditions',
  slug: 'bail-conditions',
  pages: [NonStandardBailConditions],
})
export default class BailConditions {}
