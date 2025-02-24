/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import ContactInformation from './contactInformation'
import HasSolicitor from './hasSolicitor'

@Task({
  name: 'Add solicitor details',
  slug: 'solicitor-details',
  pages: [HasSolicitor, ContactInformation],
})
export default class SolicitorDetails {}
