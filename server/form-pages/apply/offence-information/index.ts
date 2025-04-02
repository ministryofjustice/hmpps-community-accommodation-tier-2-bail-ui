/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import PreviousUnspentConvictions from './previous-unspent-convictions'
import CommunitySupervisionAndCurrentOffences from './community-supervision-and-current-offences'
import AllegedOffences from './alleged-offences'

@Section({
  title: 'Offence information',
  tasks: [AllegedOffences, CommunitySupervisionAndCurrentOffences, PreviousUnspentConvictions],
})
export default class OffenceInformation {}
