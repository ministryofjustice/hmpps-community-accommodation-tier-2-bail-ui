import { createMock } from '@golevelup/ts-jest'
import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { UserService } from '../services'
import type { UserDetails } from '../services/userService'
import populateCurrentUser from './populateCurrentUser'

describe('populateCurrentUser', () => {
  const createToken = (authorities: string[]) => {
    const payload = {
      user_name: 'USER1',
      scope: ['read', 'write'],
      auth_source: 'nomis',
      authorities,
      user_uuid: 'a610a10-cca6-41db-985f-e87efb303aaf',
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
      userUuid: 'a610a10-cca6-41db-985f-e87efb303aaf',
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
    expect(response.locals.user.userUuid).toBe('a610a10-cca6-41db-985f-e87efb303aaf')
  })
})
