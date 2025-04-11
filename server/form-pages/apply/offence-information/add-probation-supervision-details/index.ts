/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import SupervisedByProbation from './supervisedByProbation'
import CPPDetails from './cppDetails'
import OASysRiskAssessment from './oasysRiskAssessment'
import OASysRiskAssessmentDetails from './oasysRiskAssessmentDetails'

@Task({
  name: 'Add probation supervision details',
  slug: 'add-probation-supervision-details',
  pages: [SupervisedByProbation, CPPDetails, OASysRiskAssessment, OASysRiskAssessmentDetails],
})
export default class ProbationSupervisionDetails {}
