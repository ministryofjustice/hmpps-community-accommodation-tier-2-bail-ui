/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import ConfirmConsentPage from './confirmConsent'
import ConsentRefused from './consentRefused'

@Task({
  name: 'Confirm consent to share information',
  slug: 'confirm-consent',
  pages: [ConfirmConsentPage, ConsentRefused],
})
export default class ConfirmConsent {}
