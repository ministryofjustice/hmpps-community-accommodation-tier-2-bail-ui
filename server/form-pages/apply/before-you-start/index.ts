/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import ConfirmEligibility from './confirm-eligibility'
import ConfirmConsent from './confirm-consent'
import ReferrerDetails from './referrer-details'
import SolicitorDetails from './solicitor-details'
import CohortSelection from './cohort-selection'

@Section({
  title: 'Before you apply',
  tasks: [ConfirmEligibility, ConfirmConsent, CohortSelection, ReferrerDetails, SolicitorDetails],
})
export default class BeforeYouStart {}
