import { Cas2Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class SolicitorDetailsPage extends ApplyPage {
  constructor(application: Cas2Application) {
    super(`Add solicitor's contact information`, application, 'solicitor-details', 'contact-information')
  }

  populateForm(contactInformation: {
    fullName: string
    legalFirmAddress: string
    emailAddress: string
    phoneNumber: string
  }): void {
    this.getTextInputByLabelAndEnterDetails('Full name', contactInformation.fullName)
    this.getTextInputByLabelAndEnterDetails('Legal firm address', contactInformation.legalFirmAddress)
    this.getTextInputByLabelAndEnterDetails('Email address', contactInformation.emailAddress)
    this.getTextInputByLabelAndEnterDetails('Phone number', contactInformation.phoneNumber)
  }
}
