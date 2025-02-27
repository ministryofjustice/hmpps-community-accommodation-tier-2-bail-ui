import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class AdditionalConcernsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Additional concerns', application, 'risk-information', 'additional-concerns')
  }
}
