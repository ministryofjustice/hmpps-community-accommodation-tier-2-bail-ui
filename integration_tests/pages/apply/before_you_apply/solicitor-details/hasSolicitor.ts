import { Cas2v2Application, FullPerson } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class HasSolicitorPage extends ApplyPage {
  constructor(application: Cas2v2Application) {
    const person = application.person as FullPerson
    super(`Does ${person.name} have a solicitor?`, application, 'solicitor-details', 'has-solicitor')
  }
}
