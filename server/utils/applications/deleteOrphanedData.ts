/* eslint-disable no-param-reassign */
import { Unit } from '@approved-premises/api'
import { PreviousConvictionsAnswers } from '../../form-pages/apply/offence-information/previous-unspent-convictions/anyPreviousConvictions'

export default function deleteOrphanedFollowOnAnswers(applicationData: Unit): Unit {
  const deleteOrphanedFundingAlternativeIdInformation = () => {
    delete applicationData['funding-information']['alternative-applicant-id']
  }

  const deleteOrphanedEqualityInformation = () => {
    Object.keys(applicationData['equality-and-diversity-monitoring']).forEach(key => {
      if (key !== 'will-answer-equality-questions') {
        delete applicationData['equality-and-diversity-monitoring'][key]
      }
    })
  }

  const deleteOrphanedOffendingHistoryInformation = () => {
    delete applicationData['previous-unspent-convictions']['unspent-convictions-data']
  }

  const deleteOrphanedProbationSupervisionDetailsData = () => {
    delete applicationData['add-probation-supervision-details']['community-probation-practitioner-details']
    delete applicationData['add-probation-supervision-details']['oasys-risk-assessment']
    delete applicationData['add-probation-supervision-details']['oasys-risk-assessment-details']
  }

  const hasOrphanedInformation = ({
    taskName,
    pageName,
    questionKey,
    answerToCheck,
  }: {
    taskName: string
    pageName: string
    questionKey: string
    answerToCheck: string
  }) => {
    return applicationData[taskName]?.[pageName]?.[questionKey] === answerToCheck
  }

  const idDocs = applicationData['funding-information']?.['applicant-id']?.idDocuments
  if (idDocs && idDocs !== 'none') {
    deleteOrphanedFundingAlternativeIdInformation()
  }

  if (
    hasOrphanedInformation({
      taskName: 'equality-and-diversity-monitoring',
      pageName: 'will-answer-equality-questions',
      questionKey: 'willAnswer',
      answerToCheck: 'no',
    })
  ) {
    deleteOrphanedEqualityInformation()
  }

  if (
    hasOrphanedInformation({
      taskName: 'previous-unspent-convictions',
      pageName: 'any-previous-convictions',
      questionKey: 'hasAnyPreviousConvictions',
      answerToCheck: PreviousConvictionsAnswers.No,
    })
  ) {
    deleteOrphanedOffendingHistoryInformation()
  }

  if (
    hasOrphanedInformation({
      taskName: 'previous-unspent-convictions',
      pageName: 'any-previous-convictions',
      questionKey: 'hasAnyPreviousConvictions',
      answerToCheck: PreviousConvictionsAnswers.YesNoRelevantRisk,
    })
  ) {
    deleteOrphanedOffendingHistoryInformation()
  }

  if (
    hasOrphanedInformation({
      taskName: 'add-probation-supervision-details',
      pageName: 'supervised-by-probation',
      questionKey: 'probationSupervision',
      answerToCheck: 'no',
    })
  ) {
    deleteOrphanedProbationSupervisionDetailsData()
  }

  return applicationData
}
