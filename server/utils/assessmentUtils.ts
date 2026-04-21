import { Cas2v2Assessment } from '@approved-premises/api'

export const assessmentHasExistingData = (assessment: Cas2v2Assessment): boolean => {
  return Boolean(assessment.assessorName) || Boolean(assessment.nacroReferralId)
}
