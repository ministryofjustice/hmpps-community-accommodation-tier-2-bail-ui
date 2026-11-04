import { Cas2Application, Cas2Application as Application } from '@approved-premises/api'
import { faker } from '@faker-js/faker'
import ApplyPage from '../../applyPage'
import { DateFormats } from '../../../../../server/utils/dateUtils'

export default class AccommodationStartDatePage extends ApplyPage {
  constructor(application: Application) {
    super('What date is accommodation required from?', application, 'cohort-selection', 'accommodation-start-date')
  }

  accommodationStartDate = faker.date.soon({ days: 200 })

  completeForm(): void {
    this.completeDateInputs('accommodationStartDate', DateFormats.dateObjToIsoDate(this.accommodationStartDate))
  }

  checkDate(body, key: string, date: Date) {
    expect(body[`${key}-day`]).to.equal(date.getDate().toString())
    expect(body[`${key}-month`]).to.equal((date.getMonth() + 1).toString())
    expect(body[`${key}-year`]).to.equal(date.getFullYear().toString())
  }

  verifyUpdate(application: Cas2Application) {
    cy.task('verifyApplicationUpdate', application.id).then(updates => {
      const lastUpdate = updates[(updates as Array<unknown>).length - 1]

      const accommodationStartDate = JSON.parse(lastUpdate.body).data['cohort-selection']['accommodation-start-date']
      this.checkDate(accommodationStartDate, 'accommodationStartDate', this.accommodationStartDate)
    })
  }
}
