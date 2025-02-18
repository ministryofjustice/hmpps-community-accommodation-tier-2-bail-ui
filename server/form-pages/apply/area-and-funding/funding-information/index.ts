/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import FundingCas2Accommodation from './fundingCas2Accommodation'
import Identification from './identification'
import AlternativeIdentification from './alternativeID'

@Task({
  name: 'Confirm funding and ID',
  slug: 'funding-information',
  pages: [FundingCas2Accommodation, Identification, AlternativeIdentification],
})
export default class FundingInformation {}
