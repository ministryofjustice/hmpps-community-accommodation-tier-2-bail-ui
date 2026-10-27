import { Page } from '../../../utils/decorators'
import BaseCppDetails from '../../offences-and-concerns/add-probation-supervision-details/cppDetails'
import { getQuestions } from '../../../utils/questions'

@Page({
  name: 'community-probation-practitioner-details',
  bodyProperties: ['name', 'probationRegion', 'email', 'telephone'],
})
export default class CPPDetails extends BaseCppDetails {
  previous() {
    return 'cpp-check'
  }

  next() {
    return 'job-title'
  }

  response() {
    const { question } = getQuestions(this.personName)['referrer-details']['community-probation-practitioner-details']
      .cppDetails

    return {
      [question]: `${this.body.name}\r\nProbation region: ${this.body.probationRegion}\r\n${this.body.telephone}\r\n${this.body.email}`,
    }
  }
}
