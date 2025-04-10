import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import OASysRiskAssessment from './oasysRiskAssessment'

describe('OASysRiskAssessment', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new OASysRiskAssessment({}, application)

      expect(page.title).toEqual('Has an OASys risk assessment been done in the last two years?')
    })
  })

  describe('when a risk assessment has been done and OASys has been updated', () => {
    itShouldHaveNextValue(
      new OASysRiskAssessment({ riskAssessment: 'yes', oasysHasBeenUpdated: 'yes' }, application),
      '',
    )
  })

  describe('when a risk assessment has been done and OASys has not been updated', () => {
    itShouldHaveNextValue(
      new OASysRiskAssessment({ riskAssessment: 'yes', oasysHasBeenUpdated: 'no' }, application),
      '',
    )
  })

  describe('when a risk assessment has not been done', () => {
    itShouldHaveNextValue(new OASysRiskAssessment({ riskAssessment: 'no' }, application), '')
  })

  itShouldHavePreviousValue(new OASysRiskAssessment({}, application), 'community-probation-practitioner-details')

  describe('errors', () => {
    describe('when they have not provided an answer for risk assessment', () => {
      it('returns errors', () => {
        const page = new OASysRiskAssessment({}, application)
        expect(page.errors()).toEqual({
          riskAssessment: 'Select if an OASys risk assessment has been done in the last two years',
        })
      })
    })

    describe('when the answer for risk assessment is "yes" but follow-up is unanswered', () => {
      it('returns errors', () => {
        const page = new OASysRiskAssessment(
          {
            riskAssessment: 'yes',
          },
          application,
        )
        expect(page.errors()).toEqual({
          oasysHasBeenUpdated: 'Select if an OASys risk assessment has been updated',
        })
      })
    })
  })

  describe('onSave', () => {
    describe('when riskAssessment is not _yes_', () => {
      it('removes answer for _oasysHasBeenUpdated_', () => {
        const page = new OASysRiskAssessment(
          {
            riskAssessment: 'no',
            oasysHasBeenUpdated: 'yes',
          },
          application,
        )

        page.onSave()

        expect(page.body).toEqual({
          riskAssessment: 'no',
        })
      })
    })
  })
})
