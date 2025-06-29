import * as nunjucks from 'nunjucks'
import { RadioItem, CheckboxItem, ErrorMessages, HtmlItem, TextItem, SummaryListItem } from '@approved-premises/ui'

export const escape = (text: string): string => {
  const escapeFilter = new nunjucks.Environment().getFilter('escape')
  return escapeFilter(text).val
}

export function convertKeyValuePairToRadioItems<T>(object: T, checkedItem: string): Array<RadioItem> {
  return Object.keys(object).map(key => {
    return {
      value: key,
      // @ts-expect-error Requires refactor to satisfy TS7053
      text: object[key],
      checked: checkedItem === key,
    }
  })
}

export function convertKeyValuePairToCheckboxItems<T>(
  object: T,
  checkedItems: Array<string> = [],
): Array<CheckboxItem> {
  return Object.keys(object).map(key => {
    return {
      value: key,
      // @ts-expect-error Requires refactor to satisfy TS7053
      text: object[key],
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
): SummaryListItem => {
  const htmlValue = renderAs === 'textBlock' ? `<span class="govuk-summary-list__textblock">${value}</span>` : value
  return !supressBlank || value
    ? {
        key: { text: label },
        value: renderAs === 'text' ? { text: value } : { html: htmlValue },
      }
    : undefined
}
