import { createMock } from '@golevelup/ts-jest'
import { Contracts, TelemetryClient } from 'applicationinsights'
import type { EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'
import { addUserUuidToRequests } from './azureAppInsights'

describe('addUserUuidToRequests', () => {
  const userUuid = '11111111-1111-4111-8111-111111111111'

  it('adds the authenticated UUID to an App Insights request envelope', () => {
    const client = new TelemetryClient('00000000-0000-4000-8000-000000000000')
    const send = jest.spyOn(client.channel, 'send').mockImplementation()
    client.addTelemetryProcessor(addUserUuidToRequests)

    client.trackRequest({
      name: 'GET /applications',
      url: 'http://localhost/applications',
      duration: 10,
      resultCode: 200,
      success: true,
      properties: { existing: 'value' },
      contextObjects: { 'http.ServerResponse': { locals: { user: { userUuid } } } },
    })

    expect(send).toHaveBeenCalledTimes(1)
    expect(send.mock.calls[0][0].data.baseData.properties).toEqual({ existing: 'value', user_uuid: userUuid })
  })

  it('does not add UUIDs to other telemetry types', () => {
    const envelope = createMock<EnvelopeTelemetry>({
      data: { baseType: Contracts.TelemetryTypeString.Trace, baseData: { properties: { existing: 'value' } } },
    })

    expect(addUserUuidToRequests(envelope, { 'http.ServerResponse': { locals: { user: { userUuid } } } })).toBe(true)
    expect(envelope.data.baseData.properties).toEqual({ existing: 'value' })
  })

  it.each([
    ['no context', undefined],
    ['no response', {}],
    ['no user', { 'http.ServerResponse': { locals: {} } }],
    ['missing UUID', { 'http.ServerResponse': { locals: { user: {} } } }],
    ['empty UUID', { 'http.ServerResponse': { locals: { user: { userUuid: '' } } } }],
  ])('leaves request properties unchanged with %s', (_, context) => {
    const envelope = createMock<EnvelopeTelemetry>({
      data: { baseType: Contracts.TelemetryTypeString.Request, baseData: { properties: { existing: 'value' } } },
    })

    expect(addUserUuidToRequests(envelope, context)).toBe(true)
    expect(envelope.data.baseData.properties).toEqual({ existing: 'value' })
  })
})
