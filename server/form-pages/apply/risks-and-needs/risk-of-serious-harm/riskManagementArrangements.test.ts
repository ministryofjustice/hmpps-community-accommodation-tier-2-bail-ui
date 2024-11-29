import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import RiskManagementArrangements, { RiskManagementArrangementsBody } from './riskManagementArrangements'

describe('RiskManagementArrangements', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new RiskManagementArrangements({}, application)

      expect(page.title).toEqual(`Risk management arrangements for Roger Smith`)
    })
  })

  itShouldHaveNextValue(new RiskManagementArrangements({}, application), 'cell-share-information')
  itShouldHavePreviousValue(new RiskManagementArrangements({}, application), 'risk-to-others')

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
          text: 'No, this person does not have risk management arrangements',
          checked: false,
        },
      ])
    })
  })

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
        arrangements:
          "Select risk management arrangements or 'No, this person does not have risk management arrangements'",
      })
    })

    it('returns an error if a MAPPA arrangement has been selected but no details given', () => {
      const page = new RiskManagementArrangements(
        { arrangements: ['mappa'] } as RiskManagementArrangementsBody,
        application,
      )

      expect(page.errors()).toEqual({ mappaDetails: 'Provide MAPPA details' })
    })

    it('returns an error if a MARAC arrangement has been selected but no details given', () => {
      const page = new RiskManagementArrangements(
        { arrangements: ['marac'] } as RiskManagementArrangementsBody,
        application,
      )

      expect(page.errors()).toEqual({ maracDetails: 'Provide MARAC details' })
    })

    it('returns an error if an IOM arrangement has been selected but no details given', () => {
      const page = new RiskManagementArrangements(
        { arrangements: ['iom'] } as RiskManagementArrangementsBody,
        application,
      )

      expect(page.errors()).toEqual({ iomDetails: 'Provide IOM details' })
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
