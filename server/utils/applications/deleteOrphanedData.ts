/* eslint-disable no-param-reassign */
import { PreviousConvictionsAnswers } from '../../form-pages/apply/offences-and-concerns/previous-unspent-convictions/anyPreviousConvictions'
import { Cas2v2Application } from '@approved-premises/api'

export default function deleteOrphanedFollowOnAnswers(applicationData: Cas2v2Application['data']): Cas2v2Application['data'] {
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
    delete applicationData['add-probation-supervision-details']['contacted-cpp-about-current-risk-levels']
    delete applicationData['add-probation-supervision-details']['serious-harm-risk-levels']
  }

  const deleteOrphanedSeriousHarmRiskLevelsData = () => {
    delete applicationData['add-probation-supervision-details']['serious-harm-risk-levels']
  }

  const deleteOrphanedACCTNotesData = () => {
    delete applicationData['risk-information']['add-acct-note']
  }

  const deleteOrphanedCommunicationAndLanguageNeedsData = () => {
    delete applicationData['health-needs']['communication-and-language']
  }

  const deleteOrphanedBrainInjuryData = () => {
    delete applicationData['health-needs']['brain-injury-details']
  }

  const deleteOrphanedLearningDifficultiesData = () => {
    delete applicationData['health-needs']['learning-difficulties-details']
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

  if (
    hasOrphanedInformation({
      taskName: 'add-probation-supervision-details',
      pageName: 'contacted-cpp-about-current-risk-levels',
      questionKey: 'hasContactedCppAboutCurrentRiskLevels',
      answerToCheck: 'no',
    })
  ) {
    deleteOrphanedSeriousHarmRiskLevelsData()
  }

  if (
    hasOrphanedInformation({
      taskName: 'risk-information',
      pageName: 'does-the-applicant-have-acct-notes',
      questionKey: 'applicantHasAcctNotes',
      answerToCheck: 'notInPrisonCustody',
    })
  ) {
    deleteOrphanedACCTNotesData()
  }

  if (
    hasOrphanedInformation({
      taskName: 'risk-information',
      pageName: 'does-the-applicant-have-acct-notes',
      questionKey: 'applicantHasAcctNotes',
      answerToCheck: 'no',
    })
  ) {
    deleteOrphanedACCTNotesData()
  }

  if (
    hasOrphanedInformation({
      taskName: 'health-needs',
      pageName: 'communication-and-language-relevance-check',
      questionKey: 'hasCommunicationAndLanguageNeeds',
      answerToCheck: 'no',
    })
  ) {
    deleteOrphanedCommunicationAndLanguageNeedsData()
  }

  if (
    hasOrphanedInformation({
      taskName: 'health-needs',
      pageName: 'brain-injury',
      questionKey: 'hasBrainInjury',
      answerToCheck: 'no',
    })
  ) {
    deleteOrphanedBrainInjuryData()
  }

  if (
    hasOrphanedInformation({
      taskName: 'health-needs',
      pageName: 'learning-difficulties',
      questionKey: 'hasLearningDifficultiesOrNeurodiversityNeeds',
      answerToCheck: 'no',
    })
  ) {
    deleteOrphanedLearningDifficultiesData()
  }

  return applicationData
}
