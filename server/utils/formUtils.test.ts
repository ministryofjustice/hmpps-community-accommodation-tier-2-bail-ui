import { createMock } from '@golevelup/ts-jest'
import { ErrorMessages, type ObjectWithDateParts } from '@approved-premises/ui'
import { addDays, subDays } from 'date-fns'
import {
  escape,
  convertKeyValuePairToRadioItems,
  convertKeyValuePairToCheckboxItems,
  dateFieldValues,
  summaryListItem,
  isValidEmail,
  validateDateParts,
} from './formUtils'
import { DateFormats } from './dateUtils'

describe('formutils', () => {
  const obj = { foo: 'Foo', bar: 'Bar' }

  describe('escape', () => {
    it('escapes HTML tags', () => {
      expect(escape('<b>Formatted text</b>')).toEqual('&lt;b&gt;Formatted text&lt;/b&gt;')
    })

    it('escapes reserved characters', () => {
      expect(escape('"Quoted text"')).toEqual('&quot;Quoted text&quot;')
    })

    it('returns the empty string when given null', () => {
      expect(escape(null)).toEqual('')
    })
  })

  describe('convertKeyValuePairToRadioItems', () => {
    it('should convert a key value pair to radio items', () => {
      expect(convertKeyValuePairToRadioItems(obj, '')).toEqual([
        { value: 'foo', text: 'Foo', checked: false },
        { value: 'bar', text: 'Bar', checked: false },
      ])
    })

    it('should check the checked item', () => {
      expect(convertKeyValuePairToRadioItems(obj, 'foo')).toEqual([
        { value: 'foo', text: 'Foo', checked: true },
        { value: 'bar', text: 'Bar', checked: false },
      ])

      expect(convertKeyValuePairToRadioItems(obj, 'bar')).toEqual([
        { value: 'foo', text: 'Foo', checked: false },
        { value: 'bar', text: 'Bar', checked: true },
      ])
    })

    it('should inject conditionals from a map', () => {
      expect(convertKeyValuePairToRadioItems(obj, '', { bar: { html: 'Bar conditional' } })).toEqual([
        { value: 'foo', text: 'Foo', checked: false },
        { value: 'bar', text: 'Bar', checked: false, conditional: { html: 'Bar conditional' } },
      ])
    })
  })

  describe('convertKeyValuePairToCheckboxItems', () => {
    it('should convert a key value pair to checkbox items', () => {
      expect(convertKeyValuePairToCheckboxItems(obj, [])).toEqual([
        { value: 'foo', text: 'Foo', checked: false },
        { value: 'bar', text: 'Bar', checked: false },
      ])
    })

    it('should handle an undefined checkedItems value', () => {
      expect(convertKeyValuePairToCheckboxItems(obj, undefined)).toEqual([
        { value: 'foo', text: 'Foo', checked: false },
        { value: 'bar', text: 'Bar', checked: false },
      ])
    })

    it('should check the checked item', () => {
      expect(convertKeyValuePairToCheckboxItems(obj, ['foo'])).toEqual([
        { value: 'foo', text: 'Foo', checked: true },
        { value: 'bar', text: 'Bar', checked: false },
      ])

      expect(convertKeyValuePairToCheckboxItems(obj, ['foo', 'bar'])).toEqual([
        { value: 'foo', text: 'Foo', checked: true },
        { value: 'bar', text: 'Bar', checked: true },
      ])
    })
  })

  describe('dateFieldValues', () => {
    it('returns items with an error class when errors are present for the field', () => {
      const errors = createMock<ErrorMessages>({
        myField: {
          text: 'Some error message',
        },
      })
      const context = {
        'myField-day': 12,
        'myField-month': 11,
        'myField-year': 2022,
      }
      const fieldName = 'myField'

      expect(dateFieldValues(fieldName, context, errors)).toEqual([
        {
          classes: 'govuk-input--width-2 govuk-input--error',
          name: 'day',
          value: context['myField-day'],
        },
        {
          classes: 'govuk-input--width-2 govuk-input--error',
          name: 'month',
          value: context['myField-month'],
        },
        {
          classes: 'govuk-input--width-4 govuk-input--error',
          name: 'year',
          value: context['myField-year'],
        },
      ])
    })

    it('returns items without an error class when no errors are present for the field', () => {
      const errors = createMock<ErrorMessages>({
        someOtherField: {
          text: 'Some error message',
        },
        myField: undefined,
      })
      const context = {
        'myField-day': 12,
        'myField-month': 11,
        'myField-year': 2022,
      }
      const fieldName = 'myField'

      expect(dateFieldValues(fieldName, context, errors)).toEqual([
        {
          classes: 'govuk-input--width-2 ',
          name: 'day',
          value: context['myField-day'],
        },
        {
          classes: 'govuk-input--width-2 ',
          name: 'month',
          value: context['myField-month'],
        },
        {
          classes: 'govuk-input--width-4 ',
          name: 'year',
          value: context['myField-year'],
        },
      ])
    })

    it('returns items without an error class when no errors are present at all', () => {
      const context = {
        'myField-day': 12,
        'myField-month': 11,
        'myField-year': 2022,
      }
      const fieldName = 'myField'

      expect(dateFieldValues(fieldName, context)).toEqual([
        {
          classes: 'govuk-input--width-2 ',
          name: 'day',
          value: context['myField-day'],
        },
        {
          classes: 'govuk-input--width-2 ',
          name: 'month',
          value: context['myField-month'],
        },
        {
          classes: 'govuk-input--width-4 ',
          name: 'year',
          value: context['myField-year'],
        },
      ])
    })
  })

  describe('SummaryListItem', () => {
    const label = 'label'
    const value = 'test value'

    it('should return a summary list item', () => {
      expect(summaryListItem(label, value)).toEqual({ key: { text: label }, value: { text: value } })
      expect(summaryListItem(label, value, 'html')).toEqual({ key: { text: label }, value: { html: value } })
      expect(summaryListItem(label, value, 'textBlock')).toEqual({
        key: { text: label },
        value: { html: `<span class="govuk-summary-list__textblock">${value}</span>` },
      })
      expect(summaryListItem(label, undefined)).toEqual({ key: { text: label }, value: { text: undefined } })
    })

    it('should return undefined if value is falsey and blank suppression enabled', () => {
      expect(summaryListItem(label, '', 'text')).toEqual({ key: { text: label }, value: { text: '' } })
      expect(summaryListItem(label, '', 'text', true)).toEqual(undefined)
    })
  })

  describe('isValidEmail', () => {
    it.each([
      'invalid-email',
      'test@example.com',
      'test@gmail.com',
      '@justice.gov.uk',
      'http://justice.co.uk',
      'http://yahoo.com',
      'test@justice.go.uk',
      'test@justice.gov.ykj',
      'test@.gov.uk',
      'test @justice.gov.uk',
      'test@justice.gove.com',
      'test@justice .gov.uk',
      'test@ justice.gov.uk',
      'test@gov.uk',
    ])('should return false for invalid email: %s', email => {
      expect(isValidEmail(email)).toBe(false)
    })

    it.each(['test@justice.gov.uk', 'name@example.gov.uk', 'backup-name@example.gov.uk'])(
      'should return true for valid email: %s',
      email => {
        expect(isValidEmail(email)).toBe(true)
      },
    )
  })

  describe('validateDateParts', () => {
    type BodyType = ObjectWithDateParts<'testDate'>
    const futureDate = DateFormats.dateObjToIsoDate(addDays(new Date(), 10))
    const pastDate = DateFormats.dateObjToIsoDate(subDays(new Date(), 10))

    const tests = [
      ['2026-04-12', {}, {}],
      ['', { testDate: 'Test date must be entered' }, {}],
      ['2026-02-29', { testDate: 'Test date must be a real date' }, {}],
      ['not-a-date', { testDate: 'Test date must be a real date' }, {}],
      [futureDate, {}, { future: true }],
      [futureDate, { testDate: 'Test date must be in the past' }, { past: true }],
      [pastDate, {}, { past: true }],
      [pastDate, { testDate: 'Test date must be in the future' }, { future: true }],
    ]

    it.each(tests)(
      'Date %s',
      (iso: string, expected: Record<string, string>, options: { future: boolean; past: boolean }) => {
        const parts = iso.split('-')
        const body = { 'testDate-day': parts[2], 'testDate-month': parts[1], 'testDate-year': parts[0] }
        expect(validateDateParts<BodyType>('testDate', 'Test date', body, options)).toEqual(expected)
      },
    )
  })
})
