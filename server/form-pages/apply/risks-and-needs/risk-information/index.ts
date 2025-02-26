/* istanbul ignore file */
import Concerns from './concerns'
import SelfHarm from './selfHarm'
import Acct from './acct'
import ViolenceAndArson from './violenceAndArson'
import RisksToStaff from './risksToStaff'

import { Task } from '../../../utils/decorators'

@Task({
  name: 'Add information about risks to the applicant and others',
  slug: 'risk-information',
  pages: [Concerns, SelfHarm, Acct, ViolenceAndArson, RisksToStaff],
})
export default class RiskToSelf {}
