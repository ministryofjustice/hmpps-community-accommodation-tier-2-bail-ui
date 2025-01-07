/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import OffendingHistory from './offending-history'
import CommunitySupervisionAndCurrentOffences from './community-supervision-and-current-offences'

@Section({
  title: 'Offence information',
  tasks: [CommunitySupervisionAndCurrentOffences, OffendingHistory],
})
export default class OffenceInformation {}
