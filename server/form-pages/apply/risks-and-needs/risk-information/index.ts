/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import Acct from './acct'
import AcctData from './custom-forms/acctData'
import AdditionalInformation from './additionalInformation'
import CurrentRisk from './currentRisk'
import HistoricalRisk from './historicalRisk'
import Vulnerability from './vulnerability'

@Task({
  name: 'Add information about risks to the applicant and others',
  slug: 'risk-information',
  pages: [Vulnerability, CurrentRisk, HistoricalRisk, AcctData, Acct, AdditionalInformation],
})
export default class RiskToSelf {}
