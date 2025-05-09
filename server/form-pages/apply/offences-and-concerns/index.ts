/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import PreviousUnspentConvictions from './previous-unspent-convictions'
import AddProbationSupervisionDetails from './add-probation-supervision-details'
import AllegedOffences from './alleged-offences'
import ProvideOffencesAndConvictionsDetails from './provide-offences-and-convictions-details'
import RiskInformation from './risk-information'

@Section({
  title: 'Offences and concerns',
  tasks: [
    ProvideOffencesAndConvictionsDetails,
    AllegedOffences,
    PreviousUnspentConvictions,
    AddProbationSupervisionDetails,
    RiskInformation,
  ],
})
export default class OffencesAndConcerns {}
