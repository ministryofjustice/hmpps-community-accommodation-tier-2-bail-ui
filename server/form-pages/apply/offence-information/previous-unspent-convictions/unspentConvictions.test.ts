import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import UnspentConvictions from './unspentConvictions'

describe('UnspentConvictions', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const applicationWithData = applicationFactory.build({
    person: personFactory.build({ name: 'Roger Smith' }),
    data: {
      'previous-unspent-convictions': {
        'offence-history-data': [
          {
            convictionType: 'stalkingOrHarassment',
            numberOfConvictions: '3',
            currentlyServing: 'yes',
            safeguarding: 'yes',
            safeguardingDetail: 'Safeguarding detail',
          },
          {
            convictionType: 'arson',
            numberOfConvictions: '2',
            currentlyServing: 'no',
            safeguarding: 'no',
            safeguardingDetail: '',
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

  describe('offence history data', () => {
    describe('when there is offence history data on the application', () => {
      it('assigns them to the offences field on the page', () => {
        const page = new UnspentConvictions({}, applicationWithData)

        expect(page.unspentConvictions).toEqual([
          {
            convictionTypeTag:
              '<strong class="govuk-tag govuk-tag--blue">Stalking or Harassment</strong><p class="govuk-visually-hidden">conviction information</p>',
            convictionTypeText: 'Stalking or Harassment',
            numberOfConvictions: '3',
            currentlyServing: 'Yes',
            safeguarding: 'Safeguarding detail',
            removeLink: `/applications/${applicationWithData.id}/tasks/previous-unspent-convictions/pages/offence-history-data/0/removeFromList?redirectPage=unspent-convictions`,
          },
          {
            convictionTypeTag:
              '<strong class="govuk-tag govuk-tag--yellow">Arson</strong><p class="govuk-visually-hidden">conviction information</p>',
            convictionTypeText: 'Arson',
            numberOfConvictions: '2',
            currentlyServing: 'No',
            safeguarding: 'No',
            removeLink: `/applications/${applicationWithData.id}/tasks/previous-unspent-convictions/pages/offence-history-data/1/removeFromList?redirectPage=unspent-convictions`,
          },
        ])
      })
    })

    describe('when there is offence data using the previous data model', () => {
      it('ignores the outdated data', () => {
        const applicationWithMixedData = applicationFactory.build({
          person: personFactory.build({ name: 'Roger Smith' }),
          data: {
            'previous-unspent-convictions': {
              'offence-history-data': [
                {
                  convictionType: 'stalkingOrHarassment',
                  numberOfConvictions: '3',
                  currentlyServing: 'yes',
                  safeguarding: 'no',
                  safeguardingDetail: '',
                },
                {
                  offenceGroupName: 'Arson',
                  offenceCategory: 'Arson',
                  'offenceDate-day': '5',
                  'offenceDate-month': '6',
                  'offenceDate-year': '1940',
                  sentenceLength: '3 years',
                  summary: 'summary detail',
                },
              ],
            },
          },
        })

        const page = new UnspentConvictions({}, applicationWithMixedData)

        expect(page.unspentConvictions).toEqual([
          {
            numberOfConvictions: '3',
            currentlyServing: 'Yes',
            safeguarding: 'No',
            convictionTypeTag:
              '<strong class="govuk-tag govuk-tag--blue">Stalking or Harassment</strong><p class="govuk-visually-hidden">conviction information</p>',
            convictionTypeText: 'Stalking or Harassment',
            removeLink: `/applications/${applicationWithMixedData.id}/tasks/previous-unspent-convictions/pages/offence-history-data/0/removeFromList?redirectPage=unspent-convictions`,
          },
        ])
      })
    })

    itShouldHaveNextValue(new UnspentConvictions({}, application), '')
    itShouldHavePreviousValue(new UnspentConvictions({}, application), 'any-previous-convictions')

    describe('errors', () => {
      it('returns empty object', () => {
        const page = new UnspentConvictions({}, application)
        expect(page.errors()).toEqual({})
      })
    })

    describe('response', () => {
      it('returns the unspent conviction information', () => {
        const page = new UnspentConvictions({}, applicationWithData)
        expect(page.response()).toEqual({
          '<strong class="govuk-tag govuk-tag--blue">Stalking or Harassment</strong><p class="govuk-visually-hidden">conviction information</p>':
            'Number of convictions: 3\r\nActive sentence: Yes\r\nSafeguarding: Safeguarding detail',
          '<strong class="govuk-tag govuk-tag--yellow">Arson</strong><p class="govuk-visually-hidden">conviction information</p>':
            'Number of convictions: 2\r\nActive sentence: No\r\nSafeguarding: No',
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
