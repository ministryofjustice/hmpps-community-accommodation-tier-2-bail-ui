/* eslint-disable no-param-reassign */
import { Unit } from '@approved-premises/api'
import { lastKnownKeys, previousKeys } from '../../form-pages/apply/about-the-person/address-history/previousAddress'
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

  const deleteAddressHistoryInformation = () => {
    if (applicationData['address-history']['previous-address'].hasPreviousAddress === 'yes') {
      lastKnownKeys.forEach(key => delete applicationData['address-history']['previous-address'][key])
    } else if (applicationData['address-history']['previous-address'].hasPreviousAddress === 'no') {
      previousKeys.forEach(key => delete applicationData['address-history']['previous-address'][key])
    }
  }

  const deleteOrphanedCPPAndCurrentOffenceData = () => {
    delete applicationData['community-supervision-and-current-offences']['cpp-details']
    delete applicationData['community-supervision-and-current-offences']['current-offence-data']
    delete applicationData['community-supervision-and-current-offences']['current-offences']
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

  if (applicationData['address-history']?.['previous-address']?.hasPreviousAddress) {
    deleteAddressHistoryInformation()
  }

  if (
    hasOrphanedInformation({
      taskName: 'community-supervision-and-current-offences',
      pageName: 'community-supervision',
      questionKey: 'probationSupervision',
      answerToCheck: 'no',
    })
  ) {
    deleteOrphanedCPPAndCurrentOffenceData()
  }

  return applicationData
}
