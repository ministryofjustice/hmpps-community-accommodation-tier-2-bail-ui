import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import BrainInjury, { BrainInjuryBody } from './brainInjury'

describe('BrainInjury', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    itShouldHaveNextValue(new BrainInjury({}, application), 'other-health')
    itShouldHavePreviousValue(new BrainInjury({}, application), 'learning-difficulties')

    describe('errors', () => {
      describe('when top-level questions are unanswered', () => {
        const page = new BrainInjury({}, application)

        it('includes a validation error for _hasBrainInjury_', () => {
          expect(page.errors()).toHaveProperty(
            'hasBrainInjury',
            `Select if they have a brain injury, or select 'I do not know'`,
          )
        })

        it('includes a validation error for _supportNeeded_', () => {
          expect(page.errors()).toHaveProperty(
            'supportNeeded',
            `Select if they need any support, or select 'I do not know'`,
          )
        })

        it('includes a validation error for _receivingTreatment_', () => {
          expect(page.errors()).toHaveProperty(
            'receivingTreatment',
            `Select if they receive any treatment or medication, or select 'I do not know'`,
          )
        })

        it('includes a validation error for _isVulnerable_', () => {
          expect(page.errors()).toHaveProperty(
            'isVulnerable',
            `Select if they are vulnerable, or select 'I do not know'`,
          )
        })

        it('includes a validation error for _hasDifficultyInteracting_', () => {
          expect(page.errors()).toHaveProperty(
            'hasDifficultyInteracting',
            `Select if they have difficulties interacting with other people, or select 'I do not know'`,
          )
        })
      })

      describe('when _hasBrainInjury_ is YES', () => {
        const page = new BrainInjury({ hasBrainInjury: 'yes' }, application)

        describe('and _injuryDetail_ is UNANSWERED', () => {
          it('includes a validation error for _injuryDetail_', () => {
            expect(page.errors()).toHaveProperty('injuryDetail', 'Enter details of their brain injury and needs')
          })
        })
      })

      describe('when _supportNeeded_ is YES', () => {
        const page = new BrainInjury({ supportNeeded: 'yes' }, application)

        describe('and _supportDetail_ is UNANSWERED', () => {
          it('includes a validation error for _supportDetail_', () => {
            expect(page.errors()).toHaveProperty('supportDetail', 'Enter the type of support needed')
          })
        })
      })

      describe('when _receivingTreatment_ is YES', () => {
        const page = new BrainInjury({ receivingTreatment: 'yes' }, application)

        describe('and _treatmentDetail_ is UNANSWERED', () => {
          it('includes a validation error for _treatmentDetail_', () => {
            expect(page.errors()).toHaveProperty(
              'treatmentDetail',
              'Enter details about their treatment and medication',
            )
          })
        })
      })

      describe('when _isVulnerable_ is YES', () => {
        const page = new BrainInjury({ isVulnerable: 'yes' }, application)

        describe('and _vulnerabilityDetail_ is UNANSWERED', () => {
          it('includes a validation error for _vulnerabilityDetail_', () => {
            expect(page.errors()).toHaveProperty('vulnerabilityDetail', 'Enter how they are vulnerable')
          })
        })
      })

      describe('when _hasDifficultyInteracting_ is YES', () => {
        const page = new BrainInjury({ hasDifficultyInteracting: 'yes' }, application)

        describe('and _interactionDetail_ is UNANSWERED', () => {
          it('includes a validation error for _interactionDetail_', () => {
            expect(page.errors()).toHaveProperty('interactionDetail', 'Enter the type of difficulties they have')
          })
        })
      })
    })

    describe('onSave', () => {
      it('removes brain injury data when the question is set to "no"', () => {
        const body: Partial<BrainInjuryBody> = {
          hasBrainInjury: 'no',
          injuryDetail: 'Injury detail',
        }

        const page = new BrainInjury(body, application)

        page.onSave()

        expect(page.body).toEqual({
          hasBrainInjury: 'no',
        })
      })

      it('removes support data when the question is set to "no"', () => {
        const body: Partial<BrainInjuryBody> = {
          supportNeeded: 'no',
          supportDetail: 'Support detail',
        }

        const page = new BrainInjury(body, application)

        page.onSave()

        expect(page.body).toEqual({
          supportNeeded: 'no',
        })
      })

      it('removes treatment data when the question is set to "no"', () => {
        const body: Partial<BrainInjuryBody> = {
          receivingTreatment: 'no',
          treatmentDetail: 'Treatment detail',
        }

        const page = new BrainInjury(body, application)

        page.onSave()

        expect(page.body).toEqual({
          receivingTreatment: 'no',
        })
      })

      it('removes vulnerability data when the question is set to "no"', () => {
        const body: Partial<BrainInjuryBody> = {
          isVulnerable: 'no',
          vulnerabilityDetail: 'Vulnerability detail',
        }

        const page = new BrainInjury(body, application)

        page.onSave()

        expect(page.body).toEqual({
          isVulnerable: 'no',
        })
      })

      it('removes interaction difficulty data when the question is set to "no"', () => {
        const body: Partial<BrainInjuryBody> = {
          hasDifficultyInteracting: 'no',
          interactionDetail: 'Interaction detail',
        }

        const page = new BrainInjury(body, application)

        page.onSave()

        expect(page.body).toEqual({
          hasDifficultyInteracting: 'no',
        })
      })
    })
  })
})
