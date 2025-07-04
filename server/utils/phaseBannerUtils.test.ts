import { getContent } from './phaseBannerUtils'

describe('PhaseBannerUtils', () => {
  it('returns the phase banner content', () => {
    const feedbackSurveyUrl =
      'https://forms.office.com/Pages/ResponsePage.aspx?id=KEeHxuZx_kGp4S6MNndq2NyAjsSBbUdAmHEQmZLKk-lURTlTUUtBMFNMN0I3RDdQR0lIUlNZN0xBRi4u'
    const content = `This is a new service. <a class="govuk-link" rel="noreferrer noopener" target="_blank" href="${feedbackSurveyUrl}">Complete our feedback form</a> (opens in new tab) or <a class="govuk-link" href="mailto:cas2support@digital.justice.gov.uk">email us</a> (cas2support@digital.justice.gov.uk) to report a bug`

    expect(getContent()).toEqual(content)
  })
})
