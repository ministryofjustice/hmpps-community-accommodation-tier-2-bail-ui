import { Task } from '../../../utils/decorators'
import LicenceConditions from './licenceConditions'
import Orders from './orders'

@Task({
  name: 'Add orders and licence conditions',
  slug: 'orders-and-licence-conditions',
  pages: [LicenceConditions, Orders],
})
export default class OrdersAndLicenceConditions {}
