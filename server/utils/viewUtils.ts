import config from '../config'
import { escape } from './formUtils'

export const formatLines = (text: string): string => {
  if (!text) {
    return ''
  }

  const normalizedText = normalizeText(text)

  const paragraphs = normalizedText.split('\n\n').map(paragraph =>
    paragraph
      .split('\n')
      .map(line => escape(line))
      .join('<br />'),
  )

  if (paragraphs.length === 1) {
    return paragraphs[0]
  }
  return `<p>${paragraphs.join('</p><p>')}</p>`
}

export const validateReferer = (referer?: string): string => {
  if (!referer || !referer.startsWith(config.ingressUrl)) {
    return '/'
  }

  return referer
}

function normalizeText(text: string): string {
  let output = text.trim()

  output = output.replace(/(\r\n)/g, '\n')
  output = output.replace(/(\r)/g, '\n')
  output = output.replace(/(\n){2,}/g, '\n\n')

  return output
}
