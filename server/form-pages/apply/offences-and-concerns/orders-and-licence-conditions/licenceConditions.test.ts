import { YesNoOrDontKnow } from '@approved-premises/ui'
import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import LicenceConditions from './licenceConditions'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'

describe('LicenceConditions', () => {
  const bailApplication = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })
  const nonBailApplication = applicationFactory.newCohort().build()

  const licenceConditions = new LicenceConditions({}, bailApplication)

  describe('Routes', () => {
    itShouldHaveNextValue(licenceConditions, 'orders')
    itShouldHavePreviousValue(licenceConditions, 'taskList')
  })

  describe('errors', () => {
    it('returns an error if contact number is missing', () => {
      expect(licenceConditions.errors()).toEqual({
        hasLicenceConditions: 'Select yes if they have any non-standard licence conditions',
      })
    })
  })

  describe('isApplicable', () => {
    it('is only applicable for non-bail chorts', () => {
      expect(new LicenceConditions({}, nonBailApplication).isApplicable()).toEqual(true)

      expect(new LicenceConditions({}, bailApplication).isApplicable()).toEqual(false)
    })
  })

  describe('onSave', () => {
    it('Clears unused notes', () => {
      const body = {
        hasLicenceConditions: 'no' as YesNoOrDontKnow,
        notes: 'lorem ipsum',
      }
      const page = new LicenceConditions(body, nonBailApplication)

      expect(page.body).toEqual(body)
      page.onSave()
      expect(page.body).toEqual({ hasLicenceConditions: 'no' })
    })
  })
})
