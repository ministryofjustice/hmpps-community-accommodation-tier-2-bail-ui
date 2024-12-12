/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import OffendingHistory from './offending-history'
import CurrentOffences from './current-offences'

@Section({
  title: 'Offence information',
  tasks: [CurrentOffences, OffendingHistory],
})
export default class OffenceInformation {}
