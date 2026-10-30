import { Page } from '../../../utils/decorators'
import BaseCppDetails from '../../offences-and-concerns/add-probation-supervision-details/cppDetails'
import { getQuestions } from '../../../utils/questions'

@Page({
  name: 'backup-contact-details',
  bodyProperties: ['name', 'email', 'telephone'],
})
export default class BackupContactDetails extends BaseCppDetails {
  documentTitle = 'Backup contact details'

  questions = getQuestions(this.personName)['referrer-details']['backup-contact-details']

  title = this.questions.backupContactDetails.question

  contactType = 'backup contact'

  isCpp = this.application.data?.['referrer-details']?.['cpp-check']?.isCpp === 'yes'

  previous() {
    return this.isCpp ? 'contact-number' : 'location'
  }

  next() {
    return ''
  }

  response() {
    return {
      [this.title]: `${this.body.name}\r\n${this.body.telephone}\r\n${this.body.email}`,
    }
  }

  errors() {
    const errors = super.errors()
    delete errors.probationRegion
    return errors
  }
}
