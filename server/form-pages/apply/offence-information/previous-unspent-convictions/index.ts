/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import AnyPreviousConvictions from './anyPreviousConvictions'
import OffenceHistoryData from './custom-forms/offenceHistoryData'
import UnspentConvictions from './unspentConvictions'

@Task({
  name: 'Add previous unspent convictions',
  slug: 'previous-unspent-convictions',
  pages: [AnyPreviousConvictions, OffenceHistoryData, UnspentConvictions],
})
export default class PreviousUnspentConvictions {}
