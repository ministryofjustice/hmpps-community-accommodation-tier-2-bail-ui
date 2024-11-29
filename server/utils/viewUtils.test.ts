import * as viewUtilsModule from './viewUtils'
import * as formUtilsModule from './formUtils'

const { formatLines, validateReferer } = viewUtilsModule

jest.mock('../config', () => ({
  ingressUrl: 'https://test-domain.com',
}))

describe('formatLines', () => {
  let escapeSpy: jest.SpyInstance<string, [text: string]>

  beforeEach(() => {
    escapeSpy = jest.spyOn(formUtilsModule, 'escape')
    escapeSpy.mockClear()
  })

  it('replaces newlines with HTML line breaks', () => {
    expect(formatLines('Line 1\nLine 2\r\nLine 3\rLine 4')).toEqual('Line 1<br />Line 2<br />Line 3<br />Line 4')
    expect(escapeSpy).toBeCalledTimes(4)
  })

  it('replaces consecutive newlines with HTML paragraphs', () => {
    expect(formatLines('Paragraph 1, Line 1\nParagraph 1, Line 2\n\nParagraph 2')).toEqual(
      '<p>Paragraph 1, Line 1<br />Paragraph 1, Line 2</p><p>Paragraph 2</p>',
    )
    expect(escapeSpy).toBeCalledTimes(3)
  })

  it('ignores trailing whiespace', () => {
    expect(formatLines('\n\nParagraph 1, Line 1\nParagraph 1, Line 2\n\nParagraph 2  ')).toEqual(
      '<p>Paragraph 1, Line 1<br />Paragraph 1, Line 2</p><p>Paragraph 2</p>',
    )
    expect(escapeSpy).toBeCalledTimes(3)
  })

  it('escapes line contents', () => {
    expect(formatLines('<h2>Line 1</h2>\n<h2>Line 2</h2>')).toEqual(
      '&lt;h2&gt;Line 1&lt;/h2&gt;<br />&lt;h2&gt;Line 2&lt;/h2&gt;',
    )
    expect(escapeSpy).toHaveBeenCalledTimes(2)
  })

  it('returns the empty string when given null', () => {
    expect(formatLines(null)).toEqual('')
  })
})

describe('validateReferer', () => {
  describe('when the referer is from our own domain', () => {
    it('returns the referer path', () => {
      expect(validateReferer('https://test-domain.com/some-referer')).toEqual('https://test-domain.com/some-referer')
    })
  })

  describe('when the referer is from outside our domain', () => {
    it('returns the root path', () => {
      expect(validateReferer('https://example.com/some-external-referer')).toEqual('/')
    })
  })

  describe('when the referer is undefined, for any reason', () => {
    it('returns the root path', () => {
      expect(validateReferer(undefined)).toEqual('/')
    })
  })
})
