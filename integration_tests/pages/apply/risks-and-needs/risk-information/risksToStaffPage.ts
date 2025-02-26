import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class RisksToStaffPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Risks to staff', application, 'risk-information', 'risks-to-staff')
  }
}
