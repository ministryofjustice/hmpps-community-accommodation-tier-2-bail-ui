import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import CppDetails from './cppDetails'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'

describe('CppCheck', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const page = new CppDetails({}, application)
  itShouldHaveNextValue(page, 'job-title')
  itShouldHavePreviousValue(page, 'cpp-check')
})
