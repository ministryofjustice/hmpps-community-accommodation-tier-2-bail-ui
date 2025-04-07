import { Cas2v2Application as Application } from '@approved-premises/api'
import { ObjectWithDateParts } from '@approved-premises/ui'
import { dateAndTimeInputsAreValidDates, DateFormats } from '../dateUtils'

const preferredAreasFromAppData = (application: Application): string => {
  // @ts-expect-error Requires refactor to satisfy TS7053
  const firstPreference: string = (application.data as Record<string, unknown>)?.['area-information']?.[
    'first-preferred-area'
  ]?.preferredArea

  // @ts-expect-error Requires refactor to satisfy TS7053
  const secondPreference: string = (application.data as Record<string, unknown>)?.['area-information']?.[
    'second-preferred-area'
  ]?.preferredArea

  return [firstPreference, secondPreference].filter(x => x).join(' | ')
}

const telephoneNumberFromAppData = (application: Application): string | null => {
  // @ts-expect-error Requires refactor to satisfy TS7053
  const telephoneNumber: string = (application.data as Record<string, unknown>)?.['referrer-details']?.[
    'contact-number'
  ]?.telephone

  return telephoneNumber || null
}

const bailHearingDateFromAppData = (application: Application): string | null => {
  // @ts-expect-error Requires refactor to satisfy TS7053
  const bailHearingDateObj: ObjectWithDateParts<'bailHearingDate'> = (application.data as Record<string, unknown>)?.[
    'bail-hearing-information'
  ]?.['bail-hearing-date']

  if (dateAndTimeInputsAreValidDates(bailHearingDateObj, 'bailHearingDate')) {
    return DateFormats.dateAndTimeInputsToIsoString(bailHearingDateObj, 'bailHearingDate').bailHearingDate
  }

  return null
}

export { preferredAreasFromAppData, telephoneNumberFromAppData, bailHearingDateFromAppData }
