import * as nunjucks from 'nunjucks'
import {
  RadioItem,
  CheckboxItem,
  ErrorMessages,
  HtmlItem,
  TextItem,
  SummaryListItem,
  type ObjectWithDateParts,
} from '@approved-premises/ui'
import {
  dateAndTimeInputsAreValidDates,
  dateIsComplete,
  dateIsTodayOrInTheFuture,
  dateIsTodayOrInThePast,
} from './dateUtils'

export const escape = (text: string): string => {
  const escapeFilter = new nunjucks.Environment().getFilter('escape')
  return escapeFilter(text).val
}

export function convertKeyValuePairToRadioItems<T extends object>(
  object: T,
  checkedItem: string,
  conditionals?: Record<string, unknown>,
): Array<RadioItem> {
  return Object.entries(object).map(([key, value]) => {
    return {
      value: key,
      text: value,
      checked: checkedItem === key,
      conditional: conditionals?.[key],
    }
  })
}

export function convertKeyValuePairToCheckboxItems<T extends object>(
  object: T,
  checkedItems: Array<string> = [],
): Array<CheckboxItem> {
  return Object.entries(object).map(([key, value]) => {
    return {
      value: key,
      text: value,
      checked: checkedItems.includes(key),
    }
  })
}

export const dateFieldValues = (fieldName: string, context: Record<string, unknown>, errors: ErrorMessages = {}) => {
  const errorClass = errors[fieldName] ? 'govuk-input--error' : ''
  return [
    {
      classes: `govuk-input--width-2 ${errorClass}`,
      name: 'day',
      value: context[`${fieldName}-day`],
    },
    {
      classes: `govuk-input--width-2 ${errorClass}`,
      name: 'month',
      value: context[`${fieldName}-month`],
    },
    {
      classes: `govuk-input--width-4 ${errorClass}`,
      name: 'year',
      value: context[`${fieldName}-year`],
    },
  ]
}

export const summaryListItem = (
  label: string,
  value: string,
  renderAs: keyof TextItem | keyof HtmlItem | 'textBlock' = 'text',
  supressBlank = false,
): SummaryListItem | undefined => {
  const htmlValue = renderAs === 'textBlock' ? `<span class="govuk-summary-list__textblock">${value}</span>` : value
  return !supressBlank || value
    ? {
        key: { text: label },
        value: renderAs === 'text' ? { text: value } : { html: htmlValue },
      }
    : undefined
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.gov\.uk$/i
  return emailRegex.test(email)
}

/**
 * Validates three-part dates in a form body
 * @param fieldName The prefix of the date to validate
 * @param fieldTitle The title of the date to display in error messages
 * @param body The form body
 * @param options - to check for future or past dates
 * @returns an errors object that can be spliced into other form errors
 * */
export const validateDateParts = <T>(
  fieldName: keyof T,
  fieldTitle: string,
  body: T,
  options: { future?: boolean; past?: boolean } = {},
): Record<keyof T, string> => {
  let error: string

  if (!dateIsComplete(body as never, fieldName as string)) error = `${fieldTitle} must be entered`
  if (!error && !dateAndTimeInputsAreValidDates(body as Partial<ObjectWithDateParts<0>>, fieldName as string))
    error = `${fieldTitle} must be a real date`
  if (!error && options.future && !dateIsTodayOrInTheFuture(body as never, fieldName as string))
    error = `${fieldTitle} must be in the future`
  if (!error && options.past && !dateIsTodayOrInThePast(body as never, fieldName as string))
    error = `${fieldTitle} must be in the past`

  return (error ? { [fieldName]: error } : {}) as Record<keyof T, string>
}
