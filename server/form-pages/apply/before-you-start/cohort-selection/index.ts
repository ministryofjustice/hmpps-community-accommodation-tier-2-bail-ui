/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import CohortSelection from './cohortSelection'

@Task({
  name: 'Type of application',
  slug: 'cohort-selection',
  pages: [CohortSelection],
})
export default class CohortSelectionTask {}
