/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import AnyPreviousConvictions from './anyPreviousConvictions'
import UnspentConvictionsData from './custom-forms/unspentConvictionsData'
import UnspentConvictions from './unspentConvictions'

@Task({
  name: 'Add previous unspent convictions',
  slug: 'previous-unspent-convictions',
  pages: [AnyPreviousConvictions, UnspentConvictionsData, UnspentConvictions],
})
export default class PreviousUnspentConvictions {}
