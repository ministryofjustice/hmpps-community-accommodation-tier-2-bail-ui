/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import AnyPreviousConvictions from './anyPreviousConvictions'
import OffenceHistoryData from './custom-forms/offenceHistoryData'
import OffenceHistory from './offenceHistory'

@Task({
  name: 'Add previous unspent convictions',
  slug: 'previous-unspent-convictions',
  pages: [AnyPreviousConvictions, OffenceHistoryData, OffenceHistory],
})
export default class PreviousUnspentConvictions {}
