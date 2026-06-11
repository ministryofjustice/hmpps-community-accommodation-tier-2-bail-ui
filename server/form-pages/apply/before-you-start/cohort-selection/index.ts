/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import CohortSelection from './cohortSelection'
import LicenceDatesNeeded from './licence-dates-needed'
import LicenceDates from './licence-dates'

@Task({
  name: 'Type of application and licence details',
  slug: 'cohort-selection',
  pages: [CohortSelection, LicenceDatesNeeded, LicenceDates],
})
export default class CohortSelectionTask {}
