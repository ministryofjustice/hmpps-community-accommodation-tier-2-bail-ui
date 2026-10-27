import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import CppDetails from './cppDetails'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'

describe('CppCheck', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const page = new CppDetails({}, application)
  itShouldHaveNextValue(page, 'job-title')
  itShouldHavePreviousValue(page, 'cpp-check')

  describe('response', () => {
    it('returns data in expected format', () => {
      const pageWithAnswers = new CppDetails(
        {
          name: 'a name',
          probationRegion: 'a probation region',
          email: 'an email address',
          telephone: 'a phone number',
        },
        application,
      )

      expect(pageWithAnswers.response()).toEqual({
        'Community probation practitioner (CPP)': `a name\r\nProbation region: a probation region\r\na phone number\r\nan email address`,
      })
    })
  })
})
