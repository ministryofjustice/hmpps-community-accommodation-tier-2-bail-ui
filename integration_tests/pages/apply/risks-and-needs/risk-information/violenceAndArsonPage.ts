import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class ViolenceAndArsonPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Violence and arson', application, 'risk-information', 'violence-and-arson')
  }
}
