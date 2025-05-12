/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import SupervisedByProbation from './supervisedByProbation'
import CPPDetails from './cppDetails'
import SeriousHarmRiskLevels from './seriousHarmRiskLevels'
import ContactedCppAboutCurrentRiskLevels from './contactedCppAboutCurrentRiskLevels'
import YouMustContactTheCpp from './youMustContactTheCpp'

@Task({
  name: 'Add probation supervision details',
  slug: 'add-probation-supervision-details',
  pages: [
    SupervisedByProbation,
    CPPDetails,
    ContactedCppAboutCurrentRiskLevels,
    YouMustContactTheCpp,
    SeriousHarmRiskLevels,
  ],
})
export default class ProbationSupervisionDetails {}
