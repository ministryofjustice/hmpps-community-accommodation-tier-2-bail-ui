import type { Cas2v2UserDto } from '@approved-premises/api'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'

export default {
  stubUserDetails: (userDetails: Cas2v2UserDto) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.users.get({ userName: userDetails.username }),
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: userDetails,
      },
    }),
}
