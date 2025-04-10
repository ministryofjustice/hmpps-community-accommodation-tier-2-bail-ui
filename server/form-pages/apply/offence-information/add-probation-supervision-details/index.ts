/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import CommunitySupervision from './communitySupervision'
import CPPDetails from './cppDetails'
import OASysRiskAssessment from './oasysRiskAssessment'

@Task({
  name: 'Add probation supervision details',
  slug: 'add-probation-supervision-details',
  pages: [CommunitySupervision, CPPDetails, OASysRiskAssessment],
})
export default class ProbationSupervisionDetails {}
