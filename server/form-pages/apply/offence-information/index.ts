/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import PreviousUnspentConvictions from './previous-unspent-convictions'
import CommunitySupervisionAndCurrentOffences from './community-supervision-and-current-offences'
import AllegedOffences from './alleged-offences'
import ProvideOffencesAndConvictionsDetails from './provide-offences-and-convictions-details'

@Section({
  title: 'Offence information',
  tasks: [
    ProvideOffencesAndConvictionsDetails,
    AllegedOffences,
    CommunitySupervisionAndCurrentOffences,
    PreviousUnspentConvictions,
  ],
})
export default class OffenceInformation {}
