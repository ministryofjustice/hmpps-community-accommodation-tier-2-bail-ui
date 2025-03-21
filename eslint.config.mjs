// @ts-check

import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default hmppsConfig({
  extraIgnorePaths: ['e2e-tests/playwright-report'],
  extraPathsAllowingDevDependencies: ['esbuild-configs/**'],
})
