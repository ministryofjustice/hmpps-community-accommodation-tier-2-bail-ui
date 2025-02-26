/* istanbul ignore file */
import Acct from './acct'

import { Task } from '../../../utils/decorators'

@Task({
  name: 'Add information about risks to the applicant and others',
  slug: 'risk-information',
  pages: [Acct],
})
export default class RiskToSelf {}
