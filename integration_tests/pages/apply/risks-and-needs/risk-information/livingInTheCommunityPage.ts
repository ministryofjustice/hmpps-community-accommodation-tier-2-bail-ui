import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class LivingInTheCommunityPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Living in the community', application, 'risk-information', 'living-in-the-community')
  }
}
