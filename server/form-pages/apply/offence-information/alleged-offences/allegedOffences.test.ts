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
            'offenceDate-day': '1',
            'offenceDate-month': '2',
            'offenceDate-year': '2023',
          },
          {
            titleAndNumber: 'Arson',
            'offenceDate-day': '5',
            'offenceDate-month': '6',
            'offenceDate-year': '1940',
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
            offenceDate: '1 February 2023',
            removeLink: `/applications/${applicationWithData.id}/tasks/alleged-offences/pages/alleged-offence-data/0/removeFromList?redirectPage=alleged-offences`,
          },
          {
            titleAndNumber: 'Arson',
            offenceDate: '5 June 1940',
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
        'Alleged offence 1': 'Stalking\r\n1 February 2023',
        'Alleged offence 2': 'Arson\r\n5 June 1940',
      })
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
