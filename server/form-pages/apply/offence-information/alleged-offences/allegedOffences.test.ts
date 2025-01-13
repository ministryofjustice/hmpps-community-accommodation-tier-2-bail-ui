import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import AllegedOffences from './allegedOffences'
import AllegedOffenceData from './custom-forms/allegedOffenceData'

jest.mock('./custom-forms/allegedOffenceData')

describe('AllegedOffences', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const applicationWithData = applicationFactory.build({
    person: personFactory.build({ name: 'Roger Smith' }),
    data: {
      'alleged-offences': {
        'alleged-offence-data': [
          {
            titleAndNumber: 'Stalking',
            offenceCategory: 'stalkingOrHarassment',
            'offenceDate-day': '1',
            'offenceDate-month': '2',
            'offenceDate-year': '2023',
            summary: 'summary detail',
          },
          {
            titleAndNumber: 'Arson',
            offenceCategory: 'arson',
            'offenceDate-day': '5',
            'offenceDate-month': '6',
            'offenceDate-year': '1940',
            summary: 'second summary detail',
          },
        ],
      },
    },
  })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new AllegedOffences({}, application)

      expect(page.title).toEqual('Alleged offences for Roger Smith')
    })
  })

  describe('alleged offence data', () => {
    describe('when there is alleged offence data on the application', () => {
      it('assigns them to the offences field on the page', () => {
        const page = new AllegedOffences({}, applicationWithData)

        expect(page.offences).toEqual([
          {
            titleAndNumber: 'Stalking',
            offenceCategoryTag: '<strong class="govuk-tag govuk-tag--blue">Stalking or Harassment</strong>',
            offenceCategoryText: 'Stalking or Harassment',
            offenceDate: '1 February 2023',
            summary: 'summary detail',
            removeLink: `/applications/${applicationWithData.id}/tasks/alleged-offences/pages/alleged-offence-data/0/removeFromList?redirectPage=alleged-offences`,
          },
          {
            titleAndNumber: 'Arson',
            offenceCategoryTag: '<strong class="govuk-tag govuk-tag--yellow">Arson</strong>',
            offenceCategoryText: 'Arson',
            offenceDate: '5 June 1940',
            summary: 'second summary detail',
            removeLink: `/applications/${applicationWithData.id}/tasks/alleged-offences/pages/alleged-offence-data/1/removeFromList?redirectPage=alleged-offences`,
          },
        ])
      })
    })
  })

  itShouldHaveNextValue(new AllegedOffences({}, application), '')
  itShouldHavePreviousValue(new AllegedOffences({}, application), 'taskList')

  describe('errors', () => {
    it('returns an empty object where there is alleged offence data', () => {
      const page = new AllegedOffences({}, applicationWithData)
      expect(page.errors()).toEqual({})
    })

    it('returns an error where there is no alleged offence data', () => {
      const page = new AllegedOffences({}, application)
      expect(page.errors()).toEqual({ offenceList: 'Alleged offences must be added to the application' })
    })
  })

  describe('response', () => {
    it('returns the offence information', () => {
      const page = new AllegedOffences({}, applicationWithData)
      expect(page.response()).toEqual({
        'Alleged offence 1': 'Stalking\r\nStalking or Harassment\r\n1 February 2023\r\n\nSummary: summary detail',
        'Alleged offence 2': 'Arson\r\nArson\r\n5 June 1940\r\n\nSummary: second summary detail',
      })
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
      const page = new AllegedOffences({}, applicationWithData)
      expect(page.getOffenceTagColour(category)).toEqual(colour)
    })
  })

  describe('initialize', () => {
    it('returns AllegedOffenceData page if there is no alleged offences data', () => {
      const allegedOffenceDataPageConstructor = jest.fn()

      ;(AllegedOffenceData as jest.Mock).mockImplementation(() => {
        return allegedOffenceDataPageConstructor
      })

      AllegedOffences.initialize({}, application)

      expect(AllegedOffenceData).toHaveBeenCalledWith({}, application)
    })

    it('returns AllegedOffence page if there is alleged offences data', async () => {
      const page = (await AllegedOffences.initialize({}, applicationWithData)) as AllegedOffences

      expect(page.title).toBe('Alleged offences for Roger Smith')
    })
  })
})
