/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import PreviousAddress from './previousAddress'
import HasFixedAddress from './hasFixedAddress'
import LastFixedAddress from './lastFixedAddress'
import NoFixedAddress from './noFixedAddress'
import config from '../../../../config'

@Task({
  name: 'Add address history',
  slug: 'address-history',
  // TODO: we need to remove-edit this whenwe add new cohorts go to prod!
  pages: config.flags.cas2IsrEnabled
    ? [HasFixedAddress, LastFixedAddress, NoFixedAddress, PreviousAddress]
    : [PreviousAddress],
})
export default class AddressHistory {}
