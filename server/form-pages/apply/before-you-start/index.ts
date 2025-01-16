/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import ConfirmEligibility from './confirm-eligibility'
import ConfirmConsent from './confirm-consent'
import ReferrerDetails from './referrer-details'
import SolicitorDetails from './solicitor-details'

@Section({
  title: 'Before you apply',
  tasks: [ConfirmEligibility, ConfirmConsent, ReferrerDetails, SolicitorDetails],
})
export default class BeforeYouStart {}
