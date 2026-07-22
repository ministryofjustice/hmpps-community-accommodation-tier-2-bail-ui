/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import OasysImport from './oasysImport'
import Summary from './summary'
import RiskToOthers from './riskToOthers'
import ManualRoshInformation from './manualRoshInformation'
import OldOasys from './oldOasys'
import RiskManagementArrangements from './riskManagementArrangements'
import CellShareInformation from './cellShareInformation'
import AdditionalRiskInformation from './additionalRiskInformation'

@Task({
  name: 'Add risk of serious harm to others',
  slug: 'risks-of-serious-harm-to-others',
  pages: [
    OasysImport,
    Summary,
    OldOasys,
    ManualRoshInformation,
    RiskToOthers,
    RiskManagementArrangements,
    CellShareInformation,
    AdditionalRiskInformation,
  ],
})
export default class RisksOfSeriousHarmToOthers {}
