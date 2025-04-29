import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import GangAffiliations from './gangAffiliations'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'

describe('GangAffiliations', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Sue Smith' }) })

  it('sets the question as the page title', () => {
    const page = new GangAffiliations({}, application)

    expect(page.title).toEqual('Gang affiliation details for Sue Smith')
  })

  describe('errors', () => {
    describe('when top level fields are unanswered', () => {
      it('returns an error for hasGangAffiliations', () => {
        const page = new GangAffiliations({ hasGangAffiliations: null }, application)

        expect(page.errors()).toHaveProperty(
          'hasGangAffiliations',
          'Select if they have any gang affiliations, or it is not known',
        )
      })

      it('returns an error for rivalGangsOrCountyLines', () => {
        const page = new GangAffiliations({ rivalGangsOrCountyLines: null }, application)

        expect(page.errors()).toHaveProperty(
          'rivalGangsOrCountyLines',
          'Select if there are any rival gangs or county lines, or it is not known',
        )
      })
    })

    describe('when hasGangAffiliations is set to yes', () => {
      it('returns an error if gangDetails is not set', () => {
        const page = new GangAffiliations({ hasGangAffiliations: 'yes', gangDetails: null }, application)

        expect(page.errors()).toHaveProperty('gangDetails', 'Enter details of the gang')
      })
    })

    describe('when hasGangAffiliations is set to not known', () => {
      it('returns an error if gangNotKnownDetails is not set', () => {
        const page = new GangAffiliations({ hasGangAffiliations: 'dontKnow', gangNotKnownDetails: null }, application)

        expect(page.errors()).toHaveProperty('gangNotKnownDetails', 'Enter why it is not known')
      })
    })

    describe('when rivalGangsOrCountyLines is set to not known', () => {
      it('returns an error if rivalGangNotKnownDetail is not set', () => {
        const page = new GangAffiliations(
          { rivalGangsOrCountyLines: 'dontKnow', rivalGangNotKnownDetail: null },
          application,
        )

        expect(page.errors()).toHaveProperty('rivalGangNotKnownDetail', 'Enter why it is not known')
      })
    })
  })

  itShouldHaveNextValue(new GangAffiliations({}, application), 'family-accommodation')
  itShouldHavePreviousValue(new GangAffiliations({}, application), 'exclusion-zones')

  describe('onSave', () => {
    it('removes gang affiliation data if hasGangAffiliations not set to "yes"', () => {
      const page = new GangAffiliations(
        {
          hasGangAffiliations: 'no',
          gangDetails: 'Gang name',
        },
        application,
      )

      page.onSave()

      expect(page.body).toEqual({
        hasGangAffiliations: 'no',
      })
    })

    it('removes gangNotKnownDetails data if hasGangAffiliations is not set to "dontKnow"', () => {
      const page = new GangAffiliations(
        {
          hasGangAffiliations: 'no',
          gangNotKnownDetails: 'some reasons',
        },
        application,
      )

      page.onSave()

      expect(page.body).toEqual({
        hasGangAffiliations: 'no',
      })
    })

    it('removes rivalGangsOrCountyLinesDetail data if rivalGangsOrCountyLines is not set to "yes"', () => {
      const page = new GangAffiliations(
        {
          rivalGangsOrCountyLines: 'dontKnow',
          rivalGangsOrCountyLinesDetail: 'Gang name',
        },
        application,
      )

      page.onSave()

      expect(page.body).toEqual({
        rivalGangsOrCountyLines: 'dontKnow',
      })
    })

    it('removes rivalGangNotKnownDetail data if rivalGangsOrCountyLines is not set to "dontKnow"', () => {
      const page = new GangAffiliations(
        {
          rivalGangsOrCountyLines: 'yes',
          rivalGangNotKnownDetail: 'some reasons',
        },
        application,
      )

      page.onSave()

      expect(page.body).toEqual({
        rivalGangsOrCountyLines: 'yes',
      })
    })
  })
})
