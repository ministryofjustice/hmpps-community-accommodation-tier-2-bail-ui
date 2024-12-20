import { Task } from '../../../utils/decorators'
import RiskToOthers from './riskToOthers'
import RiskManagementArrangements from './riskManagementArrangements'
import CellShareInformation from './cellShareInformation'
import AdditionalRiskInformation from './additionalRiskInformation'

@Task({
  name: 'Add risk of serious harm (RoSH) information',
  slug: 'risk-of-serious-harm',
  pages: [RiskToOthers, RiskManagementArrangements, CellShareInformation, AdditionalRiskInformation],
})
export default class RiskOfSeriousHarm {}
