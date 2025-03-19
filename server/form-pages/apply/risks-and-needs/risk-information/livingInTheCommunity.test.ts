import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import LivingInTheCommunity, { LivingInTheCommunityBody } from './livingInTheCommunity'

describe('LivingInTheCommunity', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new LivingInTheCommunity({}, application)

      expect(page.title).toEqual(`Concerns related to Roger Smith living in the community`)
    })
  })

  itShouldHaveNextValue(new LivingInTheCommunity({}, application), 'safety-of-staff')
  itShouldHavePreviousValue(new LivingInTheCommunity({}, application), 'violence-and-arson')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new LivingInTheCommunity({}, application)

      it('includes a validation error for _convictionsRelatedToHateOrAggression_', () => {
        expect(page.errors()).toHaveProperty(
          'convictionsRelatedToHateOrAggression',
          `Select if they have had any convictions or behaviours related to aggression or hate towards others`,
        )
      })

      it('includes a validation error for _victimOfOthers_', () => {
        expect(page.errors()).toHaveProperty(
          'victimOfOthers',
          `Select if they have been a victim of violence, bullying, or intimidation from others`,
        )
      })

      it('includes a validation error for _otherConcerns_', () => {
        expect(page.errors()).toHaveProperty(
          'otherConcerns',
          'Select if there are other concerns with the applicant living in the community',
        )
      })

      it('includes a validation error for _cellSharingRiskAssessment_', () => {
        expect(page.errors()).toHaveProperty(
          'cellSharingRiskAssessment',
          `Select if a Cell Sharing Risk Assessment (CSRA) has been done`,
        )
      })
    })

    describe('when _convictionsRelatedToHateOrAggression_ is YES', () => {
      const page = new LivingInTheCommunity({ convictionsRelatedToHateOrAggression: 'yes' }, application)

      describe('and _convictionsDetail_ is UNANSWERED', () => {
        it('includes a validation error for _convictionsDetail_', () => {
          expect(page.errors()).toHaveProperty(
            'convictionsDetail',
            'Enter the details of convictions or behaviours related to aggression or hate towards others',
          )
        })
      })
    })

    describe('when _victimOfOthers_ is YES', () => {
      const page = new LivingInTheCommunity({ victimOfOthers: 'yes' }, application)

      describe('and _victimOfOthersDetail_ is UNANSWERED', () => {
        it('includes a validation error for _victimOfOthersDetail_', () => {
          expect(page.errors()).toHaveProperty(
            'victimOfOthersDetail',
            'Enter the details about the applicant being a victim of violence, bullying, or intimidation',
          )
        })
      })
    })

    describe('when _otherConcerns_ is YES', () => {
      const page = new LivingInTheCommunity({ otherConcerns: 'yes' }, application)

      describe('and _otherConcernsDetail_ is UNANSWERED', () => {
        it('includes a validation error for _otherConcernsDetail_', () => {
          expect(page.errors()).toHaveProperty('otherConcernsDetail', 'Enter details of current concerns')
        })
      })
    })

    describe('when _cellSharingRiskAssessment_ is YES', () => {
      const page = new LivingInTheCommunity({ cellSharingRiskAssessment: 'yes' }, application)

      describe('and _cellSharingRiskAssessmentDetail_ is UNANSWERED', () => {
        it('includes a validation error for _cellSharingRiskAssessmentDetail_', () => {
          expect(page.errors()).toHaveProperty(
            'cellSharingRiskAssessmentDetail',
            'Enter the concerns around sharing communal areas',
          )
        })
      })
    })
  })

  describe('onSave', () => {
    describe('when _convictionsRelatedToHateOrAggression_ is NO', () => {
      it('removes convictionsDetail answer', () => {
        const body: Partial<LivingInTheCommunityBody> = {
          convictionsRelatedToHateOrAggression: 'no',
          convictionsDetail: 'some details',
        }

        const page = new LivingInTheCommunity(body, application)

        page.onSave()

        expect(page.body).toEqual({
          convictionsRelatedToHateOrAggression: 'no',
        })
      })
    })

    describe('when _victimOfOthers_ is NO', () => {
      it('removes victimOfOthersDetail answer', () => {
        const body: Partial<LivingInTheCommunityBody> = {
          victimOfOthers: 'no',
          victimOfOthersDetail: 'some details',
        }

        const page = new LivingInTheCommunity(body, application)

        page.onSave()

        expect(page.body).toEqual({
          victimOfOthers: 'no',
        })
      })
    })

    describe('when _otherConcerns_ is NO', () => {
      it('removes otherConcernsDetail answer', () => {
        const body: Partial<LivingInTheCommunityBody> = {
          otherConcerns: 'no',
          otherConcernsDetail: 'some details',
        }

        const page = new LivingInTheCommunity(body, application)

        page.onSave()

        expect(page.body).toEqual({
          otherConcerns: 'no',
        })
      })
    })

    describe('when _cellSharingRiskAssessment_ is NO', () => {
      it('removes cellSharingRiskAssessmentDetail answer', () => {
        const body: Partial<LivingInTheCommunityBody> = {
          cellSharingRiskAssessment: 'no',
          cellSharingRiskAssessmentDetail: 'some details',
        }

        const page = new LivingInTheCommunity(body, application)

        page.onSave()

        expect(page.body).toEqual({
          cellSharingRiskAssessment: 'no',
        })
      })
    })
  })
})
