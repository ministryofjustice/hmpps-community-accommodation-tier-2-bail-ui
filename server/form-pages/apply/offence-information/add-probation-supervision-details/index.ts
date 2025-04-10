/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import SupervisedByProbation from './supervisedByProbation'
import CPPDetails from './cppDetails'
import OASysRiskAssessment from './oasysRiskAssessment'

@Task({
  name: 'Add probation supervision details',
  slug: 'add-probation-supervision-details',
  pages: [SupervisedByProbation, CPPDetails, OASysRiskAssessment],
})
export default class ProbationSupervisionDetails {}
