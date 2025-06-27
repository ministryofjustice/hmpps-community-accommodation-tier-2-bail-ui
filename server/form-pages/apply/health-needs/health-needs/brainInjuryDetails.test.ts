import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import BrainInjuryDetails, { BrainInjuryDetailsBody } from './brainInjuryDetails'

describe('BrainInjuryDetails', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    itShouldHaveNextValue(new BrainInjuryDetails({}, application), 'other-health')
    itShouldHavePreviousValue(new BrainInjuryDetails({}, application), 'brain-injury')

    describe('errors', () => {
      describe('when top-level questions are unanswered', () => {
        const page = new BrainInjuryDetails({}, application)

        it('includes a validation error for _supportNeeded_', () => {
          expect(page.errors()).toHaveProperty('supportNeeded', `Select yes if they need any support`)
        })

        it('includes a validation error for _receivingTreatment_', () => {
          expect(page.errors()).toHaveProperty(
            'receivingTreatment',
            `Select yes if they receive any treatment or medication`,
          )
        })

        it('includes a validation error for _isVulnerable_', () => {
          expect(page.errors()).toHaveProperty('isVulnerable', `Select yes if they are vulnerable`)
        })

        it('includes a validation error for _hasDifficultyInteracting_', () => {
          expect(page.errors()).toHaveProperty(
            'hasDifficultyInteracting',
            `Select yes if they have difficulties interacting with other people`,
          )
        })
      })

      describe('when _injuryDetail_ is UNANSWERED', () => {
        const page = new BrainInjuryDetails({}, application)

        it('includes a validation error for _injuryDetail_', () => {
          expect(page.errors()).toHaveProperty('injuryDetail', 'Enter details of their brain injury')
        })
      })

      describe('when _supportNeeded_ is YES', () => {
        const page = new BrainInjuryDetails({ supportNeeded: 'yes' }, application)

        describe('and _supportDetail_ is UNANSWERED', () => {
          it('includes a validation error for _supportDetail_', () => {
            expect(page.errors()).toHaveProperty('supportDetail', 'Enter the type of support needed')
          })
        })
      })

      describe('when _receivingTreatment_ is YES', () => {
        const page = new BrainInjuryDetails({ receivingTreatment: 'yes' }, application)

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
        const page = new BrainInjuryDetails({ isVulnerable: 'yes' }, application)

        describe('and _vulnerabilityDetail_ is UNANSWERED', () => {
          it('includes a validation error for _vulnerabilityDetail_', () => {
            expect(page.errors()).toHaveProperty('vulnerabilityDetail', 'Enter how they are vulnerable')
          })
        })
      })

      describe('when _hasDifficultyInteracting_ is YES', () => {
        const page = new BrainInjuryDetails({ hasDifficultyInteracting: 'yes' }, application)

        describe('and _interactionDetail_ is UNANSWERED', () => {
          it('includes a validation error for _interactionDetail_', () => {
            expect(page.errors()).toHaveProperty('interactionDetail', 'Enter the type of difficulties they have')
          })
        })
      })
    })

    describe('onSave', () => {
      it('removes support data when the question is set to "no"', () => {
        const body: Partial<BrainInjuryDetailsBody> = {
          supportNeeded: 'no',
          supportDetail: 'Support detail',
        }

        const page = new BrainInjuryDetails(body, application)

        page.onSave()

        expect(page.body).toEqual({
          supportNeeded: 'no',
        })
      })

      it('removes treatment data when the question is set to "no"', () => {
        const body: Partial<BrainInjuryDetailsBody> = {
          receivingTreatment: 'no',
          treatmentDetail: 'Treatment detail',
        }

        const page = new BrainInjuryDetails(body, application)

        page.onSave()

        expect(page.body).toEqual({
          receivingTreatment: 'no',
        })
      })

      it('removes vulnerability data when the question is set to "no"', () => {
        const body: Partial<BrainInjuryDetailsBody> = {
          isVulnerable: 'no',
          vulnerabilityDetail: 'Vulnerability detail',
        }

        const page = new BrainInjuryDetails(body, application)

        page.onSave()

        expect(page.body).toEqual({
          isVulnerable: 'no',
        })
      })

      it('removes interaction difficulty data when the question is set to "no"', () => {
        const body: Partial<BrainInjuryDetailsBody> = {
          hasDifficultyInteracting: 'no',
          interactionDetail: 'Interaction detail',
        }

        const page = new BrainInjuryDetails(body, application)

        page.onSave()

        expect(page.body).toEqual({
          hasDifficultyInteracting: 'no',
        })
      })
    })
  })

  describe('response', () => {
    it('returns an empty object', () => {
      const body: BrainInjuryDetailsBody = {
        injuryDetail: 'some injury details',
        supportNeeded: 'yes',
        supportDetail: 'some support detail',
        receivingTreatment: 'yes',
        treatmentDetail: 'some treatment detail',
        isVulnerable: 'yes',
        vulnerabilityDetail: 'some vulnerability detail',
        hasDifficultyInteracting: 'yes',
        interactionDetail: 'some interaction detail',
      }

      const page = new BrainInjuryDetails(body, application)

      expect(page.response()).toEqual({})
    })
  })
})
