import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import SubstanceMisuse, { SubstanceMisuseBody } from './substanceMisuse'

describe('SubstanceMisuse', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new SubstanceMisuse({}, application)

      expect(page.title).toEqual('Substance misuse needs details for Roger Smith')
    })
  })

  itShouldHaveNextValue(new SubstanceMisuse({}, application), 'physical-health')
  itShouldHavePreviousValue(new SubstanceMisuse({}, application), 'health-needs-information')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new SubstanceMisuse({}, application)

      it('includes a validation error for _substanceAndAlcoholUse_', () => {
        expect(page.errors()).toHaveProperty(
          'substanceAndAlcoholUse',
          'Select if they have any issues related to substance and alcohol use',
        )
      })

      it('includes a validation error for _requiresSubstituteMedication_', () => {
        expect(page.errors()).toHaveProperty(
          'requiresSubstituteMedication',
          'Select if they require any substitute medication',
        )
      })

      it('includes a validation error for _engagedWithDrugAndAlcoholService_', () => {
        expect(page.errors()).toHaveProperty(
          'engagedWithDrugAndAlcoholService',
          'Select if they are engaged with a drug and alcohol service, or if awaiting an assessment',
        )
      })

      it('includes a validation error for _intentToReferToService_', () => {
        expect(page.errors()).toHaveProperty(
          'intentToReferToService',
          'Select if there is an intention to refer them to a drug and alcohol service, or if they are not in prison custody',
        )
      })

      it('includes a validation error for _releasedWithNaloxone_', () => {
        expect(page.errors()).toHaveProperty(
          'releasedWithNaloxone',
          'Select if they are being released with naloxone, or if they are not in prison custody',
        )
      })
    })

    describe('when _substanceAndAlcoholUse_ is YES', () => {
      const page = new SubstanceMisuse({ substanceAndAlcoholUse: 'yes' }, application)

      describe('and _substanceAndAlcoholUseDetail_ is UNANSWERED', () => {
        it('includes a validation error for _substanceAndAlcoholUseDetail_', () => {
          expect(page.errors()).toHaveProperty('substanceAndAlcoholUseDetail', 'Enter details of their issues')
        })
      })
    })

    describe('when _requiresSubstituteMedication_ is YES', () => {
      const page = new SubstanceMisuse({ requiresSubstituteMedication: 'yes' }, application)

      describe('and _substituteMedicationDetail_ is UNANSWERED', () => {
        it('includes a validation error for _substituteMedicationDetail_', () => {
          expect(page.errors()).toHaveProperty(
            'substituteMedicationDetail',
            'Enter the substitute medication they take',
          )
        })
      })
    })

    describe('when _engagedWithDrugAndAlcoholService_ is YES', () => {
      const page = new SubstanceMisuse({ engagedWithDrugAndAlcoholService: 'yes' }, application)

      describe('and _serviceDetails_ is UNANSWERED', () => {
        it('includes a validation error for _serviceDetails_', () => {
          expect(page.errors()).toHaveProperty('serviceDetails', 'Enter the drug and alcohol service')
        })
      })
    })
  })

  describe('onSave', () => {
    it('removes substance and alcohol use data if answer is no', () => {
      const body: Partial<SubstanceMisuseBody> = {
        substanceAndAlcoholUse: 'no',
        substanceAndAlcoholUseDetail: 'Substance misuse',
      }

      const page = new SubstanceMisuse(body, application)

      page.onSave()

      expect(page.body).toEqual({
        substanceAndAlcoholUse: 'no',
      })
    })

    it('removes substitute medical data if answer is no', () => {
      const body: Partial<SubstanceMisuseBody> = {
        requiresSubstituteMedication: 'no',
        substituteMedicationDetail: 'Substitute medical detail',
      }

      const page = new SubstanceMisuse(body, application)

      page.onSave()

      expect(page.body).toEqual({
        requiresSubstituteMedication: 'no',
      })
    })

    it('removes drug and alcohol service data if answer is no', () => {
      const body: Partial<SubstanceMisuseBody> = {
        engagedWithDrugAndAlcoholService: 'no',
        serviceDetails: 'service details',
      }

      const page = new SubstanceMisuse(body, application)

      page.onSave()

      expect(page.body).toEqual({
        engagedWithDrugAndAlcoholService: 'no',
      })
    })
  })
})
