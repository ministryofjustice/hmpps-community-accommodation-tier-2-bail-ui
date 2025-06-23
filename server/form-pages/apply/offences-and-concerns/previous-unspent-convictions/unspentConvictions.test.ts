import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import UnspentConvictions from './unspentConvictions'

describe('UnspentConvictions', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const applicationWithData = applicationFactory.build({
    person: personFactory.build({ name: 'Roger Smith' }),
    data: {
      'previous-unspent-convictions': {
        'unspent-convictions-data': [
          {
            convictionType: 'stalkingOrHarassment',
            numberOfConvictions: '3',
            currentlyServing: 'yes',
            convictionDetails: 'some conviction details',
            areOtherDetails: 'yes',
            otherDetails: 'some other detail',
          },
          {
            convictionType: 'arson',
            numberOfConvictions: '2',
            currentlyServing: 'no',
            convictionDetails: 'some arson details',
            areOtherDetails: 'no',
          },
          {
            convictionType: 'drugs',
            numberOfConvictions: '2',
            currentlyServing: 'no',
            convictionDetails: 'some drug details',
            areOtherDetails: 'no',
          },
        ],
      },
    },
  })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new UnspentConvictions({}, application)

      expect(page.title).toEqual(`View and add Roger Smith's previous unspent convictions`)
    })
  })

  describe('unspent convictions data', () => {
    describe('when there is unspent convictions data on the application', () => {
      it('assigns them to the convictions field on the page', () => {
        const page = new UnspentConvictions({}, applicationWithData)

        expect(page.unspentConvictions).toEqual([
          {
            convictionTypeTag:
              '<strong class="govuk-tag govuk-tag--blue">Stalking or Harassment</strong><p class="govuk-visually-hidden">conviction information</p>',
            convictionTypeText: 'Stalking or Harassment',
            numberOfConvictions: '3',
            currentlyServing: 'Yes',
            convictionDetails: 'some conviction details',
            otherDetails: 'some other detail',
            removeLink: `/applications/${applicationWithData.id}/tasks/previous-unspent-convictions/pages/unspent-convictions-data/0/removeFromList?redirectPage=unspent-convictions`,
          },
          {
            convictionTypeTag:
              '<strong class="govuk-tag govuk-tag--yellow">Arson</strong><p class="govuk-visually-hidden">conviction information</p>',
            convictionTypeText: 'Arson',
            numberOfConvictions: '2',
            currentlyServing: 'No',
            convictionDetails: 'some arson details',
            otherDetails: 'No',
            removeLink: `/applications/${applicationWithData.id}/tasks/previous-unspent-convictions/pages/unspent-convictions-data/1/removeFromList?redirectPage=unspent-convictions`,
          },
          {
            convictionTypeTag:
              '<strong class="govuk-tag govuk-tag--custom-brown">Drugs</strong><p class="govuk-visually-hidden">conviction information</p>',
            convictionTypeText: 'Drugs',
            numberOfConvictions: '2',
            currentlyServing: 'No',
            convictionDetails: 'some drug details',
            otherDetails: 'No',
            removeLink: `/applications/${applicationWithData.id}/tasks/previous-unspent-convictions/pages/unspent-convictions-data/2/removeFromList?redirectPage=unspent-convictions`,
          },
        ])
      })
    })

    itShouldHaveNextValue(new UnspentConvictions({}, application), '')
    itShouldHavePreviousValue(new UnspentConvictions({}, application), 'any-previous-convictions')

    describe('errors', () => {
      it('returns an error when no unspent convictions are added', () => {
        const page = new UnspentConvictions({}, application)
        expect(page.errors()).toEqual({
          convictionsList: 'Unspent convictions must be added to the application',
        })
      })
    })

    describe('response', () => {
      it('returns the unspent conviction information', () => {
        const page = new UnspentConvictions({}, applicationWithData)
        expect(page.response()).toEqual({
          '<strong class="govuk-tag govuk-tag--blue">Stalking or Harassment</strong><p class="govuk-visually-hidden">conviction information</p>':
            'Number of convictions: 3\r\nActive sentence: Yes\r\nConviction details: some conviction details\r\nOther details: some other detail',
          '<strong class="govuk-tag govuk-tag--yellow">Arson</strong><p class="govuk-visually-hidden">conviction information</p>':
            'Number of convictions: 2\r\nActive sentence: No\r\nConviction details: some arson details\r\nOther details: No',
          '<strong class="govuk-tag govuk-tag--custom-brown">Drugs</strong><p class="govuk-visually-hidden">conviction information</p>':
            'Number of convictions: 2\r\nActive sentence: No\r\nConviction details: some drug details\r\nOther details: No',
        })
      })

      it('returns empty object when there are no unspent convictions', () => {
        const page = new UnspentConvictions({}, application)
        expect(page.response()).toEqual({})
      })
    })

    describe('getOffenceTagColour', () => {
      const categories = [
        ['stalkingOrHarassment', 'blue'],
        ['weaponsOrFirearms', 'red'],
        ['arson', 'yellow'],
        ['violence', 'pink'],
        ['domesticAbuse', 'purple'],
        ['hateCrime', 'green'],
        ['drugs', 'custom-brown'],
        ['other', 'grey'],
        ['undefinedCategory', 'grey'],
      ]
      it.each(categories)('returns correct colour for category %s', (category, colour) => {
        const page = new UnspentConvictions({}, applicationWithData)
        expect(page.getOffenceTagColour(category)).toEqual(colour)
      })
    })
  })
})
