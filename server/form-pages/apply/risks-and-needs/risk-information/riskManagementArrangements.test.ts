import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import RiskManagementArrangements, { RiskManagementArrangementsBody } from './riskManagementArrangements'

describe('RiskManagementArrangements', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new RiskManagementArrangements({}, application)

      expect(page.title).toEqual(`Risk management arrangements`)
    })
  })

  itShouldHaveNextValue(new RiskManagementArrangements({}, application), '')
  itShouldHavePreviousValue(new RiskManagementArrangements({}, application), 'additional-concerns')

  describe('errors', () => {
    const validAnswers = [
      {
        arrangements: ['no'],
      },
      {
        arrangements: ['mappa', 'marac', 'iom'],
        mappaDetails: 'mappa details',
        maracDetails: 'marac details',
        iomDetails: 'iom details',
      },
    ]
    it.each(validAnswers)('it does not return an error for valid answers', validAnswer => {
      const page = new RiskManagementArrangements(validAnswer as RiskManagementArrangementsBody, application)

      expect(page.errors()).toEqual({})
    })

    it('returns an error is nothing selected', () => {
      const page = new RiskManagementArrangements({}, application)

      expect(page.errors()).toEqual({
        arrangements: 'Select if there are any multi-agency risk management arrangements',
      })
    })

    it('returns an error if a MAPPA arrangement has been selected but no details given', () => {
      const page = new RiskManagementArrangements(
        { arrangements: ['mappa'] } as RiskManagementArrangementsBody,
        application,
      )

      expect(page.errors()).toEqual({ mappaDetails: 'Enter MAPPA details' })
    })

    it('returns an error if a MARAC arrangement has been selected but no details given', () => {
      const page = new RiskManagementArrangements(
        { arrangements: ['marac'] } as RiskManagementArrangementsBody,
        application,
      )

      expect(page.errors()).toEqual({ maracDetails: 'Enter MARAC details' })
    })

    it('returns an error if an IOM arrangement has been selected but no details given', () => {
      const page = new RiskManagementArrangements(
        { arrangements: ['iom'] } as RiskManagementArrangementsBody,
        application,
      )

      expect(page.errors()).toEqual({ iomDetails: 'Enter IOM details' })
    })
  })

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new RiskManagementArrangements(
        {
          arrangements: ['mappa', 'marac', 'iom'],
          mappaDetails: 'mappa details',
          maracDetails: 'marac details',
          iomDetails: 'iom details',
        },
        application,
      )

      expect(page.items('mappaHtml', 'maracHtml', 'iomHtml')).toEqual([
        {
          value: 'mappa',
          text: 'Multi-Agency Public Protection Arrangements (MAPPA)',
          checked: true,
          conditional: {
            html: 'mappaHtml',
          },
          attributes: {
            'data-selector': 'arrangements',
          },
        },
        {
          value: 'marac',
          text: 'Multi-Agency Risk Assessment Conference (MARAC)',
          checked: true,
          conditional: {
            html: 'maracHtml',
          },
          attributes: {
            'data-selector': 'arrangements',
          },
        },
        {
          value: 'iom',
          text: 'Integrated Offender Management (IOM)',
          checked: true,
          conditional: {
            html: 'iomHtml',
          },
          attributes: {
            'data-selector': 'arrangements',
          },
        },
        {
          divider: 'or',
        },
        {
          value: 'no',
          text: 'No, they do not have risk management arrangements',
          checked: false,
        },
      ])
    })
  })

  describe('onSave', () => {
    it('removes MAPPA data if option is not selected', () => {
      const body: RiskManagementArrangementsBody = {
        arrangements: ['no'],
        mappaDetails: 'MAPPA details',
      }

      const page = new RiskManagementArrangements(body, application)

      page.onSave()

      expect(page.body).toEqual({
        arrangements: ['no'],
      })
    })

    it('removes IOM data if option is not selected', () => {
      const body: RiskManagementArrangementsBody = {
        arrangements: ['no'],
        iomDetails: 'IOM details',
      }

      const page = new RiskManagementArrangements(body, application)

      page.onSave()

      expect(page.body).toEqual({
        arrangements: ['no'],
      })
    })

    it('removes MARAC data if option is not selected', () => {
      const body: RiskManagementArrangementsBody = {
        arrangements: ['no'],
        maracDetails: 'MARAC details',
      }

      const page = new RiskManagementArrangements(body, application)

      page.onSave()

      expect(page.body).toEqual({
        arrangements: ['no'],
      })
    })
  })
})
