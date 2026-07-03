/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import HealthNeedsTask from './health-needs'
import RiskToSelf from './risk-to-self'

@Section({
  title: 'Health needs',
  tasks: [HealthNeedsTask, RiskToSelf],
})
export default class HealthNeeds {}
