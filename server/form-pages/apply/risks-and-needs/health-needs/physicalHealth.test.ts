import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import PhysicalHealth, { PhysicalHealthBody } from './physicalHealth'

describe('PhysicalHealth', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new PhysicalHealth({}, application)

      expect(page.title).toEqual('Physical and mobility needs details for Roger Smith')
    })
  })

  itShouldHaveNextValue(new PhysicalHealth({}, application), 'mental-health')
  itShouldHavePreviousValue(new PhysicalHealth({}, application), 'substance-misuse')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new PhysicalHealth({}, application)

      it('includes a validation error for _hasPhyHealthNeeds_', () => {
        expect(page.errors()).toHaveProperty('hasPhyHealthNeeds', 'Select if they have any physical and mobility needs')
      })

      it('includes a validation error for _requiresSupport_', () => {
        expect(page.errors()).toHaveProperty('requiresSupport', 'Select if they need any support')
      })

      it('includes a validation error for _canClimbStairs_', () => {
        expect(page.errors()).toHaveProperty('canClimbStairs', 'Select if they can climb stairs')
      })

      it('includes a validation error for _canLiveIndependently_', () => {
        expect(page.errors()).toHaveProperty('canLiveIndependently', 'Select if they can live independently')
      })
    })

    describe('when _hasPhyHealthNeeds_ is YES', () => {
      const page = new PhysicalHealth({ hasPhyHealthNeeds: 'yes' }, application)

      describe('and _needsDetail_ is UNANSWERED', () => {
        it('includes a validation error for _needsDetail_', () => {
          expect(page.errors()).toHaveProperty('needsDetail', 'Enter details of their needs')
        })
      })
    })

    describe('when _requiresSupport_ is YES', () => {
      const page = new PhysicalHealth({ requiresSupport: 'yes' }, application)

      describe('and _addSupportDetail_ is UNANSWERED', () => {
        it('includes a validation error for _supportDetail_', () => {
          expect(page.errors()).toHaveProperty('supportDetail', 'Enter the type of support needed')
        })
      })
    })

    describe('when _canLiveIndependently_ is NO', () => {
      const page = new PhysicalHealth({ canLiveIndependently: 'no' }, application)

      describe('and _indyLivingDetail_ is UNANSWERED', () => {
        it('includes a validation error for _indyLivingDetail_', () => {
          expect(page.errors()).toHaveProperty('indyLivingDetail', 'Enter why they are unable to live independently')
        })
      })
    })
  })

  describe('onSave', () => {
    it('removes physical needs data if the question is set to "no"', () => {
      const body: Partial<PhysicalHealthBody> = {
        hasPhyHealthNeeds: 'no',
        needsDetail: 'Needs detail',
      }

      const page = new PhysicalHealth(body, application)

      page.onSave()

      expect(page.body).toEqual({
        hasPhyHealthNeeds: 'no',
      })
    })

    it('removes support data if the question is set to "no"', () => {
      const body: Partial<PhysicalHealthBody> = {
        requiresSupport: 'no',
        supportDetail: 'Support detail',
      }

      const page = new PhysicalHealth(body, application)

      page.onSave()

      expect(page.body).toEqual({
        requiresSupport: 'no',
      })
    })

    it('removes independent living data if the question is set to "yes"', () => {
      const body: Partial<PhysicalHealthBody> = {
        canLiveIndependently: 'yes',
        indyLivingDetail: 'Independent living detail',
      }

      const page = new PhysicalHealth(body, application)

      page.onSave()

      expect(page.body).toEqual({
        canLiveIndependently: 'yes',
      })
    })
  })
})
