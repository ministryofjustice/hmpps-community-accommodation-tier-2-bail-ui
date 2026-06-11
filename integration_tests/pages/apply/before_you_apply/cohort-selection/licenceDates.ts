import { Cas2CohortDto, Cas2v2Application, Cas2v2Application as Application, FullPerson } from '@approved-premises/api'
import { faker } from '@faker-js/faker'
import ApplyPage from '../../applyPage'
import { DateFormats } from '../../../../../server/utils/dateUtils'

export default class LicenceDatesPage extends ApplyPage {
  constructor(application: Application) {
    super(`${(application.person as FullPerson).name}'s licence`, application, 'cohort-selection', 'licence-dates')
  }

  licenceStartDate = faker.date.soon({ days: 200 })

  licenceEndDate = faker.date.soon({ refDate: this.licenceStartDate, days: 200 })

  completeForm(cohort: Cas2CohortDto): void {
    if (cohort !== 'rarr')
      this.completeDateInputs('licenceStartDate', DateFormats.dateObjToIsoDate(this.licenceStartDate))
    this.completeDateInputs('licenceEndDate', DateFormats.dateObjToIsoDate(this.licenceEndDate))
    if (cohort === 'atcr') {
      this.checkRadioByNameAndValue('hasHdcExpiryDate', 'yes')
      this.completeDateInputs('hdcExpiryDate', DateFormats.dateObjToIsoDate(this.licenceEndDate))
    }
  }

  checkDate(body, key: string, date: Date) {
    expect(body[`${key}-day`]).to.equal(date.getDate().toString())
    expect(body[`${key}-month`]).to.equal((date.getMonth() + 1).toString())
    expect(body[`${key}-year`]).to.equal(date.getFullYear().toString())
  }

  shouldSeeErrrors = (cohort: Cas2CohortDto) => {
    if (cohort !== 'rarr') this.shouldShowErrorSummary('Licence start date must be entered')
    this.shouldShowErrorSummary('Licence end date must be entered')
    if (cohort === 'atcr') this.shouldShowErrorSummary('Select yes if they have a HDC expiry date')
    else this.shouldNotShowErrorSummary('Select yes if they have a HDC expiry date')
  }

  verifyUpdate(application: Cas2v2Application) {
    cy.task('verifyApplicationUpdate', application.id).then(updates => {
      const lastUpdate = updates[(updates as Array<unknown>).length - 1]

      const licenceDates = JSON.parse(lastUpdate.body).data['cohort-selection']['licence-dates']
      if (application.cohort !== 'rarr') this.checkDate(licenceDates, 'licenceStartDate', this.licenceStartDate)
      this.checkDate(licenceDates, 'licenceEndDate', this.licenceEndDate)
    })
  }
}
