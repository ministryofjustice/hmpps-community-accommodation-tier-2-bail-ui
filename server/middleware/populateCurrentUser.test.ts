import { createMock } from '@golevelup/ts-jest'
import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import logger from '../../logger'
import type { UserService } from '../services'
import type { UserDetails } from '../services/userService'
import populateCurrentUser from './populateCurrentUser'

describe('populateCurrentUser', () => {
  const createToken = (authorities: string[], userUuid: unknown = '11111111-1111-4111-8111-111111111111') => {
    const payload = {
      user_name: 'USER1',
      scope: ['read', 'write'],
      auth_source: 'nomis',
      authorities,
      ...(userUuid === null ? {} : { user_uuid: userUuid }),
      jti: 'a610a10-cca6-41db-985f-e87efb303aaf',
      client_id: 'clientid',
    }
    return jwt.sign(payload, 'secret', { expiresIn: '1h' })
  }

  const createResWithToken = ({ authorities }: { authorities: string[] }): Response =>
    createMock<Response>({
      locals: {
        user: {
          token: createToken(authorities),
          roles: [],
        },
      },
    })

  const userService = createMock<UserService>()

  const userDetailsObject: UserDetails = {
    name: 'FakeUser',
    displayName: 'Fake Display Name',
  }

  beforeEach(() => {
    userService.getUser.mockReset()
  })

  it('set user details from the user service if not already set', async () => {
    const request: jest.Mocked<Request> = createMock<Request>()
    const response = createResWithToken({ authorities: [] })
    const next = jest.fn()

    userService.getUser.mockResolvedValue(userDetailsObject)

    await populateCurrentUser(userService)(request, response, next)

    expect(response.locals.user).toMatchObject({
      ...userDetailsObject,
      userUuid: '11111111-1111-4111-8111-111111111111',
      userRoles: [],
    })
  })

  it('should extract the user roles from the jwt', async () => {
    const request: jest.Mocked<Request> = createMock<Request>()
    const response = createResWithToken({ authorities: ['role_1', 'role_2'] })
    const next = jest.fn()

    userService.getUser.mockResolvedValue(userDetailsObject)

    await populateCurrentUser(userService)(request, response, next)

    expect(response.locals.user.userRoles).toEqual(['1', '2'])
    expect(response.locals.user.userUuid).toBe('11111111-1111-4111-8111-111111111111')
  })

  it.each([null, '', 123])('logs and omits an invalid user_uuid claim: %s', async userUuid => {
    const request = createMock<Request>()
    const response = createMock<Response>({ locals: { user: { token: createToken([], userUuid) } } })
    const next = jest.fn()
    const warn = jest.spyOn(logger, 'warn').mockImplementation()
    userService.getUser.mockResolvedValue(userDetailsObject)

    await populateCurrentUser(userService)(request, response, next)

    expect(response.locals.user.userUuid).toBeUndefined()
    expect(warn).toHaveBeenCalledWith('Authenticated user token does not contain a user_uuid')
    expect(next).toHaveBeenCalledWith()
    warn.mockRestore()
  })
})
