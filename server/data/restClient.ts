/* eslint-disable no-param-reassign */
import Agent, { HttpsAgent } from 'agentkeepalive'
import superagent from 'superagent'
import type { Response } from 'express'

import { PaginatedResponse } from '@approved-premises/ui'
import logger from '../../logger'
import sanitiseError from '../sanitisedError'
import type { ApiConfig } from '../config'
import type { UnsanitisedError } from '../sanitisedError'
import { restClientMetricsMiddleware } from './restClientMetricsMiddleware'
import { createQueryString } from '../utils/utils'

interface GetRequest {
  path?: string
  query?: string
  headers?: Record<string, string>
  responseType?: string
  raw?: boolean
}

interface PipeRequest {
  path?: string
  query?: string | Record<string, string>
  headers?: Record<string, string>
  errorLogger?: (e: UnsanitisedError) => void
  passThroughHeaders?: Array<string>
}

interface PostRequest {
  path?: string
  headers?: Record<string, string>
  responseType?: string
  data?: Record<string, unknown>
  raw?: boolean
}

type PutRequest = PostRequest

export default class RestClient {
  agent: Agent

  defaultHeaders: Record<string, string>

  constructor(
    private readonly name: string,
    private readonly config: ApiConfig,
    private readonly token: string,
  ) {
    this.agent = config.url.startsWith('https') ? new HttpsAgent(config.agent) : new Agent(config.agent)
  }

  private apiUrl() {
    return this.config.url
  }

  private timeoutConfig() {
    return this.config.timeout
  }

  async put(request: PutRequest = {}): Promise<unknown> {
    return this.postOrPut('put', request)
  }

  async post(request: PostRequest = {}): Promise<unknown> {
    return this.postOrPut('post', request)
  }

  private async postOrPut(
    method: 'post' | 'put',
    { path = null, headers = {}, responseType = '', data = {}, raw = false }: PutRequest | PostRequest = {},
  ): Promise<unknown> {
    logger.info(`${method} using user credentials: calling ${this.name}: ${path}`)
    try {
      const request =
        method === 'post' ? superagent.post(`${this.apiUrl()}${path}`) : superagent.put(`${this.apiUrl()}${path}`)

      const result = await request
        .send(this.filterBlanksFromData(data))
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .auth(this.token, { type: 'bearer' })
        .set({ ...this.defaultHeaders, ...headers })
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? result : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'PUT'`)
      throw sanitisedError
    }
  }

  async get({ path = null, query = '', headers = {}, responseType = '', raw = false }: GetRequest): Promise<unknown> {
    logger.info(`Get using user credentials: calling ${this.name}: ${path} ${query}`)
    try {
      const result = await superagent
        .get(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, err => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .query(query)
        .auth(this.token, { type: 'bearer' })
        .set({ ...this.defaultHeaders, ...headers })
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? result : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError, query }, `Error calling ${this.name}, path: '${path}', verb: 'GET'`)
      throw sanitisedError
    }
  }

  async getPaginatedResponse<T>({
    path = '',
    page = '',
    query = {},
  }: {
    path: string
    page: string
    query: Record<string, unknown>
  }): Promise<PaginatedResponse<T>> {
    const response = (await this.get({
      path,
      query: createQueryString({ page, ...query }),
      raw: true,
    })) as superagent.Response

    return {
      data: response.body,
      pageNumber: page,
      totalPages: response.headers['x-pagination-totalpages'],
      totalResults: response.headers['x-pagination-totalresults'],
      pageSize: response.headers['x-pagination-pagesize'],
    }
  }

  private filterBlanksFromData(data: Record<string, unknown>): Record<string, unknown> {
    Object.keys(data).forEach(k => typeof data[k] !== 'boolean' && !data[k] && delete data[k])

    return data
  }

  async pipe(
    { path = null, query = '', headers = {}, passThroughHeaders = [] }: PipeRequest,
    response: Response,
  ): Promise<void> {
    logger.info(`Get using user credentials: calling ${this.name}: ${path}`)
    return new Promise((resolve, reject) => {
      const stream = superagent
        .get(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .auth(this.token, { type: 'bearer' })
        .use(restClientMetricsMiddleware)
        .retry(2, err => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .query(query)
        .timeout(this.timeoutConfig())
        .set({ ...this.defaultHeaders, ...headers })

      stream.on('end', () => {
        resolve()
      })

      stream.on('response', res => {
        if (res.status !== 200) {
          logger.warn(res.error, `Error calling ${this.name}`)
          stream.abort()
          reject(res.error)
        }
        passThroughHeaders.forEach(header => {
          response.set(header, res.headers[header])
        })
      })

      stream.pipe(response)
    })
  }
}
