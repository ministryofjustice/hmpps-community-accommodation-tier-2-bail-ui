import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class SafetyOfStaffPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Safety of staff', application, 'risk-information', 'safety-of-staff')
  }
}
