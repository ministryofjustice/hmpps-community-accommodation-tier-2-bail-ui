import { Page } from '../../../utils/decorators'
import BaseCppDetails from '../../offences-and-concerns/add-probation-supervision-details/cppDetails'

@Page({
  name: 'community-probation-practitioner-details',
  bodyProperties: ['name', 'probationRegion', 'email', 'telephone'],
})
export default class CPPDetails extends BaseCppDetails {
  previous() {
    return 'cpp-check'
  }

  next() {
    return 'job-title'
  }
}
