/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import ContactInformation from './contactInformation'
import HasSolicitor from './hasSolicitor'
import ConsultSolicitor from './consultSolicitor'

@Task({
  name: 'Add solicitor details',
  slug: 'solicitor-details',
  pages: [HasSolicitor, ContactInformation, ConsultSolicitor],
})
export default class SolicitorDetails {}
