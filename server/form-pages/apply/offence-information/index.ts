/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import OffendingHistory from './offending-history'
import CommunitySupervisionAndCurrentOffences from './community-supervision-and-current-offences'
import AllegedOffences from './alleged-offences'

@Section({
  title: 'Offence information',
  tasks: [AllegedOffences, CommunitySupervisionAndCurrentOffences, OffendingHistory],
})
export default class OffenceInformation {}
