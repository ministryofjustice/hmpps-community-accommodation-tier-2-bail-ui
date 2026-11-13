import {
  Contracts,
  defaultClient,
  DistributedTracingModes,
  getCorrelationContext,
  setup,
  TelemetryClient,
} from 'applicationinsights'
import type { EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'
import type { RequestHandler, Response } from 'express'
import type { ApplicationInfo } from '../applicationInfo'

export function initialiseAppInsights(): void {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start()
  }
}

export function buildAppInsightsClient(
  { applicationName, buildNumber }: ApplicationInfo,
  overrideName?: string,
): TelemetryClient {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    defaultClient.context.tags['ai.cloud.role'] = overrideName || applicationName
    defaultClient.context.tags['ai.application.ver'] = buildNumber

    defaultClient.addTelemetryProcessor(({ tags, data }, contextObjects) => {
      const operationNameOverride = contextObjects.correlationContext?.customProperties?.getProperty('operationName')
      if (operationNameOverride) {
        tags['ai.operation.name'] = data.baseData.name = operationNameOverride // eslint-disable-line no-multi-assign
      }
      return true
    })
    defaultClient.addTelemetryProcessor(addUserUuidToRequests)

    return defaultClient
  }
  return null
}

export function addUserUuidToRequests(envelope: EnvelopeTelemetry, contextObjects?: Record<string, unknown>): boolean {
  if (envelope.data.baseType === Contracts.TelemetryTypeString.Request && envelope.data.baseData) {
    const response = contextObjects?.['http.ServerResponse'] as Partial<Response> | undefined
    const userUuid: unknown = response?.locals?.user?.userUuid
    if (typeof userUuid === 'string' && userUuid.trim()) {
      envelope.data.baseData.properties = {
        ...envelope.data.baseData.properties,
        user_uuid: userUuid,
      }
    }
  }
  return true
}

export function appInsightsMiddleware(): RequestHandler {
  return (req, res, next) => {
    res.prependOnceListener('finish', () => {
      const context = getCorrelationContext()
      if (context && req.route) {
        context.customProperties.setProperty('operationName', `${req.method} ${req.route?.path}`)
      }
    })
    next()
  }
}
