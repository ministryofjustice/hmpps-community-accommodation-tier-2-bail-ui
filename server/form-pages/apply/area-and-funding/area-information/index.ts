/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import FirstPreferredArea from './firstPreferredArea'
import SecondPreferredArea from './secondPreferredArea'
import ExclusionZones from './exclusionZones'
import GangAffiliations from './gangAffiliations'
import FamilyAccommodation from './familyAccommodation'
import OtherAreaPreferences from './otherAreaPreferences'

@Task({
  name: 'Add exclusion zones and preferred areas',
  slug: 'area-information',
  pages: [
    FirstPreferredArea,
    SecondPreferredArea,
    OtherAreaPreferences,
    ExclusionZones,
    GangAffiliations,
    FamilyAccommodation,
  ],
})
export default class AreaInformation {}
