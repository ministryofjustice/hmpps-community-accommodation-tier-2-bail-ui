import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class ConcernsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Concerns', application, 'risk-information', 'concerns')
  }
}
