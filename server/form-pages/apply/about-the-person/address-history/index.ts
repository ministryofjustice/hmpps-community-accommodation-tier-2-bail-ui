/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import PreviousAddress from './previousAddress'
import HasFixedAddressBeforeCustody from './hasFixedAddressBeforeCustody'
import LastFixedAddress from './lastFixedAddress'
import NoFixedAddress from './noFixedAddress'

@Task({
  name: 'Add address history',
  slug: 'address-history',
  pages: [HasFixedAddressBeforeCustody, LastFixedAddress, NoFixedAddress, PreviousAddress],
})
export default class AddressHistory {}
