import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import OASysRiskAssessmentDetails, { OASysRiskAssessmentDetailsBody } from './oasysRiskAssessmentDetails'

describe('OASysRiskAssessmentDetails', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new OASysRiskAssessmentDetails({}, application)

      expect(page.title).toEqual('Provide details of the OASys assessment')
    })
  })

  itShouldHavePreviousValue(new OASysRiskAssessmentDetails({}, application), 'contacted-cpp-about-current-risk-levels')
  itShouldHaveNextValue(new OASysRiskAssessmentDetails({}, application), '')

  describe('errors', () => {
    describe('inTheCommunity', () => {
      const inCustodyData = {
        inCustody: ['public'],
        inCustodyPublicRisk: 'low',
      } as Partial<OASysRiskAssessmentDetailsBody>

      describe('when _inTheCommunity_ is not present', () => {
        it('returns an error', () => {
          const page = new OASysRiskAssessmentDetails({ ...inCustodyData }, application)
          expect(page.errors()).toEqual({
            inTheCommunity: 'Select if they are a risk to anyone in the community',
          })
        })
      })

      describe('when _inTheCommunity_ includes _children_', () => {
        it('returns an error if _inTheCommunityChildrenRisk_ is not present', () => {
          const page = new OASysRiskAssessmentDetails({ inTheCommunity: ['children'], ...inCustodyData }, application)
          expect(page.errors()).toEqual({
            inTheCommunityChildrenRisk: 'Select if the risk is low, medium, high or very high',
          })
        })
      })

      describe('when _inTheCommunity_ includes _public_', () => {
        it('returns an error if _inTheCommunityPublicRisk_ is not present', () => {
          const page = new OASysRiskAssessmentDetails({ inTheCommunity: ['public'], ...inCustodyData }, application)
          expect(page.errors()).toEqual({
            inTheCommunityPublicRisk: 'Select if the risk is low, medium, high or very high',
          })
        })
      })

      describe('when _inTheCommunity_ includes _knownAdult_', () => {
        it('returns an error if _inTheCommunityKnownAdultRisk_ is not present', () => {
          const page = new OASysRiskAssessmentDetails({ inTheCommunity: ['knownAdult'], ...inCustodyData }, application)
          expect(page.errors()).toEqual({
            inTheCommunityKnownAdultRisk: 'Select if the risk is low, medium, high or very high',
          })
        })
      })
    })

    describe('inCustody', () => {
      const inTheCommunityData = {
        inTheCommunity: ['public'],
        inTheCommunityPublicRisk: 'low',
      } as Partial<OASysRiskAssessmentDetailsBody>

      describe('when _inCustody_ is not present', () => {
        it('returns an error', () => {
          const page = new OASysRiskAssessmentDetails({ ...inTheCommunityData }, application)
          expect(page.errors()).toEqual({
            inCustody: 'Select if they are a risk to anyone in custody',
          })
        })
      })

      describe('when _inCustody_ includes _public_', () => {
        it('returns an error if _inCustodyPublicRisk_ is not present', () => {
          const page = new OASysRiskAssessmentDetails({ inCustody: ['public'], ...inTheCommunityData }, application)
          expect(page.errors()).toEqual({
            inCustodyPublicRisk: 'Select if the risk is low, medium, high or very high',
          })
        })
      })

      describe('when _inCustody_ includes _prisoners_', () => {
        it('returns an error if _inCustodyPrisonersRisk_ is not present', () => {
          const page = new OASysRiskAssessmentDetails({ inCustody: ['prisoners'], ...inTheCommunityData }, application)
          expect(page.errors()).toEqual({
            inCustodyPrisonersRisk: 'Select if the risk is low, medium, high or very high',
          })
        })
      })

      describe('when _inCustody_ includes _knownAdult_', () => {
        it('returns an error if _inCustodyKnownAdultRisk_ is not present', () => {
          const page = new OASysRiskAssessmentDetails({ inCustody: ['knownAdult'], ...inTheCommunityData }, application)
          expect(page.errors()).toEqual({
            inCustodyKnownAdultRisk: 'Select if the risk is low, medium, high or very high',
          })
        })
      })

      describe('when _inCustody_ includes _staff_', () => {
        it('returns an error if _inCustodyStaffRisk_ is not present', () => {
          const page = new OASysRiskAssessmentDetails({ inCustody: ['staff'], ...inTheCommunityData }, application)
          expect(page.errors()).toEqual({
            inCustodyStaffRisk: 'Select if the risk is low, medium, high or very high',
          })
        })
      })
    })
  })

  describe('itemsForOASysRiskQuestions', () => {
    it('returns an array of items correctly formatted', () => {
      const fieldName: keyof OASysRiskAssessmentDetailsBody = 'inTheCommunityPublicRisk'

      const page = new OASysRiskAssessmentDetails({}, application)

      expect(page.itemsForOASysRiskQuestions(fieldName)).toEqual([
        {
          value: 'low',
          text: 'Low risk',
          attributes: {
            'data-testid': 'inTheCommunityPublicRisk-low',
          },
        },
        {
          value: 'medium',
          text: 'Medium risk',
          attributes: {
            'data-testid': 'inTheCommunityPublicRisk-medium',
          },
        },
        {
          value: 'high',
          text: 'High risk',
          attributes: {
            'data-testid': 'inTheCommunityPublicRisk-high',
          },
        },
        {
          value: 'veryHigh',
          text: 'Very high risk',
          attributes: {
            'data-testid': 'inTheCommunityPublicRisk-veryHigh',
          },
        },
      ])
    })
  })

  describe('itemsForInCustody', () => {
    it('returns an array of radios correctly formatted', () => {
      const page = new OASysRiskAssessmentDetails({}, application)
      expect(page.itemsForInCustody('prisoners-html', 'staff-html', 'public-html', 'known-adult-html')).toEqual([
        {
          checked: false,
          conditional: {
            html: 'public-html',
          },
          text: 'Public',
          value: 'public',
          attributes: {
            'data-testid': 'inCustodyPublic',
          },
        },
        {
          checked: false,
          conditional: {
            html: 'known-adult-html',
          },
          text: 'Known adult',
          value: 'knownAdult',
          attributes: {
            'data-testid': 'inCustodyKnownAdult',
          },
        },
        {
          checked: false,
          conditional: {
            html: 'staff-html',
          },
          text: 'Staff',
          value: 'staff',
          attributes: {
            'data-testid': 'inCustodyStaff',
          },
        },
        {
          checked: false,
          conditional: {
            html: 'prisoners-html',
          },
          text: 'Prisoners',
          value: 'prisoners',
          attributes: {
            'data-testid': 'inCustodyPrisoners',
          },
        },
      ])
    })
  })

  describe('itemsForInTheCommunity', () => {
    it('returns an array of radios correctly formatted', () => {
      const page = new OASysRiskAssessmentDetails({}, application)
      expect(page.itemsForInTheCommunity('children-html', 'public-html', 'known-adult-html')).toEqual([
        {
          checked: false,
          conditional: {
            html: 'children-html',
          },
          text: 'Children',
          value: 'children',
          attributes: {
            'data-testid': 'inTheCommunityChildren',
          },
        },
        {
          checked: false,
          conditional: {
            html: 'public-html',
          },
          text: 'Public',
          value: 'public',
          attributes: {
            'data-testid': 'inTheCommunityPublic',
          },
        },
        {
          checked: false,
          conditional: {
            html: 'known-adult-html',
          },
          text: 'Known adult',
          value: 'knownAdult',
          attributes: {
            'data-testid': 'inTheCommunityKnownAdult',
          },
        },
      ])
    })
  })

  describe('onSave', () => {
    describe('inTheCommunity', () => {
      const inCustodyData = { inCustody: [] } as OASysRiskAssessmentDetailsBody

      it('removes children risk level if not selected', () => {
        const page = new OASysRiskAssessmentDetails(
          { ...inCustodyData, inTheCommunity: ['knownAdult'], inTheCommunityChildrenRisk: 'high' },
          application,
        )

        page.onSave()

        expect(page.body.inTheCommunityChildrenRisk).toBeUndefined()
      })

      it('removes public risk level if not selected', () => {
        const page = new OASysRiskAssessmentDetails(
          { ...inCustodyData, inTheCommunity: ['knownAdult'], inTheCommunityPublicRisk: 'high' },
          application,
        )

        page.onSave()

        expect(page.body.inTheCommunityPublicRisk).toBeUndefined()
      })

      it('removes known adult risk level if not selected', () => {
        const page = new OASysRiskAssessmentDetails(
          { ...inCustodyData, inTheCommunity: ['children'], inTheCommunityKnownAdultRisk: 'high' },
          application,
        )

        page.onSave()

        expect(page.body.inTheCommunityKnownAdultRisk).toBeUndefined()
      })
    })

    describe('inCustody', () => {
      const inTheCommunityData = { inTheCommunity: [] } as OASysRiskAssessmentDetailsBody

      it('removes public risk level if not selected', () => {
        const page = new OASysRiskAssessmentDetails(
          { ...inTheCommunityData, inCustody: ['knownAdult'], inCustodyPublicRisk: 'high' },
          application,
        )

        page.onSave()

        expect(page.body.inCustodyPublicRisk).toBeUndefined()
      })

      it('removes prisoners risk level if not selected', () => {
        const page = new OASysRiskAssessmentDetails(
          { ...inTheCommunityData, inCustody: ['knownAdult'], inCustodyPrisonersRisk: 'high' },
          application,
        )

        page.onSave()

        expect(page.body.inCustodyPrisonersRisk).toBeUndefined()
      })

      it('removes known adult risk level if not selected', () => {
        const page = new OASysRiskAssessmentDetails(
          { ...inTheCommunityData, inCustody: ['staff'], inCustodyKnownAdultRisk: 'high' },
          application,
        )

        page.onSave()

        expect(page.body.inCustodyKnownAdultRisk).toBeUndefined()
      })

      it('removes staff risk level if not selected', () => {
        const page = new OASysRiskAssessmentDetails(
          { ...inTheCommunityData, inCustody: ['public'], inCustodyStaffRisk: 'high' },
          application,
        )

        page.onSave()

        expect(page.body.inCustodyStaffRisk).toBeUndefined()
      })
    })
  })
})
