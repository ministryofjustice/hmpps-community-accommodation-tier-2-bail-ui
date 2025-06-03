import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import MentalHealth, { MentalHealthBody } from './mentalHealth'

describe('MentalHealth', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new MentalHealth({}, application)

      expect(page.title).toEqual('Mental health needs details for Roger Smith')
    })
  })

  itShouldHaveNextValue(new MentalHealth({}, application), 'communication-and-language-relevance-check')
  itShouldHavePreviousValue(new MentalHealth({}, application), 'physical-health')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new MentalHealth({}, application)

      it('includes a validation error for _hasMentalHealthNeeds_', () => {
        expect(page.errors()).toHaveProperty('hasMentalHealthNeeds', 'Select if they have any mental health needs')
      })

      it('includes a validation error for _hasSupportNeeds_', () => {
        expect(page.errors()).toHaveProperty('hasSupportNeeds', 'Select if they need any support')
      })

      it('includes a validation error for _receivesTreatment_', () => {
        expect(page.errors()).toHaveProperty('receivesTreatment', 'Select if they receive any treatment')
      })

      it('includes a validation error for _isEngagedWithService_', () => {
        expect(page.errors()).toHaveProperty(
          'isEngagedWithService',
          'Select if they are engaged with a mental health service, or if awaiting an assessment',
        )
      })

      it('includes a validation error for _willReferralBeMade_', () => {
        expect(page.errors()).toHaveProperty(
          'willReferralBeMade',
          'Select if a referral for support will be made, or if they are not in prison custody',
        )
      })
    })

    describe('when _hasMentalHealthNeeds_ is YES', () => {
      const page = new MentalHealth({ hasMentalHealthNeeds: 'yes' }, application)

      describe('and _needsDetail_ is UNANSWERED', () => {
        it('includes a validation error for _needsDetail_', () => {
          expect(page.errors()).toHaveProperty('needsDetail', 'Enter details of their needs')
        })
      })
    })

    describe('when _hasSupportNeeds_ is YES', () => {
      const page = new MentalHealth({ hasSupportNeeds: 'yes' }, application)

      describe('and _supportNeedsDetail_ is UNANSWERED', () => {
        it('includes a validation error for _supportNeedsDetail_', () => {
          expect(page.errors()).toHaveProperty('supportNeedsDetail', 'Enter the type of support needed')
        })
      })
    })

    describe('when _receivesTreatment_ is YES', () => {
      const page = new MentalHealth({ receivesTreatment: 'yes' }, application)

      describe('and _treatmentDetail_ is UNANSWERED', () => {
        it('includes a validation error for _treatmentDetail_', () => {
          expect(page.errors()).toHaveProperty('treatmentDetail', 'Enter details about their treatment')
        })
      })
    })

    describe('when _isEngagedWithService_ is YES', () => {
      const page = new MentalHealth({ isEngagedWithService: 'yes' }, application)

      describe('and _serviceDetail_ is UNANSWERED', () => {
        it('includes a validation error for _serviceDetail_', () => {
          expect(page.errors()).toHaveProperty('serviceDetail', 'Enter the mental health service')
        })
      })
    })
  })

  describe('onSave', () => {
    it('removes mental health data if the question is set to "no"', () => {
      const body: Partial<MentalHealthBody> = {
        hasMentalHealthNeeds: 'no',
        needsDetail: 'Mental health needs detail',
      }

      const page = new MentalHealth(body, application)

      page.onSave()

      expect(page.body).toEqual({
        hasMentalHealthNeeds: 'no',
      })
    })

    it('removes support needs data if the question is set to "no"', () => {
      const body: Partial<MentalHealthBody> = {
        hasSupportNeeds: 'no',
        supportNeedsDetail: 'Support needs detail',
      }

      const page = new MentalHealth(body, application)

      page.onSave()

      expect(page.body).toEqual({
        hasSupportNeeds: 'no',
      })
    })

    it("removes treatment data if the question is set to 'no'", () => {
      const body: Partial<MentalHealthBody> = {
        receivesTreatment: 'no',
        treatmentDetail: 'some treatment details',
      }

      const page = new MentalHealth(body, application)

      page.onSave()

      expect(page.body).toEqual({
        receivesTreatment: 'no',
      })
    })

    it('removes service details if the question is set to "no"', () => {
      const body: Partial<MentalHealthBody> = {
        isEngagedWithService: 'no',
        serviceDetail: 'some service',
      }

      const page = new MentalHealth(body, application)

      page.onSave()

      expect(page.body).toEqual({
        isEngagedWithService: 'no',
      })
    })
  })
})
