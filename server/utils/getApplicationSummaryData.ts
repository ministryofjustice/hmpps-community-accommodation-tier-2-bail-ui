import { Cas2v2Application, Cas2v2SubmittedApplication, FullPerson } from '@approved-premises/api'

import { isFullPerson } from './utils'

type ApplicationSummary = {
  id: string
  name?: string
  prisonNumber?: string
  prisonName?: string
  referrerName: string
  contactEmail?: string
  contactNumber?: string
  view: string
  applicationOrigin: string
  crn: string
}

type ViewType = 'assessor' | 'referrerSubmission' | 'checkYourAnswers'
type Application = Cas2v2Application | Cas2v2SubmittedApplication

export const getApplicationSummaryData = (viewType: ViewType, application: Application): ApplicationSummary => {
  const person = application.person as FullPerson
  const referrer = getReferrer(application)

  return {
    id: application.id,
    name: person?.name,
    applicationOrigin: application.applicationOrigin,
    crn: person?.crn,
    prisonNumber: person?.nomsNumber,
    prisonName: getCustodyLocation(application),
    referrerName: referrer?.name,
    contactEmail: referrer?.email,
    contactNumber: application.telephoneNumber ?? null,
    view: viewType,
  }
}

export const getCustodyLocation = (application: Application): string => {
  const person = isFullPerson(application.person) ? application.person : null
  if (person?.prisonName) return person.prisonName

  const { document } = application as Cas2v2SubmittedApplication
  const docPrisonName = document?.sections
    ?.find((s: { title: string }) => s.title === 'About the applicant')
    ?.tasks?.find((t: { title: string }) => t.title === 'Add personal information')
    ?.questionsAndAnswers?.find((q: { question: string }) => q.question?.trim().endsWith('being held in custody?'))
    ?.answer?.trim()
  if (docPrisonName) return docPrisonName

  const dataPrisonName = (application as Cas2v2Application).data?.['personal-information']?.['custody-location']
    ?.custodyLocation
  return dataPrisonName ?? null
}

const getReferrer = (application: Application) => {
  if (hasSubmittedBy(application)) {
    return application.submittedBy
  }
  if (hasCreatedBy(application)) {
    return application.createdBy
  }
  return null
}

function hasSubmittedBy(application: Application): application is Cas2v2SubmittedApplication {
  return !!(application as Cas2v2SubmittedApplication).submittedBy
}

function hasCreatedBy(application: Application): application is Cas2v2Application {
  return !!(application as Cas2v2Application).createdBy
}
