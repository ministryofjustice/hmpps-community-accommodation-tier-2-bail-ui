/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import HealthNeedsTask from './health-needs'
import RiskToSelf from './risk-to-self'
import RisksOfSeriousHarmToOthersTask from './risks-of-serious-harm-to-others'

@Section({
  title: 'Risk and health needs',
  tasks: [HealthNeedsTask, RiskToSelf, RisksOfSeriousHarmToOthersTask],
})
export default class HealthNeeds {}
