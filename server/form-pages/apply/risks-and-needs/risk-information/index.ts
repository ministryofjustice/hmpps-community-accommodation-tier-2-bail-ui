/* istanbul ignore file */
import Concerns from './concerns'
import SelfHarm from './selfHarm'
import Acct from './acct'
import AcctData from './custom-forms/acctData'
import ViolenceAndArson from './violenceAndArson'
import LivingInTheCommunity from './livingInTheCommunity'
import SafetyOfStaff from './safetyOfStaff'
import AdditionalConcerns from './additionalConcerns'

import { Task } from '../../../utils/decorators'

@Task({
  name: 'Add information about risks to the applicant and others',
  slug: 'risk-information',
  pages: [
    Concerns,
    SelfHarm,
    Acct,
    AcctData,
    ViolenceAndArson,
    LivingInTheCommunity,
    SafetyOfStaff,
    AdditionalConcerns,
  ],
})
export default class RiskToSelf {}
