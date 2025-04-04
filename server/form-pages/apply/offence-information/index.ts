/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import OffendingHistory from './offending-history'
import CommunitySupervisionAndCurrentOffences from './community-supervision-and-current-offences'
import AllegedOffences from './alleged-offences'
import ProvideOffencesAndConvictionsDetails from './provide-offences-and-convictions-details'

@Section({
  title: 'Offence information',
  tasks: [
    ProvideOffencesAndConvictionsDetails,
    AllegedOffences,
    CommunitySupervisionAndCurrentOffences,
    OffendingHistory,
  ],
})
export default class OffenceInformation {}
