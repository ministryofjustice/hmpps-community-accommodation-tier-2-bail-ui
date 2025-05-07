/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import SupervisedByProbation from './supervisedByProbation'
import CPPDetails from './cppDetails'
import OASysRiskAssessmentDetails from './oasysRiskAssessmentDetails'
import ContactedCppAboutCurrentRiskLevels from './contactedCppAboutCurrentRiskLevels'

@Task({
  name: 'Add probation supervision details',
  slug: 'add-probation-supervision-details',
  pages: [SupervisedByProbation, CPPDetails, ContactedCppAboutCurrentRiskLevels, OASysRiskAssessmentDetails],
})
export default class ProbationSupervisionDetails {}
