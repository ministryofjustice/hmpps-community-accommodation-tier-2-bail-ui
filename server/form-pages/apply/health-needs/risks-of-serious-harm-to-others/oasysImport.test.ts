import { createMock } from '@golevelup/ts-jest'
import type { DataServices, OASysRiskOfSeriousHarm, RoshRisksEnvelope } from '@approved-premises/ui'
import { DateFormats } from '../../../../utils/dateUtils'
import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import OasysImport, { RoshTaskData } from './oasysImport'
import Summary from './summary'
import OldOasys from './oldOasys'

jest.mock('./oldOasys')
jest.mock('./summary')
jest.mock('../../../../../logger')

const buildOasys = (overrides: Partial<OASysRiskOfSeriousHarm> = {}): OASysRiskOfSeriousHarm => ({
  assessmentId: 123,
  assessmentState: 'Completed',
  dateStarted: DateFormats.dateObjToIsoDateTime(new Date(2023, 7, 28)),
  dateCompleted: DateFormats.dateObjToIsoDateTime(new Date(2023, 7, 29)),
  rosh: [],
  ...overrides,
})

const roshRisksEnvelope: RoshRisksEnvelope = {
  status: 'retrieved',
  value: {
    overallRisk: 'High',
    riskToChildren: 'Low',
    riskToPublic: 'Medium',
    riskToKnownAdult: 'High',
    riskToStaff: 'Low',
  },
}

describe('OasysImport', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })
  const oasys = buildOasys()

  const dataServices = createMock<DataServices>()

  const now = new Date()

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(now)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new OasysImport({}, application, oasys, '')

      expect(page.title).toEqual("Import Roger Smith's risk of serious harm (RoSH) data from OASys")
    })
  })

  describe('initialize', () => {
    describe('when oasys sections are returned', () => {
      it('instantiates the class with the task data in the correct format', async () => {
        oasys.rosh = [
          { label: 'Who is at risk', questionNumber: 'R10.1', answer: 'who is at risk answer' },
          { label: 'What is the nature of the risk', questionNumber: 'R10.2', answer: 'nature of risk answer' },
          {
            label: 'What circumstances are likely to reduce the risk',
            questionNumber: 'R10.5',
            answer: 'circumstances likely to reduce risk answer',
          },
        ]

        const taskData = {
          'risks-of-serious-harm-to-others': {
            summary: {},
            'summary-data': {
              ...roshRisksEnvelope,
              oasysImportedDate: now,
              oasysStartedDate: oasys.dateStarted,
              oasysCompletedDate: oasys.dateCompleted,
            },
            'risk-to-others': {
              whoIsAtRisk: 'who is at risk answer',
              natureOfRisk: 'nature of risk answer',
            },
            'oasys-import': { oasysImportedDate: now },
          },
        }

        ;(dataServices.personService.getOasysRosh as jest.Mock).mockResolvedValue(oasys)
        ;(dataServices.personService.getRoshRisks as jest.Mock).mockResolvedValue(roshRisksEnvelope)

        const page = (await OasysImport.initialize(
          {},
          application,
          { user: { token: 'some-token' } } as never,
          dataServices,
        )) as OasysImport

        expect(page.taskData).toBe(JSON.stringify(taskData))
        expect(page.hasOasysRecord).toBe(true)
        expect(page.oasysCompleted).toBe('29 August 2023')
        expect(page.oasysStarted).toBe('28 August 2023')
      })

      describe('when there is not a completed date', () => {
        it('does not assign a completed date', async () => {
          const oasysIncomplete = buildOasys({ dateCompleted: null })

          ;(dataServices.personService.getOasysRosh as jest.Mock).mockResolvedValue(oasysIncomplete)
          ;(dataServices.personService.getRoshRisks as jest.Mock).mockResolvedValue(null)

          const page = (await OasysImport.initialize(
            {},
            application,
            { user: { token: 'some-token' } } as never,
            dataServices,
          )) as OasysImport

          expect(page.oasysCompleted).toBe(null)
        })
      })
    })

    describe('when there is no applicable assessment to import', () => {
      it('sets hasOasysRecord to false so the no OASys record page is shown', async () => {
        ;(dataServices.personService.getOasysRosh as jest.Mock).mockResolvedValue(null)

        const page = (await OasysImport.initialize(
          {},
          application,
          { user: { token: 'some-token' } } as never,
          dataServices,
        )) as OasysImport

        expect(page.hasOasysRecord).toBe(false)
      })
    })

    describe('when oasys sections are not returned', () => {
      it('sets hasOasysRecord to false when an error is returned', async () => {
        ;(dataServices.personService.getOasysRosh as jest.Mock).mockRejectedValue(new Error())

        const page = (await OasysImport.initialize(
          {},
          application,
          { user: { token: 'some-token' } } as never,
          dataServices,
        )) as OasysImport

        expect(page.hasOasysRecord).toBe(false)
        expect(page.oasysCompleted).toBe(undefined)
        expect(page.oasysStarted).toBe(undefined)
      })
    })

    describe('when OASys data has already been imported', () => {
      it('returns the Rosh summary page', async () => {
        const roshData = {
          'risks-of-serious-harm-to-others': {
            'oasys-import': { oasysImportedDate: now },
          },
        } as RoshTaskData

        const applicationWithData = applicationFactory.build({
          person: personFactory.build({ name: 'Roger Smith' }),
          data: roshData,
        })

        const roshSummaryPageConstructor = jest.fn()

        ;(Summary as jest.Mock).mockImplementation(() => {
          return roshSummaryPageConstructor
        })

        expect(
          OasysImport.initialize({}, applicationWithData, { user: { token: 'some-token' } } as never, dataServices),
        ).resolves.toEqual(roshSummaryPageConstructor)

        expect(Summary).toHaveBeenCalledWith({}, applicationWithData)
      })

      describe("when there is data but it hasn't been imported from OASys", () => {
        it('returns the Old OASys page', async () => {
          const roshData = {
            'risks-of-serious-harm-to-others': {
              'old-oasys': {
                hasOldOasys: 'no',
              },
            },
          }

          const applicationWithData = applicationFactory.build({
            person: personFactory.build({ name: 'Roger Smith' }),
            data: roshData,
          })

          const oldOasysPageConstructor = jest.fn()

          ;(OldOasys as jest.Mock).mockImplementation(() => {
            return oldOasysPageConstructor
          })

          expect(
            OasysImport.initialize({}, applicationWithData, { user: { token: 'some-token' } } as never, dataServices),
          ).resolves.toEqual(oldOasysPageConstructor)

          expect(OldOasys).toHaveBeenCalledWith(
            roshData['risks-of-serious-harm-to-others']['old-oasys'],
            applicationWithData,
          )
        })
      })
    })
  })

  itShouldHaveNextValue(new OasysImport({}, application, oasys, ''), 'summary')
  itShouldHavePreviousValue(new OasysImport({}, application, oasys, ''), 'taskList')

  describe('errors', () => {
    it('returns empty object', () => {
      const page = new OasysImport({}, application, oasys, '')

      expect(page.errors()).toEqual({})
    })
  })
})
