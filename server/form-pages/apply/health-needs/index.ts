/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import HealthNeedsTask from './health-needs'

@Section({
  title: 'Health needs',
  tasks: [HealthNeedsTask],
})
export default class HealthNeeds {}
