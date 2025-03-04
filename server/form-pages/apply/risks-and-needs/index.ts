/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import HealthNeeds from './health-needs'
import RiskInformation from './risk-information'

@Section({
  title: 'Risks and needs',
  tasks: [HealthNeeds, RiskInformation],
})
export default class RisksAndNeeds {}
