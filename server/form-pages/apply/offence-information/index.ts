/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import PreviousUnspentConvictions from './previous-unspent-convictions'
import AddProbationSupervisionDetails from './add-probation-supervision-details'
import AllegedOffences from './alleged-offences'
import ProvideOffencesAndConvictionsDetails from './provide-offences-and-convictions-details'

@Section({
  title: 'Offence information',
  tasks: [
    ProvideOffencesAndConvictionsDetails,
    AllegedOffences,
    AddProbationSupervisionDetails,
    PreviousUnspentConvictions,
  ],
})
export default class OffenceInformation {}
